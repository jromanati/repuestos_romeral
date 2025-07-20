"use client"

import Image from "next/image"
import { Wrench, CheckCircle, MessageCircle, Phone, Users, Award, Clock, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AsesoriaTecnicaPage() {
  const servicios = [
    {
      icon: Wrench,
      title: "Diagnóstico de Problemas",
      description: "Identificamos el repuesto exacto que necesita tu vehículo según los síntomas presentados.",
    },
    {
      icon: CheckCircle,
      title: "Verificación de Compatibilidad",
      description: "Confirmamos que el repuesto sea 100% compatible con tu marca, modelo y año específico.",
    },
    {
      icon: Lightbulb,
      title: "Recomendaciones Técnicas",
      description: "Te sugerimos las mejores opciones según tu presupuesto y necesidades de uso.",
    },
    {
      icon: Users,
      title: "Instalación y Mantenimiento",
      description: "Te orientamos sobre la instalación correcta y cuidados posteriores del repuesto.",
    },
  ]

  const ventajas = [
    "Más de 9 años de experiencia en el rubro automotriz",
    "Conocimiento especializado en vehículos livianos",
    "Atención personalizada para cada cliente",
    "Asesoría gratuita sin compromiso de compra",
    "Respuesta rápida por WhatsApp",
    "Seguimiento post-venta",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-full mb-8">
              <Wrench className="w-6 h-6" />
              <span className="font-semibold">Asesoría Técnica</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Asesoría Técnica
              <span className="block text-blue-200">Especializada</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              No vendemos repuestos a ciegas. Te ayudamos a encontrar la pieza justa para tu vehículo, con un servicio
              directo y sin complicaciones.
            </p>
          </div>
        </div>
      </section>

      {/* Sección principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagen */}
            <div className="relative">
              <div className="relative h-96 lg:h-[800px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/aseoriatecnica.png?height=800&width=600&text=Asesoría+Técnica+Especializada"
                  alt="Asesoría Técnica Especializada"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Experiencia que Cuenta</h3>
                  <p className="text-blue-200">Más de 9 años ayudando a conductores de Romeral</p>
                </div>
              </div>

              {/* Elemento decorativo */}
              <div className="absolute -top-6 -right-6 bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
                <Award className="w-8 h-8" />
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Conocemos las Marcas, Modelos y Problemas Más Comunes
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  En Repuestos Romeral no solo vendemos repuestos, somos tus asesores técnicos. Nuestro equipo
                  especializado te guía para encontrar exactamente lo que tu vehículo necesita, evitando compras
                  innecesarias y garantizando la solución correcta.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Conocemos los problemas más frecuentes de cada marca y modelo, por eso podemos orientarte con
                  precisión y confianza.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Consulta Gratuita</h3>
                </div>
                <p className="text-blue-100 mb-4">
                  Nuestra asesoría técnica es completamente gratuita. No tienes compromiso de compra, solo queremos
                  ayudarte a tomar la mejor decisión.
                </p>
                <Button
                  variant="secondary"
                  onClick={() =>
                    window.open(
                      "https://wa.me/56968129078?text=Hola! Necesito asesoría técnica para encontrar un repuesto para mi vehículo.",
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Consultar Ahora
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios de asesoría */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿En Qué Te Ayudamos?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestros servicios de asesoría técnica cubren todos los aspectos que necesitas considerar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicios.map((servicio, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="bg-blue-100 p-4 rounded-2xl flex-shrink-0">
                      <servicio.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{servicio.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{servicio.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por Qué Confiar en Nosotros?</h2>
              <p className="text-lg text-gray-600">Nuestra experiencia y compromiso nos respaldan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ventajas.map((ventaja, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-gray-800 font-medium">{ventaja}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Tienes Dudas Sobre Qué Repuesto Necesitas?</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              No te preocupes, estamos aquí para ayudarte. Contáctanos y recibe asesoría técnica personalizada sin costo
              alguno.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg"
                onClick={() =>
                  window.open(
                    "https://wa.me/56968129078?text=Hola! Necesito asesoría técnica para mi vehículo.",
                    "_blank",
                  )
                }
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Consultar por WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent"
                onClick={() => window.open("tel:+56968129078")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Llamar Directamente
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-2 text-blue-200">
              <Clock className="w-5 h-5" />
              <span>Horario de atención: Lun-Vie 9:00-18:00, Sáb 9:00-13:00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
