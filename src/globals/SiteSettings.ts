import { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'companyInfo',
      type: 'group',
      label: 'Company Information',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Company Name',
          defaultValue: 'Krafted Korner',
          required: true,
        },
        {
          name: 'tagline',
          type: 'text',
          label: 'Tagline',
          defaultValue: 'Handcrafted with Love',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp Number',
          admin: {
            description: 'Include country code. E.g., +911234567890',
          },
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'links',
          type: 'array',
          label: 'Social Links',
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'Pinterest', value: 'pinterest' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'LinkedIn', value: 'linkedin' },
              ],
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'footerLinks',
      type: 'array',
      label: 'Footer Links',
      fields: [
        {
          name: 'category',
          type: 'text',
          label: 'Category',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'group',
      label: 'Copyright Information',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: '© 2023 Krafted Korner. All rights reserved.',
        },
      ],
    },
  ],
}
