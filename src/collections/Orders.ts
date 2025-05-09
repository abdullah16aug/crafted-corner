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
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
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
