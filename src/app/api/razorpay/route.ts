import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { randomUUID } from 'crypto'

// Initialize Razorpay with test keys
const razorpayConfig = {
  key_id: process.env.rzp_key, // Replace with your actual test key_id
  key_secret: process.env.rzp_secret, // Replace with your actual test key_secret
}

const razorpay = new Razorpay(razorpayConfig)

// Store pending orders in memory (for demo purposes)
// In production, use a database
const pendingOrders = new Map()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { amount, customerName, email, phone, orderNumber, orderId } = data

    // Create Razorpay order options
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: orderNumber || randomUUID(),
      payment_capture: 1,
      notes: {
        orderNumber,
        payloadOrderId: orderId,
        customerName,
        email,
        phone,
      },
    }

    // Create order on Razorpay
    const response = await razorpay.orders.create(options)

    // Store pending order details server-side for webhook to access
    pendingOrders.set(orderNumber, {
      razorpay_order_id: response.id,
      amount: amount,
      customerInfo: {
        name: customerName,
        email: email,
        phone: phone,
      },
      createdAt: new Date().toISOString(),
    })

    // Set expiry for pending order (1 hour)
    setTimeout(
      () => {
        pendingOrders.delete(orderNumber)
      },
      60 * 60 * 1000,
    )

    console.log(`Created Razorpay order: ${response.id} for Payload order: ${orderNumber}`)

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

// Helper endpoint to retrieve pending order details
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const orderNumber = url.searchParams.get('orderNumber')

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'No orderNumber provided' },
        { status: 400 },
      )
    }

    const orderDetails = pendingOrders.get(orderNumber)

    if (!orderDetails) {
      return NextResponse.json(
        { success: false, error: 'Order details not found or expired' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      orderDetails,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order details' },
      { status: 500 },
    )
  }
}
