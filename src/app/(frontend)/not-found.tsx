'use client'

import React from 'react'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-amber-50 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-amber-800">404</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto my-4"></div>
        </div>

        <h2 className="text-3xl font-serif text-stone-800 mb-4">Page Not Found</h2>

        <p className="text-lg text-stone-600 mb-8">
          Oops! It seems like the corner of our craft shop you&apos;re looking for doesn&apos;t
          exist. Perhaps this item has been moved or is no longer available.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-center border border-amber-200 p-4 rounded-lg bg-white">
            <p className="text-stone-700 italic">
              &ldquo;The best craftsman always has the courage to start over.&rdquo;
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-md transition-colors"
            >
              <Home size={18} />
              <span>Return Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-6 py-3 rounded-md border border-stone-200 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        <div className="mt-12 text-stone-500">
          <p>Looking for something specific? Try using our search or browse our collections.</p>
        </div>
      </div>
    </div>
  )
}
