import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, weight } = await request.json();
    console.log(`[BACKEND] New Shipping Request: State=${state}, City=${city}`);

    // Verify credentials exist
    const userId = process.env.FEZ_USER_ID;
    const password = process.env.FEZ_PASSWORD;

    if (!userId || !password) {
      console.error("[BACKEND] ❌ FEZ_USER_ID or FEZ_PASSWORD missing in .env.local!");
      return NextResponse.json({ success: false, error: "Missing API Credentials" }, { status: 500 });
    }

    // ==========================================
    // STEP 1: AUTHENTICATE TO GET TOKENS
    // ==========================================
    console.log("[BACKEND] Step 1: Authenticating with Fez...");
    
    // Use api.fezdelivery.co for live, or apisandbox for test
    const AUTH_URL = "https://api.fezdelivery.co/v1/user/authenticate"; 
    
    const authResponse = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        password: password
      })
    });

    const authData = await authResponse.json();

    if (!authResponse.ok || authData.status !== "Success") {
      console.error("[BACKEND] ❌ Fez Auth Failed:", authData);
      return NextResponse.json({ success: false, error: "Fez Authentication Failed" }, { status: 401 });
    }

    // Extract the temporary keys from Fez's response
    const bearerToken = authData.authDetails.authToken;
    const secretKey = authData.orgDetails["secret-key"];

    console.log("[BACKEND] ✅ Auth Success! Keys acquired.");

    // ==========================================
    // STEP 2: FETCH SHIPPING RATES
    // ==========================================
    console.log("[BACKEND] Step 2: Fetching live rates...");
    
    const RATES_URL = "https://api.fezdelivery.co/v1/rates";
    
    const ratePayload = {
      origin: "Lagos", // Ensure this matches Modina's dispatch state
      destination_state: state,
      destination_city: city || state,
      weight: weight || 2, 
    };

    const rateResponse = await fetch(RATES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`, // Added the Bearer token
        'secret-key': secretKey                   // Added the required secret-key header
      },
      body: JSON.stringify(ratePayload)
    });

    const rateData = await rateResponse.json();

    if (!rateResponse.ok || rateData.status === "Error") {
      console.error("[BACKEND] ❌ Rate Fetch Failed:", rateData);
      return NextResponse.json({ 
        success: false, 
        error: rateData.description || "Fez rejected the route." 
      });
    }

    console.log("[BACKEND] ✅ Live Fez Rate Success:", rateData);
    return NextResponse.json({ success: true, fee: rateData.price }); 

  } catch (error: any) {
    console.error("[BACKEND] ❌ Server Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
