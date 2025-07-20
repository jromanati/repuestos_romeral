// Tipos para el sistema de pagos
export interface PaymentMethod {
  id: string
  name: string
  type: "webpay" | "transfer" | "cash"
  enabled: boolean
  description?: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  zipCode?: string
}

export interface OrderItem {
  productId: number
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CreateOrderRequest {
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethodId: string
  subtotal: number
  shippingCost: number
  total: number
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  subtotal: number
  shippingCost: number
  total: number
  createdAt: string
  updatedAt: string
  trackingNumber?: string
  notes?: string
}

export interface PaymentRequest {
  orderId: string
  amount: number
  currency: "CLP"
  paymentMethodId: string
  returnUrl: string
  cancelUrl: string
}

export interface PaymentResponse {
  paymentId: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  redirectUrl?: string
  transactionId?: string
  message?: string
}

export interface PaymentStatus {
  paymentId: string
  orderId: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  transactionId?: string
  amount: number
  currency: string
  processedAt?: string
  errorMessage?: string
}
