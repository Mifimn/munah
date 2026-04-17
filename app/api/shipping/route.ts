import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, weight } = await request.json();
    console.log(`[BACKEND] Received LIVE request for: State=${state}, City=${city}`);

    // --- SWITCHED TO THE LIVE PRODUCTION URL ---
    const FEZ_URL = "https://api.fezdelivery.co/v1/rates"; 
    
    // Check if the API key exists
    if (!process.env.FEZ_API_KEY) {
      console.error("[BACKEND] ❌ FEZ_API_KEY is missing from .env.local!");
      return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 500 });
    }

    const payload = {
      origin: "Lagos", // Ensure this is Modina's actual dispatch state
      destination_state: state,
      destination_city: city || state,
      weight: weight || 2, 
    };

    console.log("[BACKEND] Sending this payload to LIVE Fez:", payload);

    const response = await fetch(FEZ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FEZ_API_KEY}` 
      },
      body: JSON.stringify(payload)
    });

    // If Live Fez rejects it, catch the exact error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BACKEND] ❌ Live Fez rejected the request. Status: ${response.status}`);
      console.error(`[BACKEND] ❌ Live Fez Reason: ${errorText}`);
      throw new Error(`Live Fez API Error: ${errorText}`);
    }

    const data = await response.json();
    console.log("[BACKEND] ✅ Live Fez Success Data:", data);
    
    // Note: If Fez structures their live JSON response differently (e.g., data.data.price), 
    // we will see it in the console log and can adjust this line!
    return NextResponse.json({ success: true, fee: data.price }); 

  } catch (error: any) {
    console.error("[BACKEND] ❌ Catch Block Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
