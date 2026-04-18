import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 👇 Notice we now accept "country" from the frontend!
    const { state, weight, country } = await request.json();
    
    const FEZ_USER_ID = process.env.FEZ_USER_ID;
    const FEZ_PASSWORD = process.env.FEZ_PASSWORD;

    if (!FEZ_USER_ID || !FEZ_PASSWORD) {
      console.error("❌ Fez Credentials Missing in Vercel");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // --- STEP 1: SILENT AUTHENTICATION (Get Fresh Keys) ---
    const authResponse = await fetch("https://api.fezdelivery.co/v1/user/authenticate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: FEZ_USER_ID, password: FEZ_PASSWORD })
    });

    const authData = await authResponse.json();

    if (authData.status !== "Success") {
      return NextResponse.json({ success: false, error: "Auth Failed" }, { status: 401 });
    }

    const freshAuthToken = authData.authDetails.authToken;
    const freshSecretKey = authData.orgDetails['secret-key'];
    const finalWeight = weight ? parseFloat(weight) : 0.5;

    // =========================================================
    // 🌍 ROUTE A: NIGERIA (LOCAL SHIPPING)
    // =========================================================
    if (country === "NG" || !country) {
      console.log(`[BACKEND] Local Route: Fetching rate to ${state}...`);
      const costPayload = {
        state: state,
        pickUpState: "Lagos",
        weight: finalWeight,
        locker: false
      };

      const costResponse = await fetch("https://api.fezdelivery.co/v1/order/cost", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${freshAuthToken}`,
          'secret-key': freshSecretKey
        },
        body: JSON.stringify(costPayload)
      });

      const costData = await costResponse.json();
      if (costData.status !== "Success") throw new Error(costData.description);
      
      return NextResponse.json({ success: true, fee: costData.totalCost });
    } 
    
    // =========================================================
    // ✈️ ROUTE B: INTERNATIONAL (EXPORT SHIPPING)
    // =========================================================
    else {
      console.log(`[BACKEND] Export Route: Fetching international rate to ${country}...`);
      
      // Fez Export Location ID Map based on their documentation
      const fezExportMap: Record<string, number> = {
        "CA": 1, // Canada
        "GB": 2, // United Kingdom
        "US": 3, // United States
        "GH": 5, // Ghana
        "AE": 6, // UAE
        "CI": 7, // Cote D'Ivoire
        "IE": 8, // Ireland
        "AU": 9, // Australia
        "CN": 10, // China
        "IN": 17 // India
      };

      const exportLocationId = fezExportMap[country];

      // If they pick a country Fez doesn't support, fallback to a flat 45k
      if (!exportLocationId) {
        console.log(`⚠️ Country ${country} not supported by Fez API. Using flat rate fallback.`);
        return NextResponse.json({ success: true, fee: 45000 });
      }

      // Fez Weight IDs: ID 1 usually maps to the standard "0-2kg" tier
      const weightId = 1; 

      const exportPayload = {
        exportLocationId: exportLocationId,
        weightId: weightId
      };

      const exportResponse = await fetch("https://api.fezdelivery.co/v1/orders/export-price", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${freshAuthToken}`,
          'secret-key': freshSecretKey
        },
        body: JSON.stringify(exportPayload)
      });

      const exportData = await exportResponse.json();

      if (exportData.status !== "Success") throw new Error(exportData.description);

      // Fez returns international price inside data.price as a string
      const intlFee = parseFloat(exportData.data.price);
      console.log(`✅ FEZ EXPORT SUCCESS: ₦${intlFee}`);
      
      return NextResponse.json({ success: true, fee: intlFee });
    }

  } catch (error: any) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
