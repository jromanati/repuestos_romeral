"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      })
    }, 3000)
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Teléfono",
      description: "Llamadas y WhatsApp",
      value: "+56968129078",
      action: () => window.open("tel:+56968129078"),
      color: "bg-green-100 text-green-600",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Respuesta inmediata",
      value: "Enviar mensaje",
      action: () =>
        window.open("https://wa.me/56968129078?text=Hola! Me gustaría ponerme en contacto con ustedes.", "_blank"),
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Consultas detalladas",
      value: "repuestosromeral.mc@gmail.com",
      action: () => window.open("mailto:repuestosromeral.mc@gmail.com"),
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: MapPin,
      title: "Visítanos",
      description: "Atención presencial",
      value: "Av. Libertad 1116, Romeral",
      action: () => window.open("https://maps.google.com/?q=Av.+Libertad+1116+Romeral+Chile", "_blank"),
      color: "bg-red-100 text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-full mb-8">
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold">Contacto</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Estamos Aquí
              <span className="block text-green-200">Para Ayudarte</span>
            </h1>

            <p className="text-xl md:text-2xl text-green-100 leading-relaxed max-w-3xl mx-auto">
              ¿Tienes preguntas sobre repuestos? ¿Necesitas una cotización? ¿Buscas asesoría técnica? Contáctanos por el
              medio que prefieras.
            </p>
          </div>
        </div>
      </section>

      {/* Métodos de contacto */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Múltiples Formas de Contactarnos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elige el método que más te convenga. Estamos disponibles para atenderte de la mejor manera.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={method.action}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <method.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <p className="text-gray-800 font-medium">{method.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Información adicional */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Si prefieres escribirnos, completa el formulario y te responderemos a la brevedad. Nos comprometemos
                    a contestar todas las consultas dentro de las próximas 24 horas.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Horarios de Atención</h3>
                      <p className="text-gray-600">Lun-Vie: 09:30 a 13:30 / 15:00 a 19:00</p>
                      <p className="text-gray-600">Sáb: 10:00 a 17:00</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Respuesta Rápida</h3>
                      <p className="text-gray-600">WhatsApp para consultas urgentes</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <CheckCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Compromiso</h3>
                      <p className="text-gray-600">Respuesta garantizada en 24 horas</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-3">¿Consulta Urgente?</h3>
                  <p className="text-green-100 mb-4">
                    Para consultas urgentes o cotizaciones inmediatas, te recomendamos contactarnos directamente por
                    WhatsApp.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      window.open(
                        "https://wa.me/56968129078?text=Hola! Tengo una consulta urgente sobre repuestos.",
                        "_blank",
                      )
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Directo
                  </Button>
                </div>
              </div>

              {/* Formulario */}
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">¡Mensaje Enviado!</h3>
                      <p className="text-gray-600">
                        Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="nombre">Nombre Completo *</Label>
                          <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleInputChange("nombre", e.target.value)}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefono">Teléfono *</Label>
                          <Input
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) => handleInputChange("telefono", e.target.value)}
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="asunto">Asunto *</Label>
                        <Select value={formData.asunto} onValueChange={(value) => handleInputChange("asunto", value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Selecciona el tipo de consulta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cotizacion">Solicitar Cotización</SelectItem>
                            <SelectItem value="asesoria">Asesoría Técnica</SelectItem>
                            <SelectItem value="disponibilidad">Consultar Disponibilidad</SelectItem>
                            <SelectItem value="garantia">Garantía y Devoluciones</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="mensaje">Mensaje *</Label>
                        <Textarea
                          id="mensaje"
                          value={formData.mensaje}
                          onChange={(e) => handleInputChange("mensaje", e.target.value)}
                          required
                          rows={5}
                          className="mt-2"
                          placeholder="Describe tu consulta o necesidad..."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Enviar Mensaje
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
