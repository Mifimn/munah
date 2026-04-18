import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, address, name, email, phone } = await request.json();
    const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;

    if (!SHIPBUBBLE_KEY) return NextResponse.json({ error: "Key Missing" }, { status: 500 });

    // --- STEP 1: SILENT RECEIVER VALIDATION ---
    const validateRes = await fetch("https://api.shipbubble.com/v1/shipping/address/validate", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name || "Modina Customer",
        email: email || "customer@mifimn.com",
        phone: phone || "+2348000000000",
        address: `${address || city}, ${city}, ${state}, Nigeria`
      })
    });

    const validateData = await validateRes.json();

    if (!validateRes.ok || !validateData.data?.address_code) {
      console.error("❌ Validation Failed:", validateData);
      return NextResponse.json({ success: false, error: "Receiver Validation Failed" }, { status: 400 });
    }

    const receiverCode = validateData.data.address_code;

    // --- STEP 2: FETCH RATES (Using YOUR Category ID) ---
    const today = new Date().toISOString().split('T')[0];

    const ratePayload = {
      sender_address_code: 553667261, 
      reciever_address_code: receiverCode, // Shipbubble documentation spelling
      pickup_date: today,
      category_id: 99652979, // ✅ Your specific Health and Beauty ID
      package_items: [
        {
          name: "Herbal Remedy",
          description: "Natural Medicine Product",
          unit_weight: "0.5",
          unit_amount: "5000",
          quantity: "1"
        }
      ],
      package_dimension: {
        length: 10,
        width: 10,
        height: 10
      }
    };

    const rateResponse = await fetch("https://api.shipbubble.com/v1/shipping/fetch_rates", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ratePayload)
    });

    const rateData = await rateResponse.json();

    if (!rateResponse.ok || rateData.status !== "success") {
      console.error("❌ Rate API Error:", rateData);
      return NextResponse.json({ success: false, error: rateData.message }, { status: 400 });
    }

    // --- STEP 3: EXTRACT PRICE ---
    const couriers = rateData.data?.couriers || [];
    
    // Log to terminal to see all options for debugging
    console.log("📦 Rates Found:", couriers.map((c: any) => `${c.courier_name}: ₦${c.total}`));

    const fezRate = couriers.find((c: any) => c.courier_name.toLowerCase().includes("fez"));
    
    // Final logic: Use Fez, fallback to the 'cheapest_courier' object, then ₦5000
    const finalFee = fezRate ? fezRate.total : (rateData.data?.cheapest_courier?.total || 5000);

    return NextResponse.json({ success: true, fee: finalFee });

  } catch (error: any) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
