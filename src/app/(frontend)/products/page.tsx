import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media, Category } from '@/payload-types'

export const revalidate = 60 // Revalidate every minute

interface PageProps {
  params: Promise<{ [key: string]: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata = {
  title: 'Products | Crafted Corner',
  description: 'Browse our handcrafted products',
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  // Ignore params as it's not used
  const searchParamsValue = await searchParams
  const payload = await getPayload({ config })

  // Get category ID from query params
  const categoryId = searchParamsValue.category as string | undefined

  // Build the query to filter by category if provided
  const query = categoryId
    ? {
        where: {
          category: {
            equals: categoryId,
          },
        },
        limit: 20,
      }
    : { limit: 20 }

  // Fetch products with optional category filter
  const products = await payload.find({
    collection: 'products',
    ...query,
  })

  // Fetch categories for filter links
  const categories = await payload.find({
    collection: 'categories',
  })

  // If filtering by category, get the category name
  let activeCategoryName = 'All Products'
  if (categoryId) {
    try {
      const category = await payload.findByID({
        collection: 'categories',
        id: categoryId,
      })
      if (category) {
        activeCategoryName = category.name as string
      }
    } catch (error) {
      console.error('Failed to fetch category:', error)
    }
  }

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-3">
            {activeCategoryName}
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Each piece in our collection is thoughtfully designed and meticulously crafted to bring
            beauty and warmth to your home.
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <Link
            href="/products"
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              !categoryId
                ? 'bg-amber-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All
          </Link>
          {categories.docs.map((category: Category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                categoryId === category.id
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {products.docs.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="relative h-40 xs:h-48 overflow-hidden">
                {product.images && product.images[0] && (
                  <Image
                    src={
                      typeof product.images[0].image === 'object'
                        ? (product.images[0].image as Media).url || '/placeholder-image.jpg'
                        : '/placeholder-image.jpg'
                    }
                    alt={product.name || 'Product image'}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-3 xs:p-4">
                <h3 className="text-sm xs:text-base font-medium text-stone-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-stone-600 text-xs xs:text-sm mb-2 line-clamp-1">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline gap-2">
                    {product.discountedPrice != null && product.discountedPrice < product.price ? (
                      <>
                        <span className="text-amber-800 font-semibold text-xs xs:text-sm">
                          ₹{product.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-stone-500 line-through text-xs">
                          ₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-800 font-semibold text-xs xs:text-sm">
                        ₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs bg-amber-700 hover:bg-amber-800 text-white py-1 px-2 xs:px-3 rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {products.docs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-600 mb-6">No products found in this category.</p>
            <Link
              href="/products"
              className="text-amber-700 hover:text-amber-900 font-medium border-b border-amber-700"
            >
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
