'use client'

import React, { useEffect } from 'react'
import Script from 'next/script'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RazorpayCheckoutProps {
  orderDetails: {
    amount: number
    customerName: string
    email: string
    phone: string
    items: Array<any>
  }
  onSuccess: (paymentData: any) => void
  onError: (error: any) => void
}

declare global {
  interface Window {
    Razorpay: any
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
      // Store order details before payment for webhook to reference later
      const storeOrderDetails = async () => {
        try {
          // Store customer and order details temporarily
          // This will be referenced by webhook when payment is complete
          const tempOrderResponse = await fetch('/api/razorpay/store-order-details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderDetails: {
                amount: orderDetails.amount,
                items: orderDetails.items,
                customerInfo: {
                  name: orderDetails.customerName,
                  email: orderDetails.email,
                  phone: orderDetails.phone,
                },
                shippingAddress: {
                  street:
                    (document.querySelector('[name="address"]') as HTMLInputElement)?.value ||
                    'To be updated',
                  city:
                    (document.querySelector('[name="city"]') as HTMLInputElement)?.value ||
                    'To be updated',
                  state:
                    (document.querySelector('[name="state"]') as HTMLInputElement)?.value ||
                    'To be updated',
                  zipCode:
                    (document.querySelector('[name="pincode"]') as HTMLInputElement)?.value ||
                    'To be updated',
                  country: 'India',
                },
              },
            }),
          })

          return await tempOrderResponse.json()
        } catch (error) {
          console.error('Failed to store order details:', error)
          throw error
        }
      }

      // Store order details first
      const storeResponse = await storeOrderDetails()

      if (!storeResponse.success) {
        throw new Error('Failed to store order details')
      }

      // Now create Razorpay order
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
          items: orderDetails.items,
          tempOrderId: storeResponse.tempOrderId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create Razorpay order')
      }

      // Configure Razorpay options
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
          tempOrderId: storeResponse.tempOrderId,
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
          })
        },
      }

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options)

      // Handle payment failure directly in the client
      razorpay.on('payment.failed', function (response: any) {
        const error = response.error
        console.error('Payment failed:', error)

        // Display meaningful error to customer
        const errorMessage =
          error.description ||
          'Your payment failed. Please try again or use a different payment method.'

        // Log additional details for debugging
        console.log('Payment failure details:', {
          code: error.code,
          description: error.description,
          source: error.source,
          step: error.step,
          reason: error.reason,
          orderId: response.error.metadata?.order_id,
          paymentId: response.error.metadata?.payment_id,
        })

        // Pass the error to the parent component
        onError(new Error(errorMessage))
      })

      razorpay.open()
    } catch (error) {
      console.error('Razorpay payment error:', error)
      onError(error)
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
