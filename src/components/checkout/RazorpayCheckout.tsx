'use client'

import React, { useEffect } from 'react'
import Script from 'next/script'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrderItem, RazorpaySuccessData, RazorpayErrorResponse } from './types'

interface RazorpayCheckoutProps {
  orderDetails: {
    amount: number
    customerName: string
    email: string
    phone: string
    items: OrderItem[]
  }
  onSuccess: (paymentData: RazorpaySuccessData) => void
  onError: (error: Error) => void
}

declare global {
  interface Window {
    Razorpay: any // This one is hard to type fully
  }
}

export default function RazorpayCheckout({
  orderDetails,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)

  // Handle the Razorpay checkout process
  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Get shipping address from form fields
      const shippingAddress = {
        street:
          (document.querySelector('[name="address"]') as HTMLInputElement)?.value ||
          'To be updated',
        city:
          (document.querySelector('[name="city"]') as HTMLInputElement)?.value || 'To be updated',
        state:
          (document.querySelector('[name="state"]') as HTMLInputElement)?.value || 'To be updated',
        zipCode:
          (document.querySelector('[name="pincode"]') as HTMLInputElement)?.value ||
          'To be updated',
        country: 'India',
      }

      console.log('Creating order in Payload first...')

      // 1. First create order in Payload with 'pending' status
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderDetails.items.map((item) => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price || item.discountedPrice || item.product?.price,
            productName: item.name || item.product?.name,
          })),
          totalAmount: orderDetails.amount,
          paymentMethod: 'razorpay',
          isPaid: false,
          status: 'pending',
          guestInfo: {
            name: orderDetails.customerName,
            email: orderDetails.email,
            phone: orderDetails.phone,
          },
          shippingAddress: shippingAddress,
        }),
      })

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error('Failed to create order in Payload:', errorText)
        throw new Error('Failed to create initial order')
      }

      const createdOrder = await orderResponse.json()
      console.log('Order created in Payload:', createdOrder)

      // 2. Now create Razorpay order
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderDetails.amount,
          customerName: orderDetails.customerName,
          email: orderDetails.email,
          phone: orderDetails.phone,
          orderNumber: createdOrder.doc.orderNumber,
          orderId: createdOrder.doc.id,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create Razorpay order')
      }

      // 3. Configure Razorpay options
      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Crafted Corners',
        description: 'Purchase from Crafted Corners',
        order_id: data.order.id,
        prefill: {
          name: orderDetails.customerName,
          email: orderDetails.email,
          contact: orderDetails.phone,
        },
        notes: {
          orderNumber: createdOrder.doc.orderNumber,
          payloadOrderId: createdOrder.doc.id,
        },
        theme: {
          color: '#B45309', // amber-700
        },
        handler: function (response: any) {
          // Payment is complete - webhook will handle server-side verification
          console.log('Payment successful, ID:', response.razorpay_payment_id)

          // Call success callback with payment info
          onSuccess({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            payloadOrderId: createdOrder.doc.id,
            orderNumber: createdOrder.doc.orderNumber,
          })
        },
      }

      // 4. Initialize Razorpay
      const razorpay = new window.Razorpay(options)

      // 5. Handle payment failure directly in the client
      razorpay.on('payment.failed', function (response: any) {
        const error = response.error
        console.error('Payment failed:', error)

        // Update the order status to failed
        fetch(`/api/orders/${createdOrder.doc.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'cancelled',
            razorpayDetails: {
              razorpay_id: data.order.id,
              payment_id: error.metadata?.payment_id,
              error_code: error.code,
              error_description: error.description,
              error_source: error.source,
              error_step: error.step,
              error_reason: error.reason,
              status: 'failed',
            },
          }),
        }).catch((err) => {
          console.error('Failed to update order status to cancelled:', err)
        })

        // Display meaningful error to customer
        const errorMessage =
          error.description ||
          'Your payment failed. Please try again or use a different payment method.'

        // Pass the error to the parent component
        onError(new Error(errorMessage))
      })

      // 6. Open Razorpay payment form
      razorpay.open()
    } catch (error: unknown) {
      console.error('Razorpay payment error:', error)
      onError(error instanceof Error ? error : new Error(String(error)))
    } finally {
      setIsLoading(false)
    }
  }

  // Check if Razorpay script is loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setIsReady(true)
    }
  }, [])

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setIsReady(true)} />

      <Button
        onClick={handlePayment}
        disabled={isLoading || !isReady}
        className="bg-amber-700 hover:bg-amber-800 w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay with Razorpay'
        )}
      </Button>
    </>
  )
}
