import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Get what the customer typed on the checkout page
    const { state, city, address, name, email, phone } = await request.json();
    
    const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;
    if (!SHIPBUBBLE_KEY) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

    // --- STEP A: GET CODE FOR RECEIVER (The logic you suggested!) ---
    const validateResponse = await fetch("https://api.shipbubble.com/v1/shipping/address/validate", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name || "Musa Shittu", 
        email: email || "customer@mifimn.com",
        phone: phone || "+2348000000000",
        // We combine their street, city, and state into one string for Shipbubble
        address: `${address || city}, ${city}, ${state}, Nigeria`
      })
    });

    const validateData = await validateResponse.json();

    if (!validateResponse.ok || !validateData.data?.address_code) {
      console.error("❌ Could not get Receiver Code:", validateData);
      return NextResponse.json({ success: false, error: "Address validation failed" }, { status: 400 });
    }

    // Now we have the Receiver Code!
    const receiverCode = validateData.data.address_code;
    console.log(`✅ Receiver Code Generated: ${receiverCode}`);

    // --- STEP B: CONNECT TO CHECKOUT & FETCH RATES ---
    const rateResponse = await fetch("https://api.shipbubble.com/v1/shipping/fetch_rates", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender_address_code: 553667261, // Your Malete Sender Code
        receiver_address_code: receiverCode, // The code we just generated above!
        packages: [{ weight: 2, length: 10, width: 10, height: 10 }]
      })
    });

    const rateData = await rateResponse.json();

    if (!rateResponse.ok || rateData.status !== "success") {
      return NextResponse.json({ success: false, error: rateData.message }, { status: 400 });
    }

    // --- STEP C: SEND PRICE BACK TO FRONTEND ---
    const rates = rateData.data?.rates || [];
    const fezRate = rates.find((c: any) => c.courier_name.toLowerCase().includes("fez"));
    const finalFee = fezRate ? fezRate.total : (rates.sort((a: any, b: any) => a.total - b.total)[0]?.total || 5000);

    return NextResponse.json({ success: true, fee: finalFee });

  } catch (error: any) {
    console.error("❌ Server Crash:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
