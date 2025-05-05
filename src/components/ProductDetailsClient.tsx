'use client' // This is the client component

import React from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/hooks/use-toast'
import { Product, Media } from '@/payload-types'

interface ProductDetailsClientProps {
  product: Product // Receive product data as prop
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const addItemToCart = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (product) {
      addItemToCart(product)
      toast({
        title: 'Added to cart!',
        description: `${product.name} has been added to your cart.`,
      })
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="md:flex">
        {/* Product image Carousel */}
        <div className="md:w-1/2 p-4">
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {product.images && product.images.length > 0 ? (
                product.images.map((imgData, index) => (
                  <CarouselItem key={imgData.id || index}>
                    <div className="p-1">
                      <div className="relative aspect-square md:aspect-auto md:h-[30rem] lg:h-[40rem]">
                        <Image
                          src={
                            typeof imgData.image === 'object'
                              ? (imgData.image as Media).url || '/placeholder-image.jpg'
                              : '/placeholder-image.jpg'
                          }
                          alt={`${product.name || 'Product image'} ${index + 1}`}
                          fill
                          priority={index === 0}
                          style={{ objectFit: 'cover' }}
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="p-1">
                    <div className="relative aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>

        {/* Product info */}
        <div className="md:w-1/2 p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">
            Category: {typeof product.category === 'object' ? product.category.name : 'Unknown'}
          </p>

          {/* Price Display */}
          <div className="flex items-baseline gap-3 mb-6">
            {product.discountedPrice != null && product.discountedPrice < product.price ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  ₹{product.discountedPrice.toFixed(2)}
                </span>
                <span className="text-xl font-medium text-gray-500 line-through">
                  ₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                  SALE
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-blue-600">
                {' '}
                {/* Original price color was blue, keeping it for now */}₹
                {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Product Details:</h2>
            <p className="text-gray-700">SKU: {product.sku}</p>
          </div>

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold ${product.inventory > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full`}
            >
              {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-4 rounded ${product.inventory <= 0 && 'opacity-50 cursor-not-allowed'}`}
            disabled={product.inventory <= 0}
          >
            {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
