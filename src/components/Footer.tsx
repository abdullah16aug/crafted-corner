'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react'

interface FooterProps {
  siteSettings: any
}

export default function Footer({ siteSettings }: FooterProps) {
  const { companyInfo, contactInfo, socialMedia, footerLinks, copyright } = siteSettings

  // Helper function to render the correct social icon
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={20} />
      case 'instagram':
        return <Instagram size={20} />
      case 'twitter':
        return <Twitter size={20} />
      case 'linkedin':
        return <Linkedin size={20} />
      case 'youtube':
        return <Youtube size={20} />
      default:
        return null
    }
  }

  const currentYear = new Date().getFullYear()
  const copyrightText =
    copyright?.text?.replace('2023', currentYear.toString()) ||
    `© ${currentYear} ${companyInfo?.name || 'Krafted Korner'}. All rights reserved.`

  return (
    <footer className="bg-amber-50 text-stone-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-amber-800 mb-4">
              {companyInfo?.name || 'Krafted Korner'}
            </h3>
            <p className="mb-2">{companyInfo?.tagline || 'Handcrafted with Love'}</p>
            {companyInfo?.address && (
              <div className="flex items-start mt-4">
                <MapPin className="mr-2 mt-1 flex-shrink-0 text-amber-600" size={18} />
                <p className="text-sm">{companyInfo.address}</p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-amber-800 mb-4">Contact Us</h3>
            {contactInfo?.phone && (
              <div className="flex items-center mb-3">
                <Phone className="mr-2 text-amber-600" size={18} />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-amber-700 transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
            )}
            {contactInfo?.email && (
              <div className="flex items-center mb-3">
                <Mail className="mr-2 text-amber-600" size={18} />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-amber-700 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            )}
            {contactInfo?.whatsapp && (
              <div className="flex items-center mb-3">
                <div className="mr-2 w-[18px] h-[18px] relative">
                  <Image
                    src="/whatsapp.ico"
                    alt="WhatsApp"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-700 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          {footerLinks && footerLinks.length > 0 && (
            <div>
              <h3 className="text-xl font-serif font-semibold text-amber-800 mb-4">
                {footerLinks[0]?.category || 'Quick Links'}
              </h3>
              <ul className="space-y-2">
                {footerLinks[0]?.links?.map((link: any, index: number) => (
                  <li key={index}>
                    <Link href={link.url} className="hover:text-amber-700 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-amber-800 mb-4">Follow Us</h3>
            <div className="flex space-x-3">
              {socialMedia?.links?.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-full transition-colors"
                  aria-label={`Follow us on ${link.platform}`}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-amber-200 mt-8 pt-6 text-center text-sm">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
