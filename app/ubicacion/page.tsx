"use client"

import { MapPin, Clock, Phone, Navigation, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function UbicacionPage() {
  const openGoogleMaps = () => {
    window.open("https://maps.google.com/?q=Av.+Libertad+1116+Romeral+Chile", "_blank")
  }

  const openWaze = () => {
    window.open("https://waze.com/ul?q=Av.+Libertad+1116+Romeral+Chile", "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-red-600 to-red-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-full mb-8">
              <MapPin className="w-6 h-6" />
              <span className="font-semibold">Ubicación</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Encuéntranos en el
              <span className="block text-red-200">Corazón de Romeral</span>
            </h1>

            <p className="text-xl md:text-2xl text-red-100 leading-relaxed max-w-3xl mx-auto">
              Estamos estratégicamente ubicados en Avenida Libertad para brindarte fácil acceso a los mejores repuestos
              automotrices de la región del Maule.
            </p>
          </div>
        </div>
      </section>

      {/* Información de ubicación */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Información detallada */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Información de Ubicación</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Dirección</h3>
                      <p className="text-gray-700 text-lg">
                        Avenida Libertad 1116 y 1024, Local 4<br />
                        Romeral, Región del Maule, Chile
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Horarios de Atención</h3>
                      <div className="text-gray-700 space-y-1">
                        <p>
                          <span className="font-medium">Lunes a Viernes:</span> 9:00 - 18:00
                        </p>
                        <p>
                          <span className="font-medium">Sábados:</span> 9:00 - 13:00
                        </p>
                        <p>
                          <span className="font-medium">Domingos:</span> Cerrado
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Contacto Directo</h3>
                      <p className="text-gray-700 text-lg">+56 9 6812 9078</p>
                      <p className="text-gray-600">Llamadas y WhatsApp</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                      <Car className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Estacionamiento</h3>
                      <p className="text-gray-700">Estacionamiento disponible frente al local</p>
                      <p className="text-gray-600">Fácil acceso para vehículos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">¿Cómo llegar?</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={openGoogleMaps}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>Abrir en Google Maps</span>
                  </Button>
                  <Button
                    onClick={openWaze}
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center space-x-2 bg-transparent"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>Abrir en Waze</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="space-y-6">
              <Card className="overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <div className="relative h-96 bg-gray-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.123456789!2d-71.123456!3d-34.987654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAv.%20Libertad%201116%2C%20Romeral!5e0!3m2!1ses!2scl!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación Repuestos Romeral"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              {/* Información adicional */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3">¿Vienes desde fuera de Romeral?</h3>
                <p className="text-red-100 mb-4">
                  Estamos ubicados en una zona de fácil acceso desde Curicó, Molina y otras comunas cercanas. ¡No dudes
                  en visitarnos!
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://wa.me/56968129078?text=Hola! Me gustaría saber cómo llegar a su local desde mi ubicación.",
                      "_blank",
                    )
                  }
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Consultar Ruta por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de referencias */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Referencias Cercanas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Algunos puntos de referencia que te ayudarán a encontrarnos más fácilmente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plaza de Armas</h3>
                <p className="text-gray-600">A 3 cuadras de la Plaza de Armas de Romeral</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ruta Principal</h3>
                <p className="text-gray-600">Sobre Avenida Libertad, vía principal de acceso</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fácil Acceso</h3>
                <p className="text-gray-600">Acceso directo desde la carretera principal</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
