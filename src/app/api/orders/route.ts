import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate required fields
    if (
      !body.items ||
      !body.totalAmount ||
      !body.paymentMethod ||
      !body.shippingAddress ||
      !body.guestInfo
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create the order in the database
    const order = await payload.create({
      collection: 'orders',
      data: body,
    })

    // Return the created order
    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        doc: order,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
