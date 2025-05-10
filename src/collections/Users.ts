import type { CollectionConfig } from 'payload'
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'user'],
      defaultValue: 'user',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'state',
      type: 'text',
    },
    {
      name: 'zip',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
    },
    // Email added by default
    // Add more fields as needed
  ],
}
