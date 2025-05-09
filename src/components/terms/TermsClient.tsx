'use client'

import React from 'react'
import { Page } from '@/lib/types'
import RichText from '@/components/RichText'

export default function TermsClient({ page }: { page: Page }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">{page.title}</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {page.content.sections.map((section, index) => (
          <section key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="text-gray-600 leading-relaxed">
              <RichText content={section.content} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
