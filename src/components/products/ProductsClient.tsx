'use client'

import React, { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product, Media } from '@/payload-types'
import { useToast } from '@/hooks/use-toast'

interface ProductsClientProps {
  initialProducts: Product[]
  categoryId?: string
  totalProducts: number
}

export default function ProductsClient({
  initialProducts,
  categoryId,
  totalProducts,
}: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialProducts.length < totalProducts)
  const observer = useRef<IntersectionObserver | null>(null)
  const { toast } = useToast()

  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const loadMoreProducts = async () => {
            if (isLoading || !hasMore) return

            setIsLoading(true)
            const nextPage = page + 1

            try {
              const url = categoryId
                ? `/api/products?page=${nextPage}&limit=8&category=${categoryId}`
                : `/api/products?page=${nextPage}&limit=8`

              const response = await fetch(url)

              if (!response.ok) {
                throw new Error('Failed to load more products')
              }

              const data = await response.json()

              if (data.docs.length > 0) {
                setProducts((prevProducts) => [...prevProducts, ...data.docs])
                setPage(nextPage)
                setHasMore(products.length + data.docs.length < totalProducts)
              } else {
                setHasMore(false)
              }
            } catch (error) {
              console.error('Error loading more products:', error)
              toast({
                title: 'Error',
                description: 'Failed to load more products. Please try again.',
                variant: 'destructive',
              })
            } finally {
              setIsLoading(false)
            }
          }

          loadMoreProducts()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, page, products.length, categoryId, totalProducts, toast],
  )

  // Function to trim description and add ellipsis
  const trimDescription = (description: string | undefined, maxLength: number = 60) => {
    if (!description) return ''
    return description.length > maxLength
      ? `${description.substring(0, maxLength).trim()}...`
      : description
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {products.map((product, index) => {
          // Determine if this is the last item to watch for intersection
          const isLastItem = index === products.length - 1

          return (
            <div
              key={product.id}
              ref={isLastItem ? lastProductElementRef : null}
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
                <p className="text-stone-600 text-xs xs:text-sm mb-2 h-8 overflow-hidden">
                  {trimDescription(product.description)}
                </p>
                <div className="flex flex-col items-start gap-2 mt-2">
                  <div className="flex flex-col items-start">
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
                    className="text-xs bg-amber-700 hover:bg-amber-800 text-white py-1 px-2 xs:px-3 rounded-md transition-colors self-end"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 rounded-full border-4 border-amber-700 border-t-transparent animate-spin"></div>
          <p className="text-stone-600 mt-2">Loading more products...</p>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-stone-600">You&apos;ve reached the end of the collection.</p>
        </div>
      )}
    </>
  )
}
