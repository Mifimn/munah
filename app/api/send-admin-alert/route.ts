// app/api/send-admin-alert/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { orderNumber, customerName, customerPhone, totalAmount } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Natural Cure System <hello@naturalcureherbalmedicine.com>', // Your verified domain
      to: 'naturalcureherbalmedicine@gmail.com', // Modina's email
      subject: `New Order Alert: ${orderNumber} - ₦${totalAmount.toLocaleString()}`,
      // Very minimal CSS to ensure it hits the Primary Inbox
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; font-size: 16px; line-height: 1.6; max-width: 600px;">
          <p>Hello Modina,</p>
          <p>You have just received a new order on the Natural Cure platform.</p>
          <p>
            <strong>Order Number:</strong> ${orderNumber}<br/>
            <strong>Customer:</strong> ${customerName}<br/>
            <strong>Phone:</strong> ${customerPhone}<br/>
            <strong>Total Settlement:</strong> ₦${totalAmount.toLocaleString()}
          </p>
          <p>Please log in to your admin Command Center to view the dispatch location and formulation list.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Your Store System</strong></p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send admin alert" }, { status: 500 });
  }
}