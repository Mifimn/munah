import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, address, name, email, phone } = await request.json();
    const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;

    if (!SHIPBUBBLE_KEY) return NextResponse.json({ error: "Key Missing" }, { status: 500 });

    // --- STEP 1: GET THE RECEIVER CODE (Same as before) ---
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
      return NextResponse.json({ success: false, error: "Receiver Validation Failed" }, { status: 400 });
    }

    const receiverCode = validateData.data.address_code;

    // --- STEP 2: FETCH RATES (Updated for NEW Documentation) ---
    // We generate today's date for the pickup_date requirement
    const today = new Date().toISOString().split('T')[0];

    const ratePayload = {
      sender_address_code: 553667261, 
      reciever_address_code: receiverCode, // Note the spelling 'reciever' from docs!
      pickup_date: today,
      category_id: 1, // General Health/Goods
      package_items: [
        {
          name: "Herbal Remedy",
          description: "Natural Cure Product",
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
        console.error("Rate Error Details:", rateData);
      return NextResponse.json({ success: false, error: rateData.message }, { status: 400 });
    }

    // --- STEP 3: EXTRACT PRICE ---
    // The new docs show rates are inside data.couriers
    const couriers = rateData.data?.couriers || [];
    
    // Look for Fez
    const fezRate = couriers.find((c: any) => c.courier_name.toLowerCase().includes("fez"));
    
    // Fallback to the 'cheapest_courier' if Fez isn't found
    const finalFee = fezRate ? fezRate.total : (rateData.data?.cheapest_courier?.total || 5000);

    return NextResponse.json({ success: true, fee: finalFee });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
