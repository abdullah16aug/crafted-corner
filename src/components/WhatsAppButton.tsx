'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
}

export default function WhatsAppButton({
  phoneNumber,
  message = 'Hello! I have a question about Krafted Korner products.',
}: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Format the phone number - remove any non-digit characters
  const formattedPhone = phoneNumber.replace(/\D/g, '')

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message)

  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse Animation Ring */}
      <div
        className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-75"
        style={{ animationDuration: '3s' }}
      ></div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-white text-gray-800 text-sm py-1 px-3 rounded shadow-lg">
          Chat with us on WhatsApp
          <div className="absolute top-full right-4 transform -translate-x-1/2 border-8 border-solid border-transparent border-t-white"></div>
        </div>
      )}

      {/* Button */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative  bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Contact us on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Image src="/whatsapp.ico" alt="WhatsApp" width={32} height={32} className="w-8 h-8" />
      </Link>
    </div>
  )
}
