import { NextResponse } from 'next/server';

export async function GET() {
  const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;
  const payload = {
    name: "Modina Natural Cure",
    email: "shittumifimn0807@gmail.com",
    phone: "+2348023169274",
    address: "1, OLAGUNJU OMOTAYO CRESCENT, ATUNSE STREET, LAGOS, LAGOS STATE, NIGERIA"
  };

  const response = await fetch("https://api.shipbubble.com/v1/shipping/address/validate", {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SHIPBUBBLE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return NextResponse.json(data);
}
