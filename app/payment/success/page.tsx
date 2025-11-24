"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { usePayment } from "@/hooks/use-payment"
import type { Order } from "@/types/payment"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getOrder, isLoading } = usePayment()
  const [order, setOrder] = useState<Order | null>(null)

  const orderId = searchParams.get("orderId")

  useEffect(() => {
    const loadOrder = async () => {
      console.log(searchParams, 'searchParams')
      if (orderId) {
        // const orderData = await getOrder(orderId)
        const orderData = await getOrder(orderId)

        if (orderData) {
          setOrder(orderData)
        } else {
          // Si no se puede cargar la orden, redirigir al inicio
          // setTimeout(() => router.push("/"), 3000)
        }
      }
    }

    loadOrder()
  }, [orderId, getOrder, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pedido no encontrado</h1>
          <p className="text-gray-600 mb-8">No pudimos encontrar la información de tu pedido.</p>
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header de éxito */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
          <p className="text-gray-600">Tu pedido ha sido procesado correctamente</p>
        </div>

        {/* Información del pedido */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Pedido #{order.orderNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Estado:</span>
                <span className="ml-2 font-medium text-green-600 capitalize">{order.status}</span>
              </div>
              <div>
                <span className="text-gray-600">Fecha:</span>
                <span className="ml-2 font-medium">{new Date(order.createdAt).toLocaleDateString("es-CL")}</span>
              </div>
              <div>
                <span className="text-gray-600">Método de pago:</span>
                <span className="ml-2 font-medium">{order.paymentMethod.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="ml-2 font-bold text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Productos Comprados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.price)} c/u</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>{order.shippingCost === 0 ? "GRATIS" : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de envío */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Información de Envío
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.region}
              </p>
              <p className="text-gray-600">{order.shippingAddress.phone}</p>
              <p className="text-gray-600">{order.shippingAddress.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Próximos pasos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>¿Qué sigue?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Confirmación por email</p>
                  <p className="text-gray-600">
                    Recibirás un email de confirmación con todos los detalles de tu pedido.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Preparación del pedido</p>
                  <p className="text-gray-600">Nuestro equipo preparará tu pedido en 1-2 días hábiles.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Envío</p>
                  <p className="text-gray-600">
                    Te notificaremos cuando tu pedido sea enviado con el número de seguimiento.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/catalog" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Seguir Comprando
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
