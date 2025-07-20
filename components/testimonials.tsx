import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Carlos Mendoza",
    location: "Santiago",
    rating: 5,
    comment:
      "Excelente servicio y productos de calidad. Las luces LED que compré superaron mis expectativas. Envío rápido y atención personalizada.",
    product: "Kit de Luces LED",
  },
  {
    id: 2,
    name: "María González",
    location: "Valparaíso",
    rating: 5,
    comment:
      "Muy satisfecha con mi compra. Los frenos Brembo funcionan perfectamente y el precio fue muy competitivo. Definitivamente volveré a comprar.",
    product: "Pastillas de Freno Brembo",
  },
  {
    id: 3,
    name: "Roberto Silva",
    location: "Concepción",
    rating: 4,
    comment:
      "Gran variedad de productos y excelente atención al cliente. El sistema de audio que instalé suena increíble. Recomendado 100%.",
    product: "Radio Pioneer",
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lo que Dicen Nuestros Clientes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Miles de clientes satisfechos respaldan la calidad de nuestros productos y servicio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>

                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                  <div className="text-sm text-blue-600 mt-1">Compró: {testimonial.product}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
