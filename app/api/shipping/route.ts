import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Get destination and weight from your frontend checkout
    const { state, weight } = await request.json();
    
    // 2. Fetch the secure login details you saved in Vercel
    const FEZ_USER_ID = process.env.FEZ_USER_ID;
    const FEZ_PASSWORD = process.env.FEZ_PASSWORD;

    if (!FEZ_USER_ID || !FEZ_PASSWORD) {
      console.error("❌ Fez Credentials Missing in Vercel");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // --- STEP 1: SILENT AUTHENTICATION (Get Fresh Keys) ---
    // Note: If live fails, you can switch 'api.fezdelivery.co' to 'apisandbox.fezdelivery.co'
    const authResponse = await fetch("https://api.fezdelivery.co/v1/user/authenticate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: FEZ_USER_ID,
        password: FEZ_PASSWORD
      })
    });

    const authData = await authResponse.json();

    if (authData.status !== "Success") {
      console.error("❌ Fez Authentication Failed:", authData);
      return NextResponse.json({ success: false, error: authData.description || "Auth Failed" }, { status: 401 });
    }

    // Extract the fresh keys from the response
    const freshAuthToken = authData.authDetails.authToken;
    const freshSecretKey = authData.orgDetails['secret-key'];

    console.log(`[BACKEND] Auth Success! Fetching rate to ${state}...`);

    // --- STEP 2: FETCH THE SHIPPING COST ---
    // Default to 0.5kg for light herbal medicine if frontend weight is missing
    const finalWeight = weight ? parseFloat(weight) : 0.5;

    const costPayload = {
      state: state,           // Customer's selected state
      pickUpState: "Lagos",   // Modina's warehouse state
      weight: finalWeight,    // The dynamic cart weight
      locker: false           // Standard doorstep delivery
    };

    const costResponse = await fetch("https://api.fezdelivery.co/v1/order/cost", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${freshAuthToken}`, // The fresh token
        'secret-key': freshSecretKey                 // The fresh secret key
      },
      body: JSON.stringify(costPayload)
    });

    const costData = await costResponse.json();

    if (costData.status !== "Success") {
      console.error("❌ Fez Cost Error:", costData);
      return NextResponse.json({ success: false, error: costData.description || "Failed to fetch cost" }, { status: 400 });
    }

    // Fez returns the final VAT-inclusive cost right here
    const finalFee = costData.totalCost;
    console.log(`✅ Direct Fez Rate Applied: ₦${finalFee}`);

    return NextResponse.json({ success: true, fee: finalFee });

  } catch (error: any) {
    console.error("❌ Server Error Crash:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
