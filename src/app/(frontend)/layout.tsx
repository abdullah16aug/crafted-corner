import React from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata = {
  description: 'Krafted Korner - Handmade crafts and unique items',
  title: 'Krafted Korner',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Fetch site settings from Payload CMS
  const payload = await getPayload({ config })
  let siteSettings = {
    companyInfo: {
      name: 'Krafted Korner',
      tagline: 'Handcrafted with Love',
    },
    contactInfo: {
      email: 'info@kraftedkorner.com',
      phone: '+911234567890',
      whatsapp: '+911234567890',
    },
    socialMedia: {
      links: [
        { platform: 'instagram', url: 'https://instagram.com/kraftedkorner' },
        { platform: 'facebook', url: 'https://facebook.com/kraftedkorner' },
      ],
    },
    footerLinks: [
      {
        category: 'Quick Links',
        links: [
          { label: 'Home', url: '/' },
          { label: 'Products', url: '/products' },
          { label: 'About Us', url: '/about' },
          { label: 'Contact Us', url: '/contact' },
        ],
      },
    ],
    copyright: {
      text: '© 2023 Krafted Korner. All rights reserved.',
    },
  }

  try {
    // Try to fetch the actual site settings
    const fetchedSettings = await payload.findGlobal({
      slug: 'site-settings',
    })

    if (fetchedSettings) {
      // Ensure all required properties have non-null values
      siteSettings = {
        companyInfo: {
          name: fetchedSettings.companyInfo?.name || 'Krafted Korner',
          tagline: fetchedSettings.companyInfo?.tagline || 'Handcrafted with Love',
        },
        contactInfo: {
          email: fetchedSettings.contactInfo?.email || 'info@kraftedkorner.com',
          phone: fetchedSettings.contactInfo?.phone || '+911234567890',
          whatsapp: fetchedSettings.contactInfo?.whatsapp || '+911234567890',
        },
        socialMedia: {
          links: fetchedSettings.socialMedia?.links || [
            { platform: 'instagram', url: 'https://instagram.com/kraftedkorner' },
            { platform: 'facebook', url: 'https://facebook.com/kraftedkorner' },
          ],
        },
        footerLinks: Array.isArray(fetchedSettings.footerLinks)
          ? fetchedSettings.footerLinks.map((category) => ({
              category: category.category || 'Links',
              links: Array.isArray(category.links)
                ? category.links.map((link) => ({
                    label: link.label || '',
                    url: link.url || '#',
                  }))
                : [],
            }))
          : [
              {
                category: 'Quick Links',
                links: [
                  { label: 'Home', url: '/' },
                  { label: 'Products', url: '/products' },
                  { label: 'About Us', url: '/about' },
                  { label: 'Contact Us', url: '/contact' },
                ],
              },
            ],
        copyright: {
          text: fetchedSettings.copyright?.text || '© 2023 Krafted Korner. All rights reserved.',
        },
      }
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Use default settings defined above
  }

  // Use WhatsApp number from site settings if available
  const whatsappNumber = siteSettings.contactInfo?.whatsapp || '+911234567890'

  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer siteSettings={siteSettings} />
        <WhatsAppButton
          phoneNumber={whatsappNumber}
          message="Hi! I'm interested in your products."
        />
        <Toaster />
      </body>
    </html>
  )
}
