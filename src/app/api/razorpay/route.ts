import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { randomUUID } from 'crypto'

// Initialize Razorpay with test keys
const razorpayConfig = {
  key_id: 'rzp_test_05C0eFmEf8MtGL', // Replace with your actual test key_id
  key_secret: 'gnrcASyqYYTUPNlf9ziT6tw9', // Replace with your actual test key_secret
}

const razorpay = new Razorpay(razorpayConfig)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { items, amount, customerName, email, phone } = data

    // Create Razorpay order options
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: randomUUID(),
      payment_capture: 1,
      notes: {
        customerName,
        email,
        phone,
      },
    }

    // Create order on Razorpay
    const response = await razorpay.orders.create(options)

    // Create a temp record of the Razorpay order
    // We will create the actual order after payment is complete
    if (typeof window !== 'undefined') {
      // Store order info in sessionStorage temporarily
      sessionStorage.setItem(
        'razorpay_pending_order',
        JSON.stringify({
          razorpay_id: response.id,
          amount: amount,
          items: items,
          customerInfo: {
            name: customerName,
            email: email,
            phone: phone,
          },
        }),
      )
    }

    return NextResponse.json({
      success: true,
      order: response,
      key_id: razorpayConfig.key_id,
    })
  } catch (error) {
    console.error('Razorpay API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create Razorpay order' },
      { status: 500 },
    )
  }
}
