"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/hooks/use-cart"
import { usePayment } from "@/hooks/use-payment"
import type { PaymentMethod, CreateOrderRequest, ShippingAddress } from "@/types/payment"
import { PaymentService } from "@/services/payment.service"
import type {
  CreateOrderPayload, CreateShippingAddress, CreateOrderItem
} from "@/types/payment"

export default function CartPage() {
  const router = useRouter()
  const { items, subtotal, updateQty, removeItem, clear } = useCart()
  const { createOrder, initiatePayment, isLoading, isAuthenticating, error } = usePayment()
  

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "webpay",
      name: "Webpay Plus",
      type: "webpay",
      enabled: true,
      description: "Tarjetas de Crédito y Débito",
    },
    {
      id: "transfer",
      name: "Transferencia Bancaria",
      type: "transfer",
      enabled: true,
      description: "Pago por transferencia",
    },
    {
      id: "cash",
      name: "Pago Contra Entrega",
      type: "cash",
      enabled: true,
      description: "Pagar al recibir el producto",
    },
  ])
  const [orderData, setOrderData] = useState<ShippingAddress & { paymentMethodId: string }>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    zipCode: "",
    paymentMethodId: "webpay", // Set default to webpay
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Cargar métodos de pago disponibles

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const shippingCost = subtotal > 50000 ? 0 : 5990
  const finalTotal = subtotal + shippingCost

  const handleInputChange = (field: string, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const required = ["email", "firstName", "lastName", "phone", "address", "city", "region"]
    return required.every((field) => orderData[field as keyof typeof orderData]?.trim() !== "")
  }

  const handleCheckout_mock = async () => {
    if (!validateForm()) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    if (items.length === 0) {
      alert("Tu carrito está vacío")
      return
    }

    setIsProcessing(true)
    try {
      if (orderData.paymentMethodId === "webpay") {
        // --- INICIO FLUJO WEBPAY VIA API ROUTE ---
        const buyOrder = `ORDERMOCK-${Date.now()}`
        const sessionId = `SESSIONMOCK-${Date.now()}`
        const amount = finalTotal
        const returnUrl = `${window.location.origin}/payment/success?orderId=${buyOrder}`
        const res = await fetch("/api/webpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buy_order: buyOrder,
            session_id: sessionId,
            amount,
            return_url: returnUrl,
          }),
        })
        const data = await res.json()
        console.log(data, 'data')
        if (!res.ok) throw new Error(data.error || "Error al iniciar pago con Webpay")
        if (data.url && data.token) {
          window.location.href = `${data.url}?token_ws=${data.token}`
          return
        } else {
          throw new Error("Respuesta inválida de Webpay")
        }
        // --- FIN FLUJO WEBPAY ---
      } else {
        // Simular éxito de orden y pago para otros métodos
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setOrderSuccess(true)
        clear()
        setTimeout(() => {
          router.push(`/order/success?orderId=MOCK123`)
        }, 3000)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error inesperado durante el checkout (mock)")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmOrder = async () => {
    if (validateForm()) {
      // Aquí iría la lógica para procesar el pedido
      // CreateOrderPayload, CreateShippingAddress, CreateOrderItem
      
      const newShippingAddress: CreateShippingAddress = {        
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        region: orderData.region,
        zipCode: orderData.zipCode
      }
      const newCreateOrderItem: CreateOrderItem[] = items.map(item => ({
        product_id: item.id || 0,
        price: item.price,
        quantity: item.quantity,
      }))
      const returnUrl = `${window.location.origin}/success`
      const statusUrl = `${window.location.origin}/revision-orden`
      const newCreateOrderPayload: CreateOrderPayload = {
        items: newCreateOrderItem,
        shippingAddress: newShippingAddress,
        payment_method: "webpay",
        subtotal: subtotal,
        shippingCost: shippingCost,
        total: finalTotal,
        // notes: customerData.comentarios,
        return_url: returnUrl,
        status_url: statusUrl,
      }
      const response = await createOrder(newCreateOrderPayload)
      if (response && response.data_web_pay) {
        // Ensure we always store a string in localStorage (avoid undefined/null)
        localStorage.setItem("payment_id", String(response.payment_id ?? ""))
        if (response.data_web_pay.url && response.data_web_pay.token) {
          window.location.href = `${response.data_web_pay.url}?token_ws=${response.data_web_pay.token}`
          return
        } else {
          throw new Error("Respuesta inválida de Webpay")
        }
      }
      /*setCustomerData({
        nombre: "",
        email: "",
        telefono: "",
        ciudad: "",
        direccion: "",
        codigoPostal: "",
        comentarios: "",
      })
      setShowCheckout(false)
      setErrors({})
      clear()*/
    }
  }

  const updateQuantity = (key: string, newQuantity: number) => updateQty(key, newQuantity)

  const handleCheckout = async () => {
    if (!validateForm()) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    if (items.length === 0) {
      alert("Tu carrito está vacío")
      return
    }

    setIsProcessing(true)

    try {
      // 1. Crear la orden
      const orderRequest: CreateOrderRequest = {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          region: orderData.region,
          zipCode: orderData.zipCode,
        },
        paymentMethodId: orderData.paymentMethodId,
        subtotal: subtotal,
        shippingCost,
        subtotal: finalTotal,
      }

      const order = await createOrder(orderRequest)

      if (!order) {
        throw new Error("No se pudo crear la orden")
      }

      // 2. Iniciar el proceso de pago
      const paymentRequest = {
        orderId: order.id,
        amount: finalTotal,
        currency: "CLP" as const,
        paymentMethodId: orderData.paymentMethodId,
        returnUrl: `${window.location.origin}/payment/success?orderId=${order.id}`,
        cancelUrl: `${window.location.origin}/payment/cancel?orderId=${order.id}`,
      }
      const paymentResponse = await initiatePayment(paymentRequest)

      if (!paymentResponse) {
        throw new Error("No se pudo iniciar el pago")
      }

      // 3. Manejar la respuesta del pago
      if (paymentResponse.redirectUrl) {
        // Redirigir a la pasarela de pago (ej: Webpay)
        window.location.href = paymentResponse.redirectUrl
      } else if (paymentResponse.status === "approved") {
        // Pago aprobado inmediatamente (ej: transferencia)
        setOrderSuccess(true)
        clear()

        // Mostrar mensaje de éxito y redirigir después de unos segundos
        setTimeout(() => {
          router.push(`/order/success?orderId=${order.id}`)
        }, 3000)
      } else {
        throw new Error(paymentResponse.message || "Error en el procesamiento del pago")
      }
    } catch (err) {
      console.error("Error en checkout:", err)
      alert(err instanceof Error ? err.message : "Error inesperado durante el checkout")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">¡Agrega algunos productos increíbles a tu carrito!</p>
          <Link href="/catalog">
            <Button size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido Realizado con Éxito!</h1>
          <p className="text-gray-600 mb-8">
            Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.
          </p>
          <div className="space-y-4">
            <p className="text-lg font-semibold">Total pagado: {formatPrice(finalTotal)}</p>
            <p className="text-sm text-gray-600">Redirigiendo a la página de confirmación...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/catalog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar Comprando
          </Button>
        </Link>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isAuthenticating && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Autenticando con el sistema de pagos...</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productos en el carrito */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tu Carrito ({items.length} productos)</span>
                <Button variant="ghost" size="sm" onClick={clear} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vaciar Carrito
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    {/* <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    /> */}
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="w-full h-20 object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-lg font-bold text-blue-600">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item._key, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(item._key, item.quantity + 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumen y checkout */}
        <div className="space-y-6">
          {/* Resumen del pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Envío
                </span>
                <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                  {shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}
                </span>
              </div>
              {subtotal < 50000 && (
                <p className="text-sm text-gray-600">Agrega {formatPrice(50000 - subtotal)} más para envío gratis</p>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de checkout */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={orderData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={orderData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={orderData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={orderData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={orderData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">Región *</Label>
                  <Select value={orderData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar región" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metropolitana">Región Metropolitana</SelectItem>
                      <SelectItem value="valparaiso">Valparaíso</SelectItem>
                      <SelectItem value="biobio">Biobío</SelectItem>
                      <SelectItem value="araucania">La Araucanía</SelectItem>
                      <SelectItem value="los-lagos">Los Lagos</SelectItem>
                      <SelectItem value="antofagasta">Antofagasta</SelectItem>
                      <SelectItem value="atacama">Atacama</SelectItem>
                      <SelectItem value="coquimbo">Coquimbo</SelectItem>
                      <SelectItem value="ohiggins">O'Higgins</SelectItem>
                      <SelectItem value="maule">Maule</SelectItem>
                      <SelectItem value="nuble">Ñuble</SelectItem>
                      <SelectItem value="los-rios">Los Ríos</SelectItem>
                      <SelectItem value="aysen">Aysén</SelectItem>
                      <SelectItem value="magallanes">Magallanes</SelectItem>
                      <SelectItem value="tarapaca">Tarapacá</SelectItem>
                      <SelectItem value="arica">Arica y Parinacota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={orderData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* <div>
                <Label htmlFor="zipCode">Código Postal</Label>
                <Input
                  id="zipCode"
                  value={orderData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                />
              </div> */}
            </CardContent>
          </Card>

          {/* Método de pago */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={orderData.paymentMethodId}
                onValueChange={(value) => handleInputChange("paymentMethodId", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id} disabled={!method.enabled}>
                      {method.name}
                      {method.description && <span className="text-sm text-gray-500 ml-2">- {method.description}</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card> */}

          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleConfirmOrder}
            disabled={isProcessing || isLoading || isAuthenticating || !validateForm()}
          >
            {isAuthenticating
              ? "Autenticando..."
              : isProcessing
                ? "Procesando..."
                : `Finalizar Compra - ${formatPrice(finalTotal)}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
