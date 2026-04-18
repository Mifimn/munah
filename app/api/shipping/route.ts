import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, weight, name, email, phone, address } = await request.json();
    const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;

    if (!SHIPBUBBLE_KEY) return NextResponse.json({ success: false, error: "Key Missing" }, { status: 500 });

    // --- STEP 1: SILENTLY GET THE RECEIVER CODE ---
    // This is the "secret fetch" you suggested!
    const validateRes = await fetch("https://api.shipbubble.com/v1/shipping/address/validate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`
      },
      body: JSON.stringify({
        name: name || "Musa Shittu",
        email: email || "customer@mifimn.com",
        phone: phone || "+2348000000000",
        address: address ? `${address}, ${city || state}, ${state}, Nigeria` : `${city || state}, ${state}, Nigeria`
      })
    });

    const validateData = await validateRes.json();
    
    // If validation fails, we can't get a price
    if (!validateRes.ok || !validateData.data?.address_code) {
      console.error("❌ Silent Validation Failed:", validateData);
      return NextResponse.json({ success: false, error: "Address validation failed" }, { status: 400 });
    }

    const receiverCode = validateData.data.address_code;
    console.log(`🚀 Step 1 Success: Receiver Code is ${receiverCode}`);

    // --- STEP 2: FETCH THE RATES USING THE CODES ---
    const response = await fetch("https://api.shipbubble.com/v1/shipping/fetch_rates", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`
      },
      body: JSON.stringify({
        sender_address_code: 553667261, // Modina's permanent code
        receiver_address_code: receiverCode, // The customer's new code
        packages: [{ weight: 2, length: 10, width: 10, height: 10 }]
      })
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      return NextResponse.json({ success: false, error: data.message }, { status: 400 });
    }

    const rates = data.data?.rates || [];
    const fezRate = rates.find((c: any) => c.courier_name.toLowerCase().includes("fez"));
    const finalFee = fezRate ? fezRate.total : (rates.sort((a: any, b: any) => a.total - b.total)[0]?.total || 5000);

    return NextResponse.json({ success: true, fee: finalFee });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
