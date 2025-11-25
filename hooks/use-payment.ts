"use client"

import { useState } from "react"
import { PaymentService } from "@/services/payment.service"
import type { CreateOrderResponse, Order, PaymentRequest, PaymentResponse, PaymentStatus } from "@/types/payment"
import type { CreateOrderPayload, CreateReviewOrder} from "@/types/payment"

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (orderData: CreateOrderPayload): Promise<CreateOrderPayload | null> => {
    setIsLoading(true)
    setIsAuthenticating(true)
    setError(null)

    try {
      // Verificar autenticación antes de crear la orden
      const isAuthenticated = await PaymentService.ensureAuthenticated()
      setIsAuthenticating(false)

      if (!isAuthenticated) {
        setError("Error de autenticación del sistema")
        return null
      }

      const response = await PaymentService.createOrder(orderData)

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Error al crear la orden")
        return null
      }
    } catch (err) {
      setError("Error inesperado al crear la orden")
      return null
    } finally {
      setIsLoading(false)
      setIsAuthenticating(false)
    }
  }

  const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus | null> => {
    // Verificar autenticación antes de crear la orden
    const isAuthenticated = await PaymentService.ensureAuthenticated()
    setIsAuthenticating(false)

    if (!isAuthenticated) {
      setError("Error de autenticación del sistema")
      return null
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await PaymentService.getPaymentStatus(paymentId)

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Error al verificar el estado del pago")
        return null
      }
    } catch (err) {
      setError("Error inesperado al verificar el pago")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getOrder = async (orderId: string): Promise<CreateOrderResponse | null> => {
    const isAuthenticated = await PaymentService.ensureAuthenticated()
    setIsAuthenticating(false)

    if (!isAuthenticated) {
      setError("Error de autenticación del sistema")
      return null
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await PaymentService.getOrder(orderId)
      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Error al obtener la orden")
        console.log(response.error, 'aja')
        return null
      }
    } catch (err) {
      setError("Error inesperado al obtener la orden")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const createReviewOrder = async (
    reviewOrderData: CreateReviewOrder
  ): Promise<CreateReviewOrder | null> => {
    setIsLoading(true)
    setIsAuthenticating(true)
    setError(null)

    try {
      // Verificar autenticación antes de crear la orden
      const isAuthenticated = await PaymentService.ensureAuthenticated()
      setIsAuthenticating(false)

      if (!isAuthenticated) {
        setError("Error de autenticación del sistema")
        return null
      }

      const response = await PaymentService.createReviewOrder(reviewOrderData)
      return response.data || null
    } catch (err) {
      setError("Error inesperado al crear la review la orden")
      return null
    } finally {
      setIsLoading(false)
      setIsAuthenticating(false)
    }
  }

  return {
    isLoading,
    isAuthenticating,
    error,
    createOrder,
    checkPaymentStatus,
    getOrder,
    createReviewOrder,
    clearError: () => setError(null),
  }
}
