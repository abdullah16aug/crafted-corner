import { CollectionConfig } from 'payload/types'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
    },
  ],
}

export default Categories
