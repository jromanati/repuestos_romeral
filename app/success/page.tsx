"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, ShoppingCart, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import {usePayment} from "@/hooks/use-payment"
import useSWR from 'swr'
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"  // ⬅️ NUEVO

export default function PagoResultado() {
  const searchParams = useSearchParams()
  // const [status, setStatus] = useState<"success" | "error" | "cancelled" | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const { checkPaymentStatus, isLoading } = usePayment()
  const [status, setStatus] = useState<string | null>(null)
  const router = useRouter()
  const { clear } = useCart()
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const paymentId = localStorage.getItem("payment_id")
      if (!paymentId){
        clear()
        router.push(`/carrito`)
      }
      else {
        const response = await checkPaymentStatus(paymentId)
        if (response && response.data_web_pay) {
          const dataWebPay = response.data_web_pay
          if (dataWebPay) {
            setStatus(dataWebPay.status)
          }
          else{
            setStatus("FAILED")
          }

        }
        
        clear();
        localStorage.setItem("payment_id", "")
        // setTimeout(() => {
        //   router.push(`/tienda`)
        // }, 10000) 
      }
    }

    fetchPaymentStatus()
  }, [])  // 👈 ejecuta solo al montar

  const getStatusConfig = () => {
    switch (status) {
      case "AUTHORIZED":
        return {
          icon: CheckCircle,
          title: "¡PAGO EXITOSO!",
          subtitle: "Tu compra ha sido procesada correctamente",
          message:
            "Gracias por tu compra. Recibirás un email de confirmación con los detalles de tu pedido. Tu producto será enviado en las próximas 24-48 horas.",
          bgGradient: "from-green-900/20 to-black",
          borderColor: "border-green-500",
          iconColor: "text-green-500",
          titleGradient: "from-green-400 to-yellow-500",
          buttonColor: "bg-green-600 hover:bg-green-700",
        }
      case "cancelled":
        return {
          icon: AlertCircle,
          title: "PAGO CANCELADO",
          subtitle: "Has cancelado el proceso de pago",
          message:
            "No se ha realizado ningún cargo. Puedes intentar nuevamente cuando estés listo o contactarnos si necesitas ayuda.",
          bgGradient: "from-yellow-900/20 to-black",
          borderColor: "border-yellow-500",
          iconColor: "text-yellow-500",
          titleGradient: "from-yellow-400 to-orange-500",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        }
      case "FAILED":
      default:
        return {
          icon: XCircle,
          title: "ERROR EN EL PAGO",
          subtitle: "No se pudo procesar tu pago",
          message:
            "Ha ocurrido un problema al procesar tu pago. Por favor, verifica tus datos e intenta nuevamente. Si el problema persiste, contacta nuestro soporte.",
          bgGradient: "from-red-900/20 to-black",
          borderColor: "border-red-500",
          iconColor: "text-red-500",
          titleGradient: "from-red-400 to-yellow-500",
          buttonColor: "bg-red-600 hover:bg-red-700",
        }
    }
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>
      </div>

      {/* Main Content */}
      <section className="relative py-20 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card
              className={`bg-gradient-to-br from-gray-900 to-black border-2 ${config.borderColor} shadow-2xl shadow-red-500/25`}
            >
              <CardContent className="p-12 text-center">
                {/* Icon */}
                <div className="mb-8">
                  <div className="relative inline-block">
                    <IconComponent className={`w-24 h-24 ${config.iconColor} mx-auto animate-pulse`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                  </div>
                </div>

                {/* Title */}
                <h1
                  className={`text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r ${config.titleGradient} drop-shadow-2xl`}
                >
                  {config.title}
                </h1>

                {/* Subtitle */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-300 mb-8">{config.subtitle}</h2>

                {/* Message */}
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg mx-auto">{config.message}</p>

                {/* Transaction ID */}
                {transactionId && status === "success" && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-400 mb-1">ID de Transacción:</p>
                    <p className="text-white font-mono text-lg">{transactionId}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {status === "success" ? (
                    <>
                      <Link href="/">
                        <Button
                          className={`${config.buttonColor} text-white font-bold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300`}
                        >
                          <Home className="w-5 h-5 mr-2" />
                          Ir al Inicio
                        </Button>
                      </Link>
                      <Link href="/catalog">
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent font-bold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Seguir Comprando
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/catalog">
                        <Button
                          className={`${config.buttonColor} text-white font-bold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300`}
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Volver a la Tienda
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent font-bold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
                        >
                          <Home className="w-5 h-5 mr-2" />
                          Ir al Inicio
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Support Contact */}
                {status !== "success" && (
                  <div className="mt-8 pt-8 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-2">¿Necesitas ayuda?</p>
                    <p className="text-gray-300">
                      Contacta nuestro soporte:
                      <a
                        href="mailto:soporte@repuestosromeral.cl"
                        className="text-red-400 hover:text-red-300 ml-1 underline"
                      >
                        soporte@repuestosromeral.cl
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
