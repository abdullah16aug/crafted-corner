import type { CollectionConfig } from 'payload'
import { admins } from '../access/admins'
import adminsAndLoggedIn from '../access/adminsAndLoggedIn'

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
