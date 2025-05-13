'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Media } from '@/payload-types'
import { Loader2 } from 'lucide-react'

export default function CheckoutClient() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  })

  useEffect(() => {
    // Set loading to false after initial mount
    setIsLoading(false)

    // Redirect to cart if there are no items
    if (items.length === 0 && !orderNumber) {
      router.push('/cart')
    }
  }, [items, router, orderNumber])

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = item.product.discountedPrice ?? item.product.price
      return total + price * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shippingCost = subtotal > 1000 ? 0 : 100
  const total = subtotal + shippingCost

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const createOrder = async () => {
    try {
      // Log original items to debug
      console.log(
        'Original cart items:',
        items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
        })),
      )

      // Prepare order items
      const orderItems = items.map((item) => ({
        product: item.product.id, // Make sure this is just the ID string
        quantity: item.quantity,
        price: item.product.discountedPrice ?? item.product.price,
        productName: item.product.name, // Add product name for reference
      }))

      console.log('Order items:', JSON.stringify(orderItems, null, 2))

      // Prepare shipping address
      const shippingAddress = {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.pincode,
        country: 'India', // Default for now
      }

      // Prepare guest info
      const guestInfo = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      }

      // Create order payload
      const orderData = {
        items: orderItems,
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        isPaid: false, // COD is not paid initially
        status: 'pending',
        shippingAddress,
        guestInfo,
      }

      console.log('Sending order data:', JSON.stringify(orderData, null, 2))

      // Submit to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error('Order API error:', responseData)
        throw new Error(responseData.details || responseData.error || 'Failed to create order')
      }

      return responseData.doc.orderNumber
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create the order in the backend
      const newOrderNumber = await createOrder()

      // Set the order number for confirmation
      setOrderNumber(newOrderNumber)

      // Store order details in localStorage to persist between sessions
      const orderDetails = {
        orderNumber: newOrderNumber,
        date: new Date().toISOString(),
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        items: items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.discountedPrice ?? item.product.price,
        })),
        totalAmount: total,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode,
          country: 'India',
        },
      }

      // Get existing orders from localStorage or initialize an empty array
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')

      // Add the new order to the beginning of the array
      existingOrders.unshift(orderDetails)

      // Store updated orders array in localStorage
      localStorage.setItem('orders', JSON.stringify(existingOrders))

      // Clear the cart
      clearCart()

      // Show success message with order number
      alert(`Order placed successfully! Your order number is ${newOrderNumber}`)

      // Redirect to homepage after a delay
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error) {
      console.error('Order processing failed', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    )
  }

  // If we have an order number, show success screen
  if (orderNumber) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg mb-2">Thank you for your order.</p>
          <p className="text-stone-600 mb-6">Your order number is: {orderNumber}</p>
          <Link href="/">
            <Button className="bg-amber-700 hover:bg-amber-800">Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-amber-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="Enter your state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      placeholder="Enter 6-digit pincode"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Payment Method</h2>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={handleRadioChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">
                    Cash on Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="razorpay" id="razorpay" disabled />
                  <Label htmlFor="razorpay" className="cursor-pointer text-gray-500">
                    Online Payment (Coming Soon)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between mt-8">
              <Link href="/cart">
                <Button variant="outline" type="button">
                  Return to Cart
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-amber-700 hover:bg-amber-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-stone-100 p-6 rounded-lg shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold text-stone-800 mb-4">Order Summary</h2>

            {/* Items List */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3">
                  <div className="w-12 h-12 relative rounded overflow-hidden bg-white">
                    {item.product.images && item.product.images[0]?.image && (
                      <Image
                        src={
                          typeof item.product.images[0].image === 'object'
                            ? (item.product.images[0].image as Media).url ||
                              '/placeholder-image.jpg'
                            : '/placeholder-image.jpg'
                        }
                        alt={item.product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-stone-800">{item.product.name}</p>
                    <p className="text-xs text-stone-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-stone-800">
                    ₹
                    {((item.product.discountedPrice ?? item.product.price) * item.quantity).toFixed(
                      2,
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Details */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-stone-700">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-stone-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
