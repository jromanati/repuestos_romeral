"use client"

import { useState, useEffect } from "react"
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
import { ShippingCostsService } from "@/services/shipping-costs.service"
import { AuthService } from "@/services/auth.service"
import { CHILE_COMMUNES_BY_REGION, CHILE_REGION_LABELS, type ChileRegionKey } from "@/lib/chile-locations"
import type {
  CreateOrderPayload, CreateShippingAddress, CreateOrderItem, CreateOrderResult
} from "@/types/payment"

export default function CartPage() {
  const router = useRouter()
  const { items, subtotal, updateQty, removeItem, clear } = useCart()
  const { createOrder, isLoading, isAuthenticating, error } = usePayment()
  const useMockMercadoPagoOrder = process.env.NEXT_PUBLIC_MOCK_MP_ORDER === "true"
  

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
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery")

  // Cargar métodos de pago disponibles

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const [shippingCost, setShippingCost] = useState(0)
  const [shippingDiscount, setShippingDiscount] = useState(0)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  const [shippingThreshold, setShippingThreshold] = useState(0)
  const [shippingPercentage, setShippingPercentage] = useState(0)

  const finalTotal = subtotal + shippingCost

  const shippingText = deliveryMethod === "pickup"
    ? "GRATIS"
    : orderData.region && orderData.city
      ? isCalculatingShipping
        ? "Calculando..."
        : shippingError
          ? "Por calcular"
          : shippingCost === 0
            ? "GRATIS"
            : formatPrice(shippingCost)
      : "Por calcular"

  const isShippingResolved = deliveryMethod === "pickup" || (
    orderData.region &&
    orderData.city &&
    !isCalculatingShipping &&
    !shippingError
  )

  useEffect(() => {
    if (deliveryMethod === "pickup") {
      setShippingCost(0)
      setShippingDiscount(0)
      setShippingThreshold(0)
      setShippingPercentage(0)
      setShippingError(null)
      return
    }

    const region = orderData.region as ChileRegionKey
    const city = orderData.city
    const total = subtotal

    if (!region || !city || !total) {
      setShippingCost(0)
      setShippingDiscount(0)
      setShippingThreshold(0)
      setShippingPercentage(0)
      setShippingError(null)
      return
    }

    let cancelled = false

    const calculate = async (isRetry = false) => {
      if (cancelled) return
      setIsCalculatingShipping(true)
      setShippingError(null)

      const token = await ShippingCostsService.ensureAuthenticated()
      if (!token) {
        if (!cancelled) {
          setShippingCost(0)
          setShippingDiscount(0)
          setShippingThreshold(0)
          setShippingPercentage(0)
          setShippingError("No se pudo autenticar para calcular el envío")
          setIsCalculatingShipping(false)
        }
        return
      }

      const result = await ShippingCostsService.calculate({
        region: CHILE_REGION_LABELS[region] ?? region,
        city,
        order_total: total,
      })

      if (cancelled) return

      if (result.success && result.data) {
        setShippingCost(result.data.shipping_cost)
        setShippingDiscount(result.data.discount_applied)
        setShippingThreshold(result.data.discount_threshold)
        setShippingPercentage(result.data.discount_percentage)
      } else if (!isRetry && (result.error || "").toLowerCase().includes("401")) {
        const auth = await AuthService.authenticate()
        if (auth.success && auth.data) {
          return calculate(true)
        } else {
          setShippingCost(0)
          setShippingDiscount(0)
          setShippingThreshold(0)
          setShippingPercentage(0)
          setShippingError("No se pudo autenticar para calcular el envío")
        }
      } else if ((result.error || "").toLowerCase().includes("404")) {
        setShippingCost(0)
        setShippingDiscount(0)
        setShippingThreshold(0)
        setShippingPercentage(0)
        setShippingError("No hay envío disponible para esta comuna. Puedes cambiar a Retiro en tienda.")
      } else {
        setShippingCost(0)
        setShippingDiscount(0)
        setShippingThreshold(0)
        setShippingPercentage(0)
        setShippingError(result.error || "No se pudo calcular el envío")
      }

      if (!cancelled) setIsCalculatingShipping(false)
    }

    const timeoutId = setTimeout(() => calculate(), 300)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [deliveryMethod, orderData.region, orderData.city, subtotal])

  const handleInputChange = (field: string, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegionChange = (value: string) => {
    setOrderData((prev) => ({ ...prev, region: value, city: "" }))
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
        payment_method: "mercadopago",
        subtotal: subtotal,
        shippingCost: shippingCost,
        total: finalTotal,
        return_url: returnUrl,
        status_url: statusUrl,
        order_number: "",
        id: "",
      }
      const mockResponse: CreateOrderResult = {
        order_id: 7,
        payment_id: "e5c74b1c-cb69-4f29-bb24-0da8f7557402",
        provider: "mercadopago",
        redirect_data: {
          preference_id: "3243326856-978ef96f-0cfa-4c90-b56f-fe56862bebb8",
          init_point:
            "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=3243326856-978ef96f-0cfa-4c90-b56f-fe56862bebb8",
        },
      }

      const response = useMockMercadoPagoOrder
        ? await (async () => {
            await new Promise((r) => setTimeout(r, 250))
            return mockResponse
          })()
        : await createOrder(newCreateOrderPayload)
      if (!response) return

      localStorage.setItem("payment_id", String(response.payment_id ?? ""))
      localStorage.setItem("order_id", String(response.order_id ?? ""))

      if (response.redirect_data?.init_point) {
        window.location.href = response.redirect_data.init_point
        return
      }

      if (response.data_web_pay?.url && response.data_web_pay?.token) {
        window.location.href = `${response.data_web_pay.url}?token_ws=${response.data_web_pay.token}`
        return
      }

      throw new Error("Respuesta inválida del proveedor de pago")
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
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.name}</h3>
                      <p className="text-base sm:text-lg font-bold text-blue-600">{formatPrice(item.price)}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item._key)}
                      className="text-red-600 hover:text-red-700 h-8 w-8 p-0 flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item._key, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item._key, item.quantity + 1)} className="h-8 w-8 p-0">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                    <p className="font-bold text-sm sm:text-base">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumen y checkout */}
        <div className="space-y-6">

          {/* Formulario de checkout */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deliveryMethod">Método de entrega *</Label>
                <Select value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as "delivery" | "pickup")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Envío a domicilio</SelectItem>
                    <SelectItem value="pickup">Retiro en tienda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  <Select value={orderData.region} onValueChange={handleRegionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar región" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CHILE_REGION_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">Comuna *</Label>
                  <Select
                    value={orderData.city}
                    onValueChange={(value) => handleInputChange("city", value)}
                    disabled={!orderData.region}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={orderData.region ? "Seleccionar comuna" : "Selecciona una región"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(orderData.region &&
                        CHILE_COMMUNES_BY_REGION[orderData.region as keyof typeof CHILE_COMMUNES_BY_REGION]?.map(
                          (commune) => (
                            <SelectItem key={commune} value={commune}>
                              {commune}
                            </SelectItem>
                          )
                        )) || null}
                    </SelectContent>
                  </Select>
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
              {shippingDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Descuento en envío</span>
                  <span className="text-green-600">- {formatPrice(shippingDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  {deliveryMethod === "pickup" ? "Retiro en Tienda" : "Envío"}
                </span>
                <span className={shippingText === "GRATIS" || shippingText === "Por calcular" ? "text-green-600 font-medium" : "font-medium"}>
                  {shippingText}
                </span>
              </div>
              {shippingPercentage > 0 && shippingThreshold > 0 && (
                <p className="text-sm text-green-600">
                  A partir de {formatPrice(shippingThreshold)} tienes un {shippingPercentage}% de descuento en el envío
                </p>
              )}
              {shippingError && (
                <p className="text-sm text-red-600">{shippingError}</p>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
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
            disabled={isProcessing || isLoading || isAuthenticating || !validateForm() || !isShippingResolved}
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
