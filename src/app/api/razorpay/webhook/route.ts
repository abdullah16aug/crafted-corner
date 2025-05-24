import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Replace with your Razorpay webhook secret
const webhookSecret = process.env.rzp_secret
if (!webhookSecret) {
  throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured in environment variables')
}

// After validation, we can safely assert the type
const validatedWebhookSecret: string = webhookSecret

// Utility function to get base API URL
function getBaseApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL
  if (!apiUrl) {
    throw new Error('API_URL is not configured in environment variables')
  }
  return apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`
}

interface RazorpayPayment {
  id: string
  order_id: string
  amount: number
  currency: string
  status: string
  method?: string
  error_code?: string
  error_description?: string
  error_source?: string
  error_step?: string
  error_reason?: string
  notes?: {
    orderNumber?: string
    payloadOrderId?: string
    [key: string]: string | undefined
  }
  fee?: number
  tax?: number
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

// Create interface for webhook payload
interface WebhookPayload {
  payment: {
    entity: RazorpayPayment
  }
  // Add other potential properties as needed
}

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
      .createHmac('sha256', validatedWebhookSecret)
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
  } catch (error: unknown) {
    console.error('Razorpay webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 },
    )
  }
}

async function handlePaymentAuthorized(payload: WebhookPayload) {
  // Payment has been authorized but not yet captured
  const payment = payload.payment.entity as RazorpayPayment
  const razorpayOrderId = payment.order_id

  console.log('Payment authorized:', payment.id, 'for order:', razorpayOrderId)

  // Retrieve the Payload order ID from payment notes
  const payloadOrderId = payment.notes?.payloadOrderId
  const orderNumber = payment.notes?.orderNumber

  if (!payloadOrderId) {
    console.error('No payloadOrderId found in payment', payment.id)
    return
  }

  try {
    console.log(`Updating order ${orderNumber} (ID: ${payloadOrderId}) for payment ${payment.id}`)

    // Update the order in Payload - mark as processing and add payment details
    try {
      const baseUrl = getBaseApiUrl()
      const updateResponse = await fetch(`${baseUrl}/api/orders/${payloadOrderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'processing',
          razorpayDetails: {
            razorpay_id: razorpayOrderId,
            payment_id: payment.id,
            amount_paid: payment.amount / 100, // Convert from paise to rupees
            currency: payment.currency,
            method: payment.method,
            status: 'authorized',
          },
        }),
      })

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        console.error('Failed to update order in Payload:', errorText)
        throw new Error(`Failed to update order: ${updateResponse.status}`)
      }

      const updatedOrder = await updateResponse.json()
      console.log('Order updated successfully:', updatedOrder)

      return updatedOrder
    } catch (error) {
      console.error('Error updating order in Payload:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to process order after payment authorization:', error)
  }
}

async function handlePaymentFailed(payload: WebhookPayload) {
  // Payment has failed
  const payment = payload.payment.entity as RazorpayPayment
  const razorpayOrderId = payment.order_id
  console.log('Payment failed:', payment.id, 'for order:', razorpayOrderId)

  // Retrieve the Payload order ID from payment notes
  const payloadOrderId = payment.notes?.payloadOrderId
  const orderNumber = payment.notes?.orderNumber

  if (!payloadOrderId) {
    console.error('No payloadOrderId found in payment', payment.id)
    return
  }

  try {
    // Update order status to cancelled
    const baseUrl = getBaseApiUrl()
    const updateResponse = await fetch(`${baseUrl}/api/orders/${payloadOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'cancelled',
        razorpayDetails: {
          razorpay_id: razorpayOrderId,
          payment_id: payment.id,
          error_code: payment.error_code,
          error_description: payment.error_description,
          status: 'failed',
        },
      }),
    })

    if (updateResponse.ok) {
      console.log(`Order ${orderNumber} marked as cancelled due to failed payment:`, payment.id)
    } else {
      const errorText = await updateResponse.text()
      console.error('Failed to update order status:', errorText)
      throw new Error('Failed to update order status')
    }
  } catch (error) {
    console.error('Error handling failed payment:', error)
  }
}

async function handlePaymentCaptured(payload: WebhookPayload) {
  const payment = payload.payment.entity as RazorpayPayment
  const razorpayOrderId = payment.order_id
  console.log('payment captured', payment)
  const payloadOrderId = payment.notes?.payloadOrderId
  const orderNumber = payment.notes?.orderNumber

  if (!payloadOrderId) {
    console.error('No payloadOrderId found in payment', payment.id)
    return
  }

  try {
    // Update order status to paid
    const baseUrl = getBaseApiUrl()
    const updateResponse = await fetch(`${baseUrl}/api/orders/${payloadOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'processing',
        isPaid: true,
        razorpayDetails: {
          razorpay_id: razorpayOrderId,
          payment_id: payment.id,
          amount_paid: payment.amount / 100, // Convert from paise to rupees
          currency: payment.currency,
          method: payment.method,
          status: 'captured',
          fee: payment.fee,
          tax: payment.tax,
        },
      }),
    })

    if (updateResponse.ok) {
      console.log(`Order ${orderNumber} marked as paid for payment:`, payment.id)

      // Send order confirmation email only after successful payment
      try {
        const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: payloadOrderId,
            orderNumber: orderNumber,
            type: 'order_confirmation',
          }),
        })

        if (emailResponse.ok) {
          console.log(`Order confirmation email sent for order ${orderNumber}`)
        } else {
          console.error('Failed to send order confirmation email:', await emailResponse.text())
        }
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError)
        // Don't throw here - we don't want to affect the order processing if email fails
      }
    } else {
      const errorText = await updateResponse.text()
      console.error('Failed to update order status:', errorText)
      throw new Error('Failed to update order status')
    }
  } catch (error) {
    console.error('Error handling captured payment:', error)
  }
}
