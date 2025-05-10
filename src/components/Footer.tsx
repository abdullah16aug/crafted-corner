'use client'

import React from 'react'
import Link from 'next/link'
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
    <footer className="bg-stone-800 text-stone-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-amber-300 mb-4">
              {companyInfo?.name || 'Krafted Korner'}
            </h3>
            <p className="mb-2">{companyInfo?.tagline || 'Handcrafted with Love'}</p>
            {companyInfo?.address && (
              <div className="flex items-start mt-4">
                <MapPin className="mr-2 mt-1 flex-shrink-0 text-amber-300" size={18} />
                <p className="text-sm">{companyInfo.address}</p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-amber-300 mb-4">Contact Us</h3>
            {contactInfo?.phone && (
              <div className="flex items-center mb-3">
                <Phone className="mr-2 text-amber-300" size={18} />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-amber-300 transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
            )}
            {contactInfo?.email && (
              <div className="flex items-center mb-3">
                <Mail className="mr-2 text-amber-300" size={18} />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-amber-300 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            )}
            {contactInfo?.whatsapp && (
              <div className="flex items-center mb-3">
                <svg
                  className="mr-2 text-amber-300 w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm.03 18.88c-1.795.01-3.56-.447-5.118-1.32l-.368-.22-3.811.999.985-3.736-.243-.387c-.978-1.606-1.497-3.444-1.493-5.316.01-5.587 4.531-10.12 10.12-10.12 5.592.005 10.12 4.537 10.12 10.13-.005 5.592-4.537 10.12-10.13 10.12l-.014-.002z" />
                </svg>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          {footerLinks && footerLinks.length > 0 && (
            <div>
              <h3 className="text-xl font-serif font-semibold text-amber-300 mb-4">
                {footerLinks[0]?.category || 'Quick Links'}
              </h3>
              <ul className="space-y-2">
                {footerLinks[0]?.links?.map((link: any, index: number) => (
                  <li key={index}>
                    <Link href={link.url} className="hover:text-amber-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-amber-300 mb-4">Follow Us</h3>
            <div className="flex space-x-3">
              {socialMedia?.links?.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-stone-700 hover:bg-amber-600 text-white p-2 rounded-full transition-colors"
                  aria-label={`Follow us on ${link.platform}`}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-stone-700 mt-8 pt-6 text-center text-sm">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
