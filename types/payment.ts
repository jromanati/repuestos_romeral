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
  data_web_pay?: {
    url: string
    token: string
  }
  payment_id?: string | null
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

/** Métodos de pago aceptados por el backend */
export type PaymentMethodCode = "webpay" | "transfer" | "cash"

export interface CreateOrderItem {
  product_id: number
  price: number // CLP (entero)
  quantity: number
}

/** Dirección de envío */
export interface CreateShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  zipCode?: string
}

/** Payload para crear una orden (tal cual tu JSON) */
export interface CreateOrderPayload {
  items: CreateOrderItem[]
  shippingAddress: CreateShippingAddress
  payment_method: PaymentMethodCode
  subtotal: number        // suma(price * quantity)
  shippingCost: number
  total: number           // subtotal + shippingCost
  notes?: string
  return_url: string
  status_url: string
}

/** (Opcional) Respuesta básica de creación de orden */
export interface CreateOrderResponse {
  id: string
  order_number: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shipping_cost: number
  total: number
  created_at: string
  updated_at: string
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


export interface CreateReviewOrder {
  product_id: number
  order_id: number
  customer_name: string
  customer_email: string
  rating: number
  comment: string
}