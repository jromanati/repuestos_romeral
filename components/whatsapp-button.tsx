"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const whatsappNumber = "56968129078" // Número de WhatsApp sin el +

  const handleWhatsAppClick = (message: string) => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
  }

  const quickMessages = [
    {
      title: "Consulta General",
      message: "Hola! Me gustaría hacer una consulta sobre sus productos.",
    },
    {
      title: "Soporte Técnico",
      message: "Hola! Necesito ayuda técnica para encontrar la pieza correcta para mi vehículo.",
    },
    {
      title: "Estado de Pedido",
      message: "Hola! Me gustaría consultar sobre el estado de mi pedido.",
    },
    {
      title: "Instalación",
      message: "Hola! Necesito información sobre la instalación de productos.",
    },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />}

      {/* Quick messages panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl z-50 w-80 max-w-[calc(100vw-2rem)]">
          <div className="p-4 border-b bg-green-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">AutoPartes Chile</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm mt-1 text-green-100">¿En qué podemos ayudarte?</p>
          </div>

          <div className="p-4 space-y-2">
            {quickMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleWhatsAppClick(msg.message)}
                className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{msg.title}</div>
                <div className="text-sm text-gray-600 mt-1">{msg.message}</div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-600 text-center">Horario de atención: Lun-Vie 9:00-18:00</p>
          </div>
        </div>
      )}

      {/* WhatsApp button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  )
}
