import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admins'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      index: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
      admin: {
        description: 'Show this product on the home page as a featured product',
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'discountedPrice',
      label: 'Discounted Price (Optional)',
      type: 'number',
      min: 0,
      admin: {
        description: 'Enter a price here to put the product on sale. Leave blank for no discount.',
      },
      // Ensure discounted price is not higher than the original price
      validate: (
        value: number | null | undefined,
        { data }: { data?: { price?: number; [key: string]: any } },
      ) => {
        if (value != null && typeof data?.price === 'number' && value > data.price) {
          return 'Discounted price cannot be higher than the original price.'
        }
        return true
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
    },
    {
      name: 'inventory',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
    },
  ],
}

export default Products
