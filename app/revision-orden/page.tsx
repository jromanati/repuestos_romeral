"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  MessageSquare,
  ShoppingCart,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
  ArrowLeft,
  Star
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePayment } from "@/hooks/use-payment"
import jsPDF from "jspdf"

// Interfaces
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
  // extras que usas en el render
  main_image?: string
  product_name?: string
}

interface CustomerData {
  first_name: string
  email: string
  phone: string
  city: string
  address: string
  zip_code: string
}

interface OrderSummary {
  notes: string
  subtotal: number
  shipping_cost: number
  total: number
  items: CartItem[]
  shipping_address: CustomerData
}

type PaymentState = "processing" | "approved" | "shipped" | "delivered" | "pending" | "cancelled"

interface OrderPayment {
  id: string
  status: PaymentState
  transaction_id: string
}

interface OrderData extends OrderSummary {
  order_number: string
  created_at: string
  status: "processing" | "confirmed" | "shipped" | "delivered" | "approved" | "pending" | "cancelled"
  tracking_number?: string
  estimatedDelivery?: string
  paymentMethod: string
  transaction_id?: string
  payments?: OrderPayment
  all_reviews?: unknown
}

// 1) Wrapper con Suspense — default export
export default function RevisionOrdenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <RevisionOrdenContent />
    </Suspense>
  )
}

