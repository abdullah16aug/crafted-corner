import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'About',
          value: 'about',
        },
        {
          label: 'Contact',
          value: 'contact',
        },
        {
          label: 'Terms',
          value: 'terms',
        },
        {
          label: 'Privacy Policy',
          value: 'privacy-policy',
        },
        {
          label: 'Refund Policy',
          value: 'refund-policy',
        },
        {
          label: 'Data Removal',
          value: 'data-removal',
        },
      ],
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'sections',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'contact',
      },
      fields: [
        {
          name: 'address',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'businessHours',
          type: 'array',
          fields: [
            {
              name: 'day',
              type: 'text',
              required: true,
            },
            {
              name: 'hours',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
    },
  ],
}
