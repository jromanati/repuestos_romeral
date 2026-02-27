import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Necesitas un Repuesto?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestro equipo de especialistas está listo para ayudarte a encontrar el repuesto exacto para tu vehículo
            liviano
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600 mb-4">+56 9 6812 9078</p>
              <Button variant="outline" size="sm">
                Llamar Ahora
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">repuestosromeral.mc@gmail.com</p>
              <Button variant="outline" size="sm">
                Enviar Email
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600 mb-4">Romeral, Región del Maule</p>
              <Button variant="outline" size="sm">
                Ver Mapa
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Horarios</h3>
              <p className="text-gray-600 mb-4">Lun-Vie: 9:00-18:00</p>
              <Button variant="outline" size="sm">
                Ver Horarios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
