import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { state, city, weight } = await request.json();

    // The Fez Sandbox Testing URL
    const FEZ_URL = "https://apisandbox.fezdelivery.co/v1/rates"; 

    // Make the secure request to Fez
    const response = await fetch(FEZ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FEZ_API_KEY}` // Your hidden key!
      },
      body: JSON.stringify({
        origin: "Lagos", // Hardcode Modina's state here
        destination_state: state,
        destination_city: city || state,
        weight: weight || 2, // Assuming 2kg default
      })
    });

    if (!response.ok) {
      throw new Error("Fez API failed to return a valid rate.");
    }

    const data = await response.json();
    
    // Send the successful price back to the checkout page
    return NextResponse.json({ success: true, fee: data.price }); // Change 'data.price' based on Fez's exact JSON response

  } catch (error) {
    console.error("Fez API Error:", error);
    // If Fez fails, we return success: false so the frontend knows to use Supabase
    return NextResponse.json({ success: false, error: "API Failed" }, { status: 500 });
  }
}
