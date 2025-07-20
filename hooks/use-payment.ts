"use client"

import { useState } from "react"
import { PaymentService } from "@/services/payment.service"
import type { CreateOrderRequest, Order, PaymentRequest, PaymentResponse, PaymentStatus } from "@/types/payment"

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (orderData: CreateOrderRequest): Promise<Order | null> => {
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

  const initiatePayment = async (paymentData: PaymentRequest): Promise<PaymentResponse | null> => {
    setIsLoading(true)
    setIsAuthenticating(true)
    setError(null)

    try {
      // Verificar autenticación antes de iniciar el pago
      const isAuthenticated = await PaymentService.ensureAuthenticated()
      setIsAuthenticating(false)

      if (!isAuthenticated) {
        setError("Error de autenticación del sistema")
        return null
      }

      const response = await PaymentService.initiatePayment(paymentData)

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Error al iniciar el pago")
        return null
      }
    } catch (err) {
      setError("Error inesperado al procesar el pago")
      return null
    } finally {
      setIsLoading(false)
      setIsAuthenticating(false)
    }
  }

  const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus | null> => {
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

  const getOrder = async (orderId: string): Promise<Order | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await PaymentService.getOrder(orderId)

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Error al obtener la orden")
        return null
      }
    } catch (err) {
      setError("Error inesperado al obtener la orden")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const pruebaJM = async (): Promise<Order | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await PaymentService.pruebaJM()

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Error al obtener la orden")
        return null
      }
    } catch (err) {
      setError("Error inesperado al obtener la orden")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isAuthenticating,
    error,
    createOrder,
    initiatePayment,
    checkPaymentStatus,
    getOrder,
    pruebaJM,
    clearError: () => setError(null),
  }
}
