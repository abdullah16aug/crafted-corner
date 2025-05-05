'use client' // This component handles the interactive grid

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product, Media } from '@/payload-types'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

interface FeaturedProductsClientProps {
  products: Product[] // Receive products array as prop
}

export default function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
  const addItemToCart = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation() // Prevent link navigation when clicking button
    e.preventDefault()

    const isAlreadyInCart = cartItems.some((item) => item.product.id === product.id)

    if (isAlreadyInCart) {
      toast({
        title: 'Already in cart',
        description: `${product.name} is already in your cart.`,
        className:
          'bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-900 dark:border-pink-800 dark:text-pink-200',
      })
    } else if (product.inventory > 0) {
      addItemToCart(product)
      toast({
        title: 'Added to cart!',
        description: `${product.name} has been added to your cart.`,
        className:
          'bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-900 dark:border-pink-800 dark:text-pink-200',
      })
    } else {
      toast({
        title: 'Out of Stock',
        description: `${product.name} cannot be added as it's out of stock.`,
        variant: 'destructive',
        className:
          'bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-900 dark:border-pink-800 dark:text-pink-200',
      })
    }
  }

  // Handle empty state
  if (!products || products.length === 0) {
    return <div className="text-center text-stone-600">No featured products available.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6">
      {products.map((product: Product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="block group">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-300">
            <div className="relative h-32 xs:h-40 sm:h-48 md:h-80 lg:h-96 overflow-hidden">
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
            <div className="p-3 xs:p-4 flex flex-col flex-grow">
              <h3 className="text-sm xs:text-base font-medium text-stone-800 mb-1">
                {product.name}
              </h3>
              <div className="flex flex-col items-start gap-2 mt-1 flex-grow">
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
              </div>
              <div className="mt-auto pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs bg-amber-700 hover:bg-amber-800 text-white hover:text-white border-amber-700 hover:border-amber-800"
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.inventory <= 0}
                >
                  {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
