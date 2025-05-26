import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { randomUUID } from 'crypto'

// Initialize Razorpay with test keys
const razorpayConfig = {
  key_id: process.env.rzp_key, // Replace with your actual test key_id
  key_secret: process.env.rzp_secret, // Replace with your actual test key_secret
}

const razorpay = new Razorpay(razorpayConfig)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { amount, customerName, email, phone } = data

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

    console.log(`Created Razorpay order: ${response.id}`)

    return NextResponse.json({
      success: true,
      order: response,
      key_id: razorpayConfig.key_id,
    })
  } catch (error: unknown) {
    console.error('Razorpay API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create Razorpay order' },
      { status: 500 },
    )
  }
}
