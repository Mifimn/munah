import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, name, email, phone, address } = await request.json();
    
    const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;
    if (!SHIPBUBBLE_KEY) {
      return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 500 });
    }

    // --- STEP 1: VALIDATE THE RECIPIENT TO GET A CODE ---
    // This is the step that fixes the "Recipient address code is required" error
    const validatePayload = {
      name: name || "Modina Customer",
      email: email || "customer@modina.com",
      phone: phone || "+2348000000000",
      address: address ? `${address}, ${city || state}, ${state}, Nigeria` : `${city || state}, ${state}, Nigeria`
    };

    const validateRes = await fetch("https://api.shipbubble.com/v1/shipping/address/validate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`
      },
      body: JSON.stringify(validatePayload)
    });

    const validateData = await validateRes.json();

    if (!validateRes.ok || validateData.status !== "success") {
      console.error("❌ Validation Error:", validateData);
      return NextResponse.json({ success: false, error: "Address validation failed" }, { status: 400 });
    }

    const receiverCode = validateData.data.address_code;
    console.log(`✅ receiver_address_code generated: ${receiverCode}`);

    // --- STEP 2: FETCH THE RATES USING THE NEW CODE ---
    const response = await fetch("https://api.shipbubble.com/v1/shipping/fetch_rates", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`
      },
      body: JSON.stringify({
        sender_address_code: 553667261, // Your validated Malete code
        receiver_address_code: receiverCode, // The code we just generated!
        packages: [
          {
            weight: 2,
            length: 10,
            width: 10,
            height: 10
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      return NextResponse.json({ success: false, error: data.message }, { status: 400 });
    }

    const rates = data.data?.rates || [];
    
    // Find Fez specifically
    const fezRate = rates.find((c: any) => c.courier_name.toLowerCase().includes("fez"));
    
    // If Fez exists, return it. Otherwise, return the cheapest option.
    const finalFee = fezRate ? fezRate.total : (rates.sort((a: any, b: any) => a.total - b.total)[0]?.total || 5000);

    return NextResponse.json({ success: true, fee: finalFee });

  } catch (error: any) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
