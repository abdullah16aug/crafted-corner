'use client'

import React from 'react'
import { Product, Category } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import FeaturedProductsClient from '@/components/FeaturedProductsClient'

interface HomeClientProps {
  products: Product[]
  categories: Category[]
}

export default function HomeClient({ products, categories }: HomeClientProps) {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero section */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">
              Handcrafted with Love
            </h1>
            <p className="text-lg text-stone-700 mb-8">
              Discover unique home decor pieces that add warmth and character to your space
            </p>
            <Link
              href="/products"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Featured products section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-stone-800">Featured Products</h2>
            <p className="text-stone-600 text-sm mt-1">
              Handpicked items we think you&apos;ll love
            </p>
          </div>
          <Link
            href="/products"
            className="text-amber-700 hover:text-amber-900 font-medium text-sm"
          >
            View all →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10 text-stone-500">
            <p>No featured products available right now.</p>
            <p className="text-sm mt-2">Check back soon for new featured items!</p>
          </div>
        ) : (
          /* Render the client component for the grid */
          <FeaturedProductsClient products={products} />
        )}
      </div>

      {/* Categories section */}
      <div className="bg-stone-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="mx-auto mb-3 flex items-center justify-center">
                  {category.icon && typeof category.icon === 'object' && 'url' in category.icon ? (
                    <Image
                      src={category.icon.url as string}
                      alt={category.name || 'Category icon'}
                      width={80}
                      height={80}
                      className="max-h-24 w-auto object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                      <span className="text-amber-700 text-xl">
                        {getCategoryIcon(category.name)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-stone-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-4">Our Story</h2>
          <p className="text-stone-700 mb-6">
            Krafted Korner was founded with a simple mission: to bring unique, handcrafted items to
            people who appreciate quality craftsmanship and attention to detail.
          </p>
          <Link
            href="/about"
            className="inline-block text-amber-700 hover:text-amber-900 font-medium border-b border-amber-700"
          >
            Learn more about us
          </Link>
        </div>
      </div>
    </div>
  )
}

// Helper function to get an appropriate icon for each category (as fallback)
function getCategoryIcon(categoryName?: string): string {
  if (!categoryName) return '✧'

  const name = categoryName.toLowerCase()

  if (name.includes('decor')) return '✧'
  if (name.includes('furniture')) return '⌂'
  if (name.includes('textile') || name.includes('fabric')) return '≋'
  if (name.includes('light')) return '✺'
  if (name.includes('kitchen')) return '♨'
  if (name.includes('bath')) return '♒'
  if (name.includes('outdoor')) return '⚘'
  if (name.includes('art')) return '♠'

  // Default icon
  return '✧'
}
