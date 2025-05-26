import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const { orderId, orderNumber, type } = await request.json()

    if (!orderId || !orderNumber || type !== 'order_confirmation') {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 },
      )
    }

    // Get Payload instance
    const payloadInstance = await getPayload({ config })

    // Fetch the order details
    const order = await payloadInstance.findByID({
      collection: 'orders',
      id: orderId,
    })

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Extract email from order
    const email =
      typeof order.customer === 'object' && order.customer?.email
        ? order.customer.email
        : order.guestInfo?.email

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'No email address found for order' },
        { status: 400 },
      )
    }

    // Send email using Payload's email adapter (Resend)
    await payloadInstance.sendEmail({
      to: email,
      subject: 'Payment Confirmed - Order #' + orderNumber,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #92400e; margin-bottom: 20px;">Payment Confirmed!</h1>
          <p style="font-size: 16px; color: #444; margin-bottom: 20px;">
            Thank you for your payment! Your order has been confirmed and is being processed.
          </p>

          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #444; margin-bottom: 15px;">Order Details</h2>
            <p style="margin: 10px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
            <p style="margin: 10px 0;"><strong>Payment Status:</strong> Paid</p>
            <p style="margin: 10px 0;"><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p style="margin: 10px 0;"><strong>Payment Method:</strong> Online Payment (Razorpay)</p>
            
            <h3 style="color: #444; margin: 20px 0 10px 0;">Items Ordered:</h3>
            ${order.items
              .map(
                (item: any) => `
              <div style="margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 4px;">
                <p style="margin: 5px 0;"><strong>${item.productName || 'Product'}</strong></p>
                <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity}</p>
                <p style="margin: 5px 0; color: #666;">Price: ₹${item.price}</p>
              </div>
            `,
              )
              .join('')}
          </div>

          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #444; margin-bottom: 15px;">Shipping Address</h2>
            <p style="margin: 5px 0;">${order.shippingAddress.street}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.zipCode}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
          </div>

          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2d5a2d; margin-bottom: 15px;">What's Next?</h2>
            <p style="margin: 5px 0; color: #2d5a2d;">✅ Payment confirmed</p>
            <p style="margin: 5px 0; color: #2d5a2d;">📦 Order is being prepared</p>
            <p style="margin: 5px 0; color: #2d5a2d;">🚚 You'll receive tracking details once shipped</p>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            <p>If you have any questions, please contact our support team.</p>
            <p>Thank you for shopping with Crafted Corners!</p>
          </div>
        </div>
      `,
    })

    console.log(`Order confirmation email sent successfully to ${email} for order ${orderNumber}`)

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    })
  } catch (error: unknown) {
    console.error('Error sending email:', error)
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
  }
}