// 2) Tu contenido real
function RevisionOrdenContent() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)

  const searchParams = useSearchParams()
  const orderId = useMemo(() => searchParams.get("orderId"), [searchParams])

  const { getOrder, checkPaymentStatus } = usePayment()

  // 1) mantener una referencia estable a getOrder
  const getOrderRef = useRef(getOrder)
  useEffect(() => {
    getOrderRef.current = getOrder
  }, [getOrder])

  const checkPaymentStatusRef = useRef(checkPaymentStatus)
  useEffect(() => {
    checkPaymentStatusRef.current = checkPaymentStatus
  }, [checkPaymentStatus])

  // 2) evitar llamadas repetidas para el mismo orderId
  const fetchedForIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError(true)
      return
    }

    // si ya buscamos este mismo orderId, no repitas
    if (fetchedForIdRef.current === orderId) return
    fetchedForIdRef.current = orderId

    let cancelled = false
    ;(async () => {
      try {
        localStorage.removeItem("order_data")
        const data = await getOrderRef.current(orderId)
        if (cancelled) return
        if (data) {
          // for now assert the returned Order fits OrderData; if the API shape differs,
          // map/transform fields here to build a proper OrderData object instead of casting.
          setOrderData(data as unknown as OrderData)
          localStorage.setItem("order_data", JSON.stringify(data))
        } else {
          setError(true)
        }
      } catch (e) {
        if (!cancelled) setError(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [orderId]) // <-- ojo: SOLO depende de orderId

  // 3) si la orden está pendiente por pago, consultar estado del pago usando el id de payments
  useEffect(() => {
    if (!orderData) return
    if (orderData.status !== "pending") return
    if (!orderData.payments?.id) return

    let cancelled = false
    ;(async () => {
      try {
        setIsCheckingPayment(true)
        const paymentStatus = await checkPaymentStatusRef.current(orderData.payments!.id)
        if (cancelled || !paymentStatus || !paymentStatus.status) return

        setOrderData(prev => {
          if (!prev) return prev
          const nextStatus = paymentStatus.status as PaymentState
          // actualiza el estado de la orden solo si cambió
          const updatedStatus = prev.status === nextStatus ? prev.status : nextStatus
          return {
            ...prev,
            status: updatedStatus,
            payments: prev.payments
              ? {
                  ...prev.payments,
                  status: paymentStatus.status as PaymentState,
                }
              : prev.payments,
          }
        })
      } finally {
        if (!cancelled) setIsCheckingPayment(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [orderData?.status, orderData?.payments?.id])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(price)

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "processing":
        return { label: "Procesando", color: "bg-yellow-500", icon: Clock, description: "Tu pedido está siendo procesado" }
      case "approved":
        return { label: "Confirmado", color: "bg-blue-500", icon: CheckCircle, description: "Tu pedido ha sido confirmado y está siendo preparado" }
      case "shipped":
        return { label: "Enviado", color: "bg-green-500", icon: Truck, description: "Tu pedido está en camino" }
      case "delivered":
        return { label: "Entregado", color: "bg-green-600", icon: Package, description: "Tu pedido ha sido entregado" }
      case "pending":
        return { label: "Pendiente", color: "bg-orange-500", icon: Clock, description: "Tu pedido está pendiente de pago" }
      case "cancelled":
        return { label: "Cancelado", color: "bg-red-600", icon: AlertCircle, description: "No se pudo procesar el pago y la orden fue cancelada" }
      default:
        return { label: "Desconocido", color: "bg-gray-500", icon: Clock, description: "Estado desconocido" }
    }
  }

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case "processing":
        return { label: "Procesando", color: "bg-yellow-500", icon: Clock }
      case "approved":
        return { label: "Pago Confirmado", color: "bg-blue-500", icon: CheckCircle }
      case "shipped":
        return { label: "Enviado", color: "bg-green-500", icon: Truck }
      case "delivered":
        return { label: "Entregado", color: "bg-green-600", icon: Package }
      case "pending":
        return { label: "Pendiente", color: "bg-orange-500", icon: Clock }
      case "cancelled":
        return { label: "Pago Cancelado", color: "bg-red-600", icon: AlertCircle }
      default:
        return { label: "Desconocido", color: "bg-gray-500", icon: Clock }
    }
  }

  const paymentStatusInfo = getPaymentStatusInfo(orderData?.payments?.status ?? "processing")
  const PaymentStatusIcon = paymentStatusInfo.icon

  const handleDownloadPDF = () => {
    if (!orderData) return

    const doc = new jsPDF({ unit: "mm", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const margin = 14
    const contentWidth = pageWidth - margin * 2
    let cursorY = margin

    const colors = {
      brand: [185, 28, 28] as [number, number, number],      // rojo elegante
      brandSoft: [248, 240, 240] as [number, number, number],
      text: [30, 30, 30] as [number, number, number],
      muted: [110, 110, 110] as [number, number, number],
      line: [222, 226, 230] as [number, number, number],
      soft: [248, 249, 250] as [number, number, number],
      soft2: [240, 240, 240] as [number, number, number],
      successBg: [232, 245, 233] as [number, number, number],
      successText: [46, 125, 50] as [number, number, number],
      warningBg: [255, 248, 225] as [number, number, number],
      warningText: [180, 120, 0] as [number, number, number],
    }

    const setText = (rgb: [number, number, number]) => {
      doc.setTextColor(rgb[0], rgb[1], rgb[2])
    }

    const setFill = (rgb: [number, number, number]) => {
      doc.setFillColor(rgb[0], rgb[1], rgb[2])
    }

    const setDraw = (rgb: [number, number, number]) => {
      doc.setDrawColor(rgb[0], rgb[1], rgb[2])
    }

    const money = (value: number | string) => formatPrice(Number(value || 0))

    const transactionId =
      (orderData.payments as any)?.provider_response?.id ||
      orderData.payments?.transaction_id ||
      "-"

    const drawFooter = () => {
      const footerY = pageHeight - 9
      setDraw(colors.line)
      doc.setLineWidth(0.2)
      doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      setText(colors.muted)
      doc.text(
        "Repuestos Romeral - www.repuestosromeral.cl - soporte@repuestosromeral.cl",
        pageWidth / 2,
        footerY,
        { align: "center" }
      )
    }

    const drawStatusBadge = (
      label: string,
      x: number,
      y: number,
      type: "success" | "warning" = "success"
    ) => {
      const paddingX = 2.5
      const height = 6.2
      const textWidth = doc.getTextWidth(label)
      const badgeWidth = textWidth + paddingX * 2

      const bg = type === "success" ? colors.successBg : colors.warningBg
      const fg = type === "success" ? colors.successText : colors.warningText

      setFill(bg)
      setDraw(bg)
      doc.roundedRect(x, y, badgeWidth, height, 1.5, 1.5, "FD")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(8.5)
      setText(fg)
      doc.text(label, x + paddingX, y + 4.2)
    }

    const ensureSpace = (needed: number) => {
      if (cursorY + needed > pageHeight - 20) {
        drawFooter()
        doc.addPage()
        cursorY = margin
      }
    }

    const drawContent = () => {
      setText(colors.text)

      // Franja superior de marca
      setFill(colors.brand)
      doc.rect(0, 0, pageWidth, 8, "F")

      cursorY = 14

      // Header principal
      const headerTop = cursorY
      const logoX = margin
      const logoY = headerTop + 1
      const logoW = 28
      const logoH = 18

      // Línea vertical decorativa
      setFill(colors.brand)
      doc.roundedRect(margin + 34, headerTop, 1.2, 22, 0.6, 0.6, "F")

      // Empresa
      const companyX = margin + 40
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      setText(colors.text)
      doc.text("Repuestos Romeral", companyX, headerTop + 6)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9.5)
      setText(colors.muted)
      doc.text("RUT: 76.123.456-7", companyX, headerTop + 12)
      doc.text("www.repuestosromeral.cl", companyX, headerTop + 17)

      // Bloque orden
      const orderBoxW = 62
      const orderBoxH = 24
      const orderBoxX = pageWidth - margin - orderBoxW
      const orderBoxY = headerTop - 1

      setFill(colors.soft)
      setDraw(colors.line)
      doc.roundedRect(orderBoxX, orderBoxY, orderBoxW, orderBoxH, 2, 2, "FD")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      setText(colors.brand)
      doc.text("ORDEN DE COMPRA", orderBoxX + 4, orderBoxY + 7)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9.5)
      setText(colors.text)
      doc.text(`N°: ${orderData.order_number}`, orderBoxX + 4, orderBoxY + 13)
      doc.text(`Fecha: ${orderData.created_at}`, orderBoxX + 4, orderBoxY + 18)

      cursorY = headerTop + 30

      // Título sección cliente
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      setText(colors.brand)
      doc.text("DATOS DEL CLIENTE", margin, cursorY)

      cursorY += 4

      // Card cliente
      const shipping = orderData.shipping_address
      const clientBoxY = cursorY
      const clientBoxH = 23

      setFill(colors.brandSoft)
      setDraw(colors.line)
      doc.roundedRect(margin, clientBoxY, contentWidth, clientBoxH, 2, 2, "FD")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      setText(colors.text)
      doc.text("Nombre", margin + 4, clientBoxY + 7)
      doc.text("Email", margin + 4, clientBoxY + 13)
      doc.text("Teléfono", margin + 4, clientBoxY + 19)

      doc.setFont("helvetica", "normal")
      setText(colors.text)
      doc.text(String(shipping.first_name || "-"), margin + 26, clientBoxY + 7)
      doc.text(String(shipping.email || "-"), margin + 26, clientBoxY + 13)
      doc.text(String(shipping.phone || "-"), margin + 26, clientBoxY + 19)

      cursorY += clientBoxH + 8

      // Tabla productos
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      setText(colors.brand)
      doc.text("DETALLE DE PRODUCTOS", margin, cursorY)

      cursorY += 4

      const tableX = margin
      const tableY = cursorY
      const tableW = contentWidth
      const headerH = 8

      const col1W = tableW * 0.62
      const col2W = tableW * 0.12
      const col3W = tableW * 0.26

      const col1X = tableX + 4
      const col2X = tableX + col1W + 4
      const col3X = tableX + col1W + col2W + 4
      const col3Right = tableX + tableW - 4

      setFill(colors.soft2)
      setDraw(colors.line)
      doc.roundedRect(tableX, tableY, tableW, headerH, 1.5, 1.5, "FD")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      setText(colors.text)
      doc.text("Producto", col1X, tableY + 5.2)
      doc.text("Cant.", col2X, tableY + 5.2)
      doc.text("Total", col3Right, tableY + 5.2, { align: "right" })

      cursorY = tableY + headerH

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9.5)

      orderData.items.forEach((item: any, index: number) => {
        const name = String(item.product_name || item.name || "-")
        const totalLine = money((item.price || 0) * (item.quantity || 0))

        const wrappedName = doc.splitTextToSize(name, col1W - 10)
        const rowHeight = Math.max(8, wrappedName.length * 4.5 + 2)

        ensureSpace(rowHeight + 2)

        const rowY = cursorY
        if (index % 2 === 0) {
          setFill([252, 252, 252])
          doc.rect(tableX, rowY, tableW, rowHeight, "F")
        }

        setDraw(colors.line)
        doc.line(tableX, rowY + rowHeight, tableX + tableW, rowY + rowHeight)

        setText(colors.text)
        doc.text(wrappedName, col1X, rowY + 5)

        doc.text(String(item.quantity || 0), col2X, rowY + 5)
        doc.text(totalLine, col3Right, rowY + 5, { align: "right" })

        cursorY += rowHeight
      })

      cursorY += 10
      ensureSpace(42)

      // Resumen final
      const summaryY = cursorY
      const summaryH = 36
      const leftW = 76
      const gap = 5
      const rightW = contentWidth - leftW - gap

      // Caja izquierda: montos
      setFill(colors.soft)
      setDraw(colors.line)
      doc.roundedRect(margin, summaryY, leftW, summaryH, 2, 2, "FD")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      setText(colors.brand)
      doc.text("RESUMEN DE PAGO", margin + 4, summaryY + 7)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      setText(colors.text)
      doc.text("Subtotal", margin + 4, summaryY + 15)
      doc.text(money(orderData.subtotal), margin + leftW - 4, summaryY + 15, { align: "right" })

      doc.text("Envío", margin + 4, summaryY + 22)
      doc.text(money(orderData.shipping_cost), margin + leftW - 4, summaryY + 22, { align: "right" })

      setDraw(colors.line)
      doc.line(margin + 4, summaryY + 25, margin + leftW - 4, summaryY + 25)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      setText(colors.brand)
      doc.text("Total", margin + 4, summaryY + 32)
      doc.text(money(orderData.total), margin + leftW - 4, summaryY + 32, { align: "right" })

      // Caja derecha: estados
      const rightX = margin + leftW + gap
      setFill([255, 255, 255])
      setDraw(colors.line)
      doc.roundedRect(rightX, summaryY, rightW, summaryH, 2, 2, "FD")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      setText(colors.brand)
      doc.text("ESTADO DE LA ORDEN", rightX + 4, summaryY + 7)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9.5)
      setText(colors.muted)
      doc.text("Orden", rightX + 4, summaryY + 15)
      doc.text("Pago", rightX + 4, summaryY + 23)
      doc.text("Transacción", rightX + 4, summaryY + 31)

      drawStatusBadge(
        statusInfo.label || "Pendiente",
        rightX + 25,
        summaryY + 10.5,
        (statusInfo.label || "").toLowerCase().includes("confirm")
          ? "success"
          : "warning"
      )

      drawStatusBadge(
        paymentStatusInfo.label || "Pendiente",
        rightX + 25,
        summaryY + 18.5,
        (paymentStatusInfo.label || "").toLowerCase().includes("confirm")
          ? "success"
          : "warning"
      )

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9.5)
      setText(colors.text)
      doc.text(String(transactionId), rightX + rightW - 4, summaryY + 31, { align: "right" })

      drawFooter()
      doc.save(`orden-${orderData.order_number}.pdf`)
    }

    // Cargar logo
    const img = new window.Image()
    img.src = "/images/logo_romeral_completo.png"

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          drawContent()
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)

        const dataUrl = canvas.toDataURL("image/png")

        // logo más contenido para que no invada el resto
        doc.addImage(dataUrl, "PNG", margin, 15, 28, 18)

        drawContent()
      } catch {
        drawContent()
      }
    }

    img.onerror = () => {
      drawContent()
    }
  }

  if (!orderData && !error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center py-12 px-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <div className="text-6xl mb-4">🤘</div>
          <h3 className="text-2xl font-bold mb-2">No encontramos tu orden</h3>
          <p className="text-gray-400 mb-6">Puede que el enlace haya expirado o que el número de orden sea incorrecto.</p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-5 py-2.5 font-medium hover:bg-gray-100 transition"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(orderData.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4">
            ESTADO DE TU ORDEN
          </h1>
          <p className="text-gray-400 text-lg">Orden #{orderData.order_number}</p>
          <p className="text-gray-500 text-sm">{orderData.created_at}</p>
        </div>

        <div className="mb-8">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-white-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${statusInfo.color}`}>
                    <StatusIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{statusInfo.label}</h3>
                    <p className="text-gray-400">{statusInfo.description}</p>
                    {orderData.tracking_number && (
                      <p className="text-sm text-red-400 mt-1">
                        Código de seguimiento: <span className="font-mono">{orderData.tracking_number}</span>
                      </p>
                    )}
                    {/* {orderData.estimatedDelivery && (
                      <p className="text-sm text-green-400 mt-1">Entrega estimada: {orderData.estimatedDelivery}</p>
                    )} */}
                  </div>
                </div>
                {/* {orderData.status === "approved" && !orderData.all_reviews && (
                  <div className="flex space-x-3">
                    <Link href="/resenas">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Star className="w-4 h-4 mr-2" />
                        Escribir Reseña
                      </Button>
                    </Link>
                  </div>
                )} */}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Datos del Cliente */}
          <div className="lg:col-span-2 space-y-8">
            {/* Información del Cliente */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-white-700/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Datos del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-400">Nombre</p>
                      <p className="text-white font-medium">{orderData.shipping_address.first_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{orderData.shipping_address.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-400">Teléfono</p>
                      <p className="text-white font-medium">{orderData.shipping_address.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-400">Ciudad</p>
                      <p className="text-white font-medium">{orderData.shipping_address.city}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Home className="w-5 h-5 text-red-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Dirección de Envío</p>
                    <p className="text-white font-medium">{orderData.shipping_address.address}</p>
                    {orderData.shipping_address.zip_code && (
                      <p className="text-gray-300 text-sm">Código Postal: {orderData.shipping_address.zip_code}</p>
                    )}
                  </div>
                </div>

                {orderData.notes && (
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-5 h-5 text-red-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Comentarios</p>
                      <p className="text-white font-medium">{orderData.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Productos del Carrito */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-white-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600 flex items-center">
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Productos Comprados ({orderData.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.main_image || "/placeholder.svg"}
                        alt={item.product_name}
                        width={80}
                        height={80}
                        className="rounded-lg border border-red-800/30"
                      />

                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">{item.product_name}</h4>
                        <div className="flex items-center space-x-3 mb-2">
                          {item.size && (
                            <Badge variant="outline" className="border-red-600 text-red-400 text-xs">
                              Talla: {item.size}
                            </Badge>
                          )}
                          {item.color && (
                            <Badge variant="outline" className="border-red-600 text-red-400 text-xs">
                              Color: {item.color}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Cantidad: {item.quantity}</span>
                          <span className="text-red-600 font-bold text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < orderData.items.length - 1 && <Separator className="bg-red-800/30 mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Resumen del Pedido */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-white-700 top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600 flex items-center">
                  <Package className="w-6 h-6 mr-2" />
                  Resumen de Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({orderData.items.reduce((sum, item) => sum + item.quantity, 0)} productos):</span>
                  <span className="font-bold">{formatPrice(orderData.subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Envío:</span>
                  <span className="font-bold">
                    {orderData.shipping_cost === 0 ? (
                      <span className="text-green-500">¡GRATIS!</span>
                    ) : (
                      formatPrice(orderData.shipping_cost)
                    )}
                  </span>
                </div>

                {orderData.shipping_cost === 0 && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-400">Envío gratis por compras sobre $50.000</p>
                  </div>
                )}

                <Separator className="bg-red-800/30" />

                <div className="flex justify-between text-2xl font-bold text-white">
                  <span>Total Pagado:</span>
                  <span className="text-green-500">{formatPrice(orderData.total)}</span>
                </div>

                <div className="bg-gradient-to-r from-green-950/30 to-transparent p-4 rounded-lg border border-green-800/30 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Método de pago:</span>
                      <span className="text-green-400 font-bold">
                        {orderData.paymentMethod || "MercadoPago"}
                      </span>
                    </div>
                    {/* <div className="flex justify-between text-sm">
                      <span className="text-gray-400">ID Transacción:</span>
                      <span className="text-green-400 font-mono text-xs">{orderData.payments.transaction_id}</span>
                    </div> */}
                    <div className="flex items-center space-x-2 mt-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-400 font-bold text-sm">
                        {paymentStatusInfo.label}
                      </span>
                    </div>
                    {isCheckingPayment && (
                      <p className="text-xs text-gray-400 mt-2">
                        Actualizando estado de pago...
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-400 hover:bg-blue-700 hover:text-white bg-transparent"
                    onClick={handleDownloadPDF}
                  >
                    Descargar PDF de la orden
                  </Button>

                  <Link href="/catalog">
                    <Button className="w-full mt-4 bg-red-700 hover:bg-red-600">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      SEGUIR COMPRANDO
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="mt-3 w-full border-red-600 text-red-400 hover:bg-red-700 hover:text-white bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al Inicio
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-white-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">¿Necesitas Ayuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">Si tienes alguna consulta sobre tu pedido, contáctanos:</p>
                  <div className="space-y-2">
                    <p className="text-sm text-white">📧 soporte@repuestosromeral.cl</p>
                    <p className="text-sm text-white">📱 +56 9 8765 4321</p>
                    <p className="text-sm text-white">🕒 Lun-Vie 9:00-18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
