import type { CollectionConfig } from 'payload'
import { admins } from '../access/admins'
import adminsAndLoggedIn from '../access/adminsAndLoggedIn'
import { payload } from '@/lib/payload'

const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
  },
  access: {
    read: adminsAndLoggedIn,
    create: () => true, // Allow guest users to create orders
    update: admins,
    delete: admins,
  },
  hooks: {
    afterChange: [
      //send email to customer
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          console.log('Order changed:', doc)

          // Properly extract email from either customer or guest info
          const email = doc.customer?.email || doc.guestInfo?.email

          if (!email) {
            console.error('No email address found for order:', doc.orderNumber)
            return
          }

          const { orderNumber, items, totalAmount, paymentMethod, status, shippingAddress } = doc

          try {
            await req.payload.sendEmail({
              to: email,
              subject: 'Order Placed - Krafted Korner',
              from: 'Krafted Korner <care@support.kraftedkorner.com>',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h1 style="color: #92400e; margin-bottom: 20px;">Order Confirmation</h1>
                  <p style="font-size: 16px; color: #444; margin-bottom: 20px;">Thank you for your order! Your order has been placed successfully.</p>
                  
                  <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #444; margin-bottom: 15px;">Order Details</h2>
                    <p style="margin: 10px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
                    <p style="margin: 10px 0;"><strong>Items:</strong> ${items
                      .map((item: any) => {
                        return `<p style="margin: 5px 0;">${item.product.name} x ${item.quantity} ${item.product.discountedPrice ? `(₹${item.product.discountedPrice})` : `(₹${item.product.price})`} </p>`
                      })
                      .join('')}
                    </p>
                    <p style="margin: 10px 0;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                    <p style="margin: 10px 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <p style="margin: 10px 0;"><strong>Status:</strong> ${status}</p>
                  </div>

                  <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #444; margin-bottom: 15px;">Shipping Address</h2>
                    <p style="margin: 5px 0;">${shippingAddress.street}</p>
                    <p style="margin: 5px 0;">${shippingAddress.city}, ${shippingAddress.state}</p>
                    <p style="margin: 5px 0;">${shippingAddress.zipCode}</p>
                    <p style="margin: 5px 0;">${shippingAddress.country}</p>
                  </div>

                  <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                    <p>If you have any questions, please contact our support team.</p>
                    <p>Thank you for shopping with Krafted Korner!</p>
                  </div>
                </div>
              `,
            })
            console.log('Order confirmation email sent successfully to:', email)
          } catch (error) {
            console.error('Error sending order confirmation email:', error)
          }
        }
      },
    ],
    beforeValidate: [
      async ({ data, req }) => {
        // Ensure data exists
        if (!data) {
          return { orderNumber: `10001-${Date.now()}` }
        }

        // Find the highest order number in the database and increment
        if (!data.orderNumber) {
          try {
            const { payload } = req
            // Query the highest order number from the database
            const existingOrders = await payload.find({
              collection: 'orders',
              sort: '-orderNumber', // Sort in descending order
              limit: 1, // Get only the highest
            })

            let nextOrderNumber = 10001 // Start with 10001 if no orders exist

            if (existingOrders.docs && existingOrders.docs.length > 0) {
              // If there are existing orders, get the highest one and increment
              const highestOrder = existingOrders.docs[0]
              if (highestOrder.orderNumber) {
                // Parse the order number (it might be stored as a string) and increment
                const currentOrderNumber = parseInt(highestOrder.orderNumber, 10)
                if (!isNaN(currentOrderNumber)) {
                  nextOrderNumber = currentOrderNumber + 1
                }
              }
            }

            // Set the new order number on the data object
            data.orderNumber = nextOrderNumber.toString()
          } catch (error) {
            console.error('Error generating order number:', error)
            // Fallback to a timestamp-based order number in case of error
            data.orderNumber = `10001-${Date.now()}`
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated unique order number',
        readOnly: true, // Make it read-only in the admin panel
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'guestInfo',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        condition: (data) => !data.customer,
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'productName',
          type: 'text',
          admin: {
            description: 'Product name at time of order',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Cash on Delivery',
          value: 'cod',
        },
        {
          label: 'Razorpay',
          value: 'razorpay',
        },
      ],
    },
    {
      name: 'isPaid',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'razorpayDetails',
      type: 'group',
      fields: [
        {
          name: 'razorpay_id',
          type: 'text',
        },
        {
          name: 'entity',
          type: 'text',
        },
        {
          name: 'amount_paid',
          type: 'number',
        },
        {
          name: 'amount_due',
          type: 'number',
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'INR',
        },
        {
          name: 'receipt',
          type: 'text',
        },
        {
          name: 'status',
          type: 'text',
        },
      ],
      admin: {
        condition: (data) => data.paymentMethod === 'razorpay',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      min: 0,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'zipCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'notes',
      type: 'array',
      fields: [
        {
          name: 'desc',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true,
}

export default Orders
