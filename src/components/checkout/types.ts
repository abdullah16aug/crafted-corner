export interface OrderItem {
  id: string
  name?: string
  quantity: number
  price?: number
  discountedPrice?: number
  product?: {
    id: string
    name: string
    price: number
  }
}

export interface RazorpaySuccessData {
  orderId: string
  paymentId: string
  signature: string
  payloadOrderId?: string
  orderNumber?: string
}

export interface RazorpayErrorResponse {
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
    metadata?: {
      order_id?: string
      payment_id?: string
    }
  }
}
