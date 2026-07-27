// Tipos para el cálculo de costos de envío
export interface CalculateShippingRequest {
  city: string
  region: string
  order_total: number
}

export interface CalculateShippingResponse {
  shipping_cost: number
  base_cost: number
  discount_applied: number
  discount_percentage: number
  discount_threshold: number
}
