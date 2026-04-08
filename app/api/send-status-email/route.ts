import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, orderNumber, status } = await request.json();

    // Custom messages based on the status
    let subject = "";
    let message = "";

    switch (status) {
      case "In Formulation":
        subject = `Apothecary Update: Your order ${orderNumber} is being prepared`;
        message = `We have received your order and our clinical team is currently formulating and preparing your remedies.`;
        break;
      case "Ready for Dispatch":
        subject = `Logistics Update: Order ${orderNumber} is ready`;
        message = `Your remedies have been sealed and are currently awaiting pickup by our dispatch logistics team.`;
        break;
      case "Dispatched":
        subject = `Dispatch Alert: Order ${orderNumber} is on the way!`;
        message = `Your order has been handed over to our delivery partners and is officially in transit to your location.`;
        break;
      case "Delivered":
        subject = `Delivered: Your Natural Cure remedies have arrived`;
        message = `Your order has been successfully delivered. Thank you for trusting the Natural Cure Apothecary with your health protocol.`;
        break;
      default:
        subject = `Update on your Natural Cure Order: ${orderNumber}`;
        message = `Your order status has been updated to: ${status}.`;
    }

    const { data, error } = await resend.emails.send({
      from: 'Natural Cure Apothecary <hello@naturalcureherbalmedicine.com>', // MUST match your verified Resend domain
      to: email,
      subject: subject,
      // Minimal HTML to ensure it bypasses "Promotions/Updates" and hits the Primary Inbox
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; max-width: 600px; font-size: 16px; line-height: 1.6;">
          <p>Dear ${name},</p>
          <p>${message}</p>
          <p><strong>Order Reference:</strong> ${orderNumber}</p>
          <br>
          <p>In health,</p>
          <p><strong>Modina Olagunju</strong><br>
          <span style="color: #666666; font-size: 14px;">The Natural Cure Apothecary</span></p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
