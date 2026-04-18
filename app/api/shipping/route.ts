import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Get destination and weight from your frontend checkout
    const { state, weight } = await request.json();
    
    // 2. Fetch the exact key you saved in Vercel
    const FEZ_API_KEY = process.env.FEZ_API_KEY;

    if (!FEZ_API_KEY) {
      console.error("❌ Fez API Key is missing from Environment Variables");
      return NextResponse.json({ error: "Fez API Key Missing" }, { status: 500 });
    }

    // Default to 0.5kg for light herbal medicine if frontend weight is missing
    const finalWeight = weight ? parseFloat(weight) : 0.5;

    console.log(`[BACKEND] Fetching Fez direct rate from Lagos to ${state} for ${finalWeight}kg...`);

    // 3. The Clean Fez Payload
    const payload = {
      state: state,           // Customer's selected state
      pickUpState: "Lagos",   // Modina's warehouse state
      weight: finalWeight,    // The dynamic weight
      locker: false           // Standard doorstep delivery
    };

    // 4. Fire the request directly to Fez
    const response = await fetch("https://api.fezdelivery.co/v1/order/cost", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // We pass your single Vercel key into both required header slots
        'Authorization': `Bearer ${FEZ_API_KEY}`,
        'secret-key': FEZ_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // 5. Handle Fez's response
    if (data.status !== "Success") {
      console.error("❌ Fez API Error:", data);
      return NextResponse.json({ success: false, error: data.description || "Failed to fetch Fez cost" }, { status: 400 });
    }

    // Fez returns the final VAT-inclusive cost right here
    const finalFee = data.totalCost;
    console.log(`✅ Direct Fez Rate Applied: ₦${finalFee}`);

    return NextResponse.json({ success: true, fee: finalFee });

  } catch (error: any) {
    console.error("❌ Server Error Crash:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
