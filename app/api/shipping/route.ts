import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, weight } = await request.json();
    console.log(`[BACKEND] Shipbubble Live Request: Dispatch to ${state} (${city || state})`);

    const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;
    if (!SHIPBUBBLE_KEY) {
      console.error("[BACKEND] ❌ Missing SHIPBUBBLE_API_KEY in .env.local");
      return NextResponse.json({ success: false, error: "API Key Configuration Error" }, { status: 500 });
    }

    // ==========================================
    // STEP 1: SECRETLY VALIDATE CUSTOMER DESTINATION
    // ==========================================
    const validateUrl = "https://api.shipbubble.com/v1/shipping/address/validate";
    
    // We pass the State and City to get a valid destination code. 
    // We use dummy data for the rest since we only need a pricing quote!
    const validatePayload = {
      name: "Modina Customer", 
      email: "customer@modina.com",
      phone: "+2348000000000",
      address: `${city || state}, ${state}, Nigeria` 
    };

    console.log("[BACKEND] 🔄 Validating customer location...");
    const validateRes = await fetch(validateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`
      },
      body: JSON.stringify(validatePayload)
    });

    const validateData = await validateRes.json();

    if (!validateRes.ok || validateData.status !== "success") {
      console.error("[BACKEND] ❌ Customer Validation Error:", validateData);
      return NextResponse.json({ success: false, error: "Could not validate delivery location." }, { status: 400 });
    }

    // Grab the golden ticket for the destination!
    const receiverCode = validateData.data.address_code;
    console.log(`[BACKEND] ✅ Customer Location Validated! Receiver Code: ${receiverCode}`);


    // ==========================================
    // STEP 2: FETCH THE RATES
    // ==========================================
    const URL = "https://api.shipbubble.com/v1/shipping/fetch_rates"; 

    // We now pass BOTH the verified sender code and the newly generated receiver code
    const payload = {
      sender_address_code: 553667261, 
      receiver_address_code: receiverCode, // Replaces receiver_details!
      packages: [
        {
          weight: weight || 2,
          length: 10, 
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
