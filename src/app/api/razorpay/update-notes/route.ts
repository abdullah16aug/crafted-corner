import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialize Razorpay with test keys
const razorpayConfig = {
  key_id: process.env.rzp_key,
  key_secret: process.env.rzp_secret,
}

const razorpay = new Razorpay(razorpayConfig)

export async function POST(request: Request) {
  try {
    const { razorpayOrderId, payloadOrderId, orderNumber } = await request.json()

    if (!razorpayOrderId || !payloadOrderId || !orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 },
      )
    }

    // Update the Razorpay order with notes
    const updatedOrder = await razorpay.orders.edit(razorpayOrderId, {
      notes: {
        payloadOrderId,
        orderNumber,
      },
    })

    console.log(`Updated Razorpay order ${razorpayOrderId} with Payload order details`)

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    })
  } catch (error: unknown) {
    console.error('Error updating Razorpay order notes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update Razorpay order notes' },
      { status: 500 },
    )
  }
}
