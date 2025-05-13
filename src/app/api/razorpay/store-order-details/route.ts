import { NextResponse } from 'next/server'

// In production, you'd use a database to store these
// This is a temporary solution for demonstration purposes
const orderDetailsMap = new Map()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { orderDetails } = data

    if (!orderDetails) {
      return NextResponse.json(
        { success: false, error: 'No order details provided' },
        { status: 400 },
      )
    }

    // Generate a unique ID for this order
    const tempOrderId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    // Store the order details with the ID
    orderDetailsMap.set(tempOrderId, {
      ...orderDetails,
      createdAt: new Date().toISOString(),
    })

    // Set an expiration for this data (cleanup after 1 hour)
    setTimeout(
      () => {
        orderDetailsMap.delete(tempOrderId)
      },
      60 * 60 * 1000,
    )

    console.log(`Stored temporary order details with ID: ${tempOrderId}`)

    return NextResponse.json({
      success: true,
      tempOrderId,
      message: 'Order details stored temporarily',
    })
  } catch (error) {
    console.error('Failed to store order details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to store order details' },
      { status: 500 },
    )
  }
}

// Function to retrieve order details by temporary ID
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const tempOrderId = url.searchParams.get('id')

    if (!tempOrderId) {
      return NextResponse.json({ success: false, error: 'No order ID provided' }, { status: 400 })
    }

    const orderDetails = orderDetailsMap.get(tempOrderId)

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
    console.error('Failed to retrieve order details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order details' },
      { status: 500 },
    )
  }
}
