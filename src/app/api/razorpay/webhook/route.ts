import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Replace with your Razorpay webhook secret
const webhookSecret = 'gnrcASyqYYTUPNlf9ziT6tw9' // Use your Razorpay key_secret for signing

export async function POST(request: Request) {
  try {
    // Get Razorpay signature from headers
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      console.error('No Razorpay signature provided')
      return NextResponse.json(
        { success: false, error: 'Signature verification failed' },
        { status: 400 },
      )
    }

    // Get the raw body as text for signature verification
    const bodyText = await request.text()

    // Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyText)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Signature verification failed')
      return NextResponse.json(
        { success: false, error: 'Signature verification failed' },
        { status: 400 },
      )
    }

    // Parse the body
    const eventBody = JSON.parse(bodyText)
    const event = eventBody.event
    const payload = eventBody.payload

    console.log('Razorpay webhook received:', event)

    // Handle different event types
    switch (event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(payload)
        break
      case 'payment.failed':
        await handlePaymentFailed(payload)
        break
      case 'payment.captured':
        await handlePaymentCaptured(payload)
        break
      default:
        console.log('Unhandled event type:', event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 },
    )
  }
}

async function handlePaymentAuthorized(payload: any) {
  // Payment has been authorized but not yet captured
  const payment = payload.payment.entity
  const orderId = payment.order_id

  console.log('Payment authorized:', payment.id, 'for order:', orderId)

  // Retrieve the tempOrderId from payment notes
  const tempOrderId = payment.notes?.tempOrderId

  if (!tempOrderId) {
    console.error('No tempOrderId found in payment', payment.id)
    return
  }

  try {
    // Retrieve stored order details
    const orderDetailsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/razorpay/store-order-details?id=${tempOrderId}`,
      { method: 'GET' },
    )

    if (!orderDetailsResponse.ok) {
      throw new Error('Failed to retrieve order details')
    }

    const { orderDetails } = await orderDetailsResponse.json()

    if (!orderDetails) {
      throw new Error('Order details not found')
    }

    // Create order in database
    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: orderDetails.items,
        totalAmount: orderDetails.amount,
        paymentMethod: 'razorpay',
        isPaid: true,
        status: 'processing',
        razorpayDetails: {
          razorpay_id: orderId,
          payment_id: payment.id,
          amount_paid: payment.amount,
          currency: payment.currency,
        },
        guestInfo: orderDetails.customerInfo,
        shippingAddress: orderDetails.shippingAddress,
      }),
    })

    if (!orderResponse.ok) {
      throw new Error('Failed to create order record')
    }

    console.log('Order created successfully for payment:', payment.id)
  } catch (error) {
    console.error('Failed to process order after payment authorization:', error)
  }
}

async function handlePaymentFailed(payload: any) {
  // Payment has failed
  const payment = payload.payment.entity
  const orderId = payment.order_id
  console.log('Payment failed:', payment.id, 'for order:', orderId)

  // Retrieve the tempOrderId from payment notes if exists
  const tempOrderId = payment.notes?.tempOrderId

  try {
    let customerInfo = { email: 'unknown', name: 'unknown' }
    let orderItems = []

    // Try to retrieve stored order details if tempOrderId exists
    if (tempOrderId) {
      try {
        const orderDetailsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ''}/api/razorpay/store-order-details?id=${tempOrderId}`,
          { method: 'GET' },
        )

        if (orderDetailsResponse.ok) {
          const { orderDetails } = await orderDetailsResponse.json()
          if (orderDetails && orderDetails.customerInfo) {
            customerInfo = orderDetails.customerInfo
            orderItems = orderDetails.items || []
          }
        }
      } catch (error) {
        console.error('Error retrieving order details for failed payment:', error)
      }
    }

    // Record the failed payment for tracking (you can use your preferred storage method)
    // Here we'll just log it with more details
    console.log('Payment failure details:', {
      paymentId: payment.id,
      orderId: orderId,
      amount: payment.amount / 100, // Convert from paise
      currency: payment.currency,
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      errorCode: payment.error_code,
      errorDescription: payment.error_description,
      items: orderItems,
      timestamp: new Date().toISOString(),
    })

    // For a production app, you might want to:
    // 1. Send a notification to the customer about the failed payment
    // 2. Store the failed payment in your database for analysis
    // 3. Provide a recovery path for the customer to try again
  } catch (error) {
    console.error('Error handling failed payment:', error)
  }
}

async function handlePaymentCaptured(payload: any) {
  // Payment has been captured (fully completed)
  const payment = payload.payment.entity
  const orderId = payment.order_id
  console.log('Payment captured:', payment.id, 'for order:', orderId)

  try {
    // In a complete implementation, you would:
    // 1. Find the order in your database by Razorpay order ID
    // 2. Update its status to "paid" or "processing"
    // 3. Send a confirmation email to the customer

    // Example of how to update order status (pseudo-code based on your API structure)
    try {
      // This is just a placeholder - you would need to implement your orders API accordingly
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/orders/update-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpayOrderId: orderId,
            status: 'paid',
            paymentId: payment.id,
            isPaid: true,
            // Add additional payment details if needed
            amount_paid: payment.amount,
            method: payment.method,
            captured: true,
            // You might also want to keep track of fees
            fee: payment.fee,
            tax: payment.tax,
          }),
        },
      )

      if (updateResponse.ok) {
        console.log('Order status updated to paid for payment:', payment.id)

        // Optionally, send confirmation email here
        // await sendOrderConfirmationEmail(...)
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  } catch (error) {
    console.error('Error handling captured payment:', error)
  }
}
