import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Replace with your Razorpay key_secret
const secret_key = 'xxxxxxxxxxxx' // Replace with your actual test key_secret - should match the one in razorpay route

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = data

    // Verify signature
    const hmac = crypto.createHmac('sha256', secret_key)
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
    const digest = hmac.digest('hex')

    if (digest === razorpay_signature) {
      // Payment verification successful

      // Create the order in our database now that payment is verified
      if (orderDetails) {
        // Create the order through our API
        try {
          const orderResponse = await fetch('/api/orders', {
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
                razorpay_id: razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              },
              guestInfo: orderDetails.customerInfo,
              shippingAddress: orderDetails.shippingAddress || {
                street: 'To be updated',
                city: 'To be updated',
                state: 'To be updated',
                zipCode: 'To be updated',
                country: 'India',
              },
            }),
          })

          const orderData = await orderResponse.json()

          return NextResponse.json({
            success: true,
            message: 'Payment verified and order created successfully',
            order: orderData,
          })
        } catch (orderError) {
          console.error('Failed to create order after payment:', orderError)
          return NextResponse.json({
            success: true,
            message: 'Payment verified but order creation failed. Please contact support.',
            paymentId: razorpay_payment_id,
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
      })
    } else {
      // Payment verification failed
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error('Razorpay verification error:', error)
    return NextResponse.json({ success: false, error: 'Failed to verify payment' }, { status: 500 })
  }
}
