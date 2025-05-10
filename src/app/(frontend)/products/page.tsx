import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Category } from '@/payload-types'
import ProductsClient from '@/components/products/ProductsClient'

export const revalidate = 3600 // Revalidate every hour

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata = {
  title: 'Products | Krafted Korner',
  description: 'Browse our handcrafted products',
}

export default async function ProductsPage({ params: _params, searchParams }: PageProps) {
  // searchParams is used, but params is not needed
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
        limit: 6, // Initial limit reduced to 8 for faster initial loading
        page: 1,
      }
    : { limit: 6, page: 1 }

  // Fetch initial products with optional category filter
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

        {/* Products with infinite scroll */}
        {products.docs.length > 0 ? (
          <ProductsClient
            initialProducts={products.docs}
            categoryId={categoryId}
            totalProducts={products.totalDocs}
          />
        ) : (
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
