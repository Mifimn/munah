import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, weight } = await request.json();
    console.log(`[BACKEND] Shipbubble Live Request: Kwara (Offa) to ${state} (${city || state})`);

    const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;
    if (!SHIPBUBBLE_KEY) {
      console.error("[BACKEND] ❌ Missing SHIPBUBBLE_API_KEY in .env.local");
      return NextResponse.json({ success: false, error: "API Key Configuration Error" }, { status: 500 });
    }

    const URL = "https://api.shipbubble.com/v1/shipping/fetch_rates"; 

    // Shipbubble Payload
    const payload = {
      sender_details: {
        state: "Kwara",
        city: "Offa" 
      },
      receiver_details: {
        state: state,
        city: city || state
      },
      packages: [
        {
          weight: weight || 2,
          length: 10, // Default dimensions required by most courier APIs
          width: 10,
          height: 10
        }
      ]
    };

    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}` 
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Catch Shipbubble routing errors
    if (!response.ok || data.status !== "success") {
      console.error("[BACKEND] ❌ Shipbubble Error Response:", data);
      return NextResponse.json({ 
        success: false, 
        error: data.message || "Failed to fetch shipping rates." 
      }, { status: 400 });
    }

    const availableCouriers = data.data?.rates || [];
    console.log("[BACKEND] 📦 Available Couriers:", availableCouriers.map((c: any) => `${c.courier_name} (₦${c.total})`));

    if (availableCouriers.length === 0) {
      return NextResponse.json({ success: false, error: "No couriers available for this route." });
    }

    // Attempt to find Fez specifically
    const fezRate = availableCouriers.find((courier: any) => 
      courier.courier_name.toLowerCase().includes("fez")
    );

    if (fezRate) {
      console.log(`[BACKEND] ✅ Found Fez Delivery: ₦${fezRate.total}`);
      return NextResponse.json({ success: true, fee: fezRate.total }); 
    } 

    // Fallback: If Fez isn't on the list, grab the cheapest available courier
    const cheapestAlternative = availableCouriers.sort((a: any, b: any) => a.total - b.total)[0];
    console.log(`[BACKEND] ⚠️ Fez unavailable. Using cheapest alternative (${cheapestAlternative.courier_name}): ₦${cheapestAlternative.total}`);
    
    return NextResponse.json({ success: true, fee: cheapestAlternative.total });

  } catch (error: any) {
    console.error("[BACKEND] ❌ Server Error:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
