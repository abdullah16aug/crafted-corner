'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Media } from '@/payload-types'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartClient() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const increaseQuantity = useCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = item.product.discountedPrice ?? item.product.price
      return total + price * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-amber-900 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-stone-600 mb-6">Your cart is currently empty.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="md:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-white shadow-sm"
              >
                {/* Image */}
                <div className="flex-shrink-0 w-20 h-20 relative rounded overflow-hidden">
                  {item.product.images && item.product.images[0]?.image && (
                    <Image
                      src={
                        typeof item.product.images[0].image === 'object'
                          ? (item.product.images[0].image as Media).url || '/placeholder-image.jpg'
                          : '/placeholder-image.jpg'
                      }
                      alt={item.product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="font-medium hover:text-amber-700"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-stone-600 mt-1">
                    {/* Price Display */}
                    {item.product.discountedPrice != null &&
                    item.product.discountedPrice < item.product.price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-amber-800">
                          ₹{item.product.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-stone-500 line-through text-xs">
                          ₹{item.product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold text-amber-800">
                        ₹{item.product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls Container - Quantity and Remove together on mobile */}
                <div className="flex items-center justify-between gap-4 w-full sm:w-auto mt-3 sm:mt-0">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 border rounded-md p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => decreaseQuantity(item.product.id)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => increaseQuantity(item.product.id)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-stone-500 hover:text-red-600"
                    onClick={() => removeItem(item.product.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-stone-100 p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2 text-stone-700">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-stone-700">
                <span>Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg text-stone-900">
                <span>Estimated Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <Link href="/checkout">
                <Button className="w-full mt-6 bg-amber-700 hover:bg-amber-800">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
