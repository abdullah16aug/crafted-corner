import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

// WhatsApp message sending function
async function sendWhatsAppMessage(phone: string, orderNumber: string, customerName: string) {
  try {
    // Example using WhatsApp Business API - in real implementation you'd use your API credentials
    // For this example, we're just logging the message that would be sent
    const message = `Hello ${customerName}, thank you for your order #${orderNumber} at Krafted Korner. We'll process it shortly and keep you updated!`

    console.log(`WhatsApp message would be sent to ${phone}: ${message}`)

    // In production, you would use a proper WhatsApp service like Twilio
    // Example with Twilio:
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`
    });
    */

    return true
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return false
  }
}

// Email sending function using Brevo
async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  customerName: string,
  orderItems: any[],
  totalAmount: number,
) {
  try {
    // Create the items list HTML for the email
    const itemsList = orderItems
      .map(
        (item) =>
          `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName || item.product}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`,
      )
      .join('')

    // Create the HTML content for the email
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #B45309; color: white; padding: 20px; text-align: center;">
        <h1>Order Confirmation</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Dear ${customerName},</p>
        <p>Thank you for your order! We're processing it right away.</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2 style="margin-top: 30px;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px;"><strong>₹${totalAmount.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <p style="margin-top: 30px;">If you have any questions about your order, please contact us.</p>
        <p>Best regards,<br>Krafted Korner Team</p>
      </div>
      
      <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p>© 2023 Krafted Korner. All rights reserved.</p>
        <p>You're receiving this email because you made a purchase at Krafted Korner.</p>
      </div>
    </div>
    `

    // Create a new Brevo API client instance
    const apiInstance = new TransactionalEmailsApi()

    // For demonstration purposes, log the email that would be sent
    console.log(`Email would be sent to ${email} with subject "Order Confirmation #${orderNumber}"`)

    // In production, uncomment this to actually send the email
    /*
    // Configure the API key (will need to be set in your .env file)
    const apiKey = process.env.BREVO_API_KEY || 'YOUR_API_KEY'
    
    // Create the email request
    const sendEmail = new SendSmtpEmail()
    sendEmail.subject = `Order Confirmation #${orderNumber}`
    sendEmail.htmlContent = emailContent
    sendEmail.sender = {
      email: 'noreply@kraftedkorner.com',
      name: 'Krafted Korner'
    }
    sendEmail.to = [{
      email: email
    }]
    
    // Make the API request
    const brevoClient = new TransactionalEmailsApi()
    // You need to create a Brevo account and get API key from there
    brevoClient.setApiKey('api-key', apiKey)
    
    const response = await brevoClient.sendTransacEmail(sendEmail)
    console.log('Email sent with Brevo. Response:', response)
    */

    return true
  } catch (error) {
    console.error('Error sending email with Brevo:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Received order payload:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (
      !body.items ||
      !body.totalAmount ||
      !body.paymentMethod ||
      !body.shippingAddress ||
      !body.guestInfo
    ) {
      const missingFields = []
      if (!body.items) missingFields.push('items')
      if (!body.totalAmount) missingFields.push('totalAmount')
      if (!body.paymentMethod) missingFields.push('paymentMethod')
      if (!body.shippingAddress) missingFields.push('shippingAddress')
      if (!body.guestInfo) missingFields.push('guestInfo')

      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: { missingFields },
        },
        { status: 400 },
      )
    }

    // Create the order in the database
    try {
      // Initialize payload with config
      const payload = await getPayload({ config })

      // Debug: Check available collections
      console.log('Available collections:', Object.keys(payload.collections))

      // Check if the orders collection exists using a safe method
      let collectionExists = false
      try {
        // Try to find a single document from the orders collection
        await payload.find({
          collection: 'orders',
          limit: 1,
        })
        collectionExists = true
      } catch (e) {
        console.error('Error checking orders collection:', e)
      }

      console.log('Orders collection exists:', collectionExists)

      if (!collectionExists) {
        return NextResponse.json(
          {
            error: 'Cannot create order',
            details: 'The orders collection is not properly configured',
          },
          { status: 500 },
        )
      }

      const order = await payload.create({
        collection: 'orders',
        data: body,
      })

      // Send notifications after successful order creation
      // 1. Send WhatsApp notification
      if (body.guestInfo.phone) {
        await sendWhatsAppMessage(body.guestInfo.phone, order.orderNumber, body.guestInfo.name)
      }

      // 2. Send email confirmation
      if (body.guestInfo.email) {
        await sendOrderConfirmationEmail(
          body.guestInfo.email,
          order.orderNumber,
          body.guestInfo.name,
          body.items,
          body.totalAmount,
        )
      }

      // Return the created order
      return NextResponse.json(
        {
          success: true,
          message: 'Order created successfully',
          doc: order,
        },
        { status: 201 },
      )
    } catch (createError: any) {
      console.error('Payload create error:', createError)
      return NextResponse.json(
        {
          error: 'Failed to create order in database',
          details: createError.message || 'Unknown error',
          errors: createError.errors || {},
          slug: 'orders', // Add the slug being used for reference
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error('Error processing order request:', error)
    return NextResponse.json(
      {
        error: 'Failed to process order request',
        details: error.message || 'Unknown error',
      },
      { status: 500 },
    )
  }
}
