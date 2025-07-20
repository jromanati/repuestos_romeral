import { CheckCircle, Users, Wrench, Car, MessageCircle, Truck, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const reasons = [
  {
    icon: Users,
    title: "Atención personalizada y cercana",
    description: "Servicio directo y sin complicaciones, como vecinos que somos",
  },
  {
    icon: Wrench,
    title: "Asesoría técnica confiable",
    description: "Conocemos las marcas, modelos y problemas más comunes",
  },
  {
    icon: Car,
    title: "Especialistas en vehículos livianos",
    description: "Enfoque específico en repuestos para autos y camionetas",
  },
  {
    icon: MessageCircle,
    title: "Cotizaciones y consultas por WhatsApp",
    description: "Respuesta rápida y directa a través de WhatsApp",
  },
  {
    icon: Truck,
    title: "Entrega rápida y precios competitivos",
    description: "Los mejores precios con tiempos de entrega optimizados",
  },
  {
    icon: Shield,
    title: "Confianza local con respaldo real",
    description: "Negocio establecido en Romeral con compromiso genuino",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por Qué Elegirnos?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Somos más que un negocio de autopartes: somos vecinos, mecánicos, asesores y apasionados por los vehículos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <reason.icon className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-red-50 px-6 py-3 rounded-full">
            <CheckCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Si no lo tenemos en stock, ¡lo conseguimos por ti!</span>
          </div>
        </div>
      </div>
    </section>
  )
}
