import { apiClient, type ApiResponse } from "@/lib/api"
import { AuthService } from "@/services/auth.service"
import type { CreateOrderRequest, Order, PaymentRequest, PaymentResponse, PaymentStatus } from "@/types/payment"

export class PaymentService {
  // Obtener métodos de pago disponibles - DISABLED (using static methods)
  // static async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
  //   return apiClient.get<PaymentMethod[]>("/payment/methods")
  // }

  // Crear una nueva orden (requiere autenticación)
  static async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    // La autenticación se maneja automáticamente en apiClient
    return apiClient.post<Order>("/orders", orderData)
  }

  // Obtener detalles de una orden (requiere autenticación)
  static async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${orderId}`)
  }

  static async pruebaJM(): Promise<ApiResponse<Order>> {
    return apiClient.get(`payments/prueba/`)
  }

  // Iniciar proceso de pago (requiere autenticación)
  static async initiatePayment(paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>("/payment/initiate", paymentData)
  }

  // Verificar estado del pago (requiere autenticación)
  static async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentStatus>> {
    return apiClient.get<PaymentStatus>(`/payment/status/${paymentId}`)
  }

  // Confirmar pago (requiere autenticación)
  static async confirmPayment(paymentId: string, transactionData: any): Promise<ApiResponse<PaymentStatus>> {
    return apiClient.post<PaymentStatus>(`/payment/confirm/${paymentId}`, transactionData)
  }

  // Cancelar pago (requiere autenticación)
  static async cancelPayment(paymentId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/payment/cancel/${paymentId}`)
  }

  // Obtener historial de órdenes del usuario (requiere autenticación)
  static async getUserOrders(userId?: string): Promise<ApiResponse<Order[]>> {
    const endpoint = userId ? `/orders/user/${userId}` : "/orders/user"
    return apiClient.get<Order[]>(endpoint)
  }

  // Método para verificar autenticación manualmente si es necesario
  static async ensureAuthenticated(): Promise<boolean> {
    const token = await AuthService.getValidToken()
    return token !== null
  }
}
