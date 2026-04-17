import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, weight } = await request.json();
    console.log(`[BACKEND] Received request for: State=${state}, City=${city}`);

    const FEZ_URL = "https://apisandbox.fezdelivery.co/v1/rates"; 
    
    // Check if the API key even exists in your .env.local
    if (!process.env.FEZ_API_KEY) {
      console.error("[BACKEND] ❌ FEZ_API_KEY is missing from .env.local!");
      return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 500 });
    }

    const payload = {
      origin: "Lagos", 
      destination_state: state,
      destination_city: city || state,
      weight: weight || 2, 
    };

    console.log("[BACKEND] Sending this exact payload to Fez:", payload);

    const response = await fetch(FEZ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FEZ_API_KEY}` 
      },
      body: JSON.stringify(payload)
    });

    // If Fez rejects it, let's find out exactly WHY
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BACKEND] ❌ Fez rejected the request. Status: ${response.status}`);
      console.error(`[BACKEND] ❌ Fez Reason: ${errorText}`);
      throw new Error(`Fez API Error: ${errorText}`);
    }

    const data = await response.json();
    console.log("[BACKEND] ✅ Fez Success Data:", data);
    
    return NextResponse.json({ success: true, fee: data.price }); 

  } catch (error: any) {
    console.error("[BACKEND] ❌ Catch Block Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
