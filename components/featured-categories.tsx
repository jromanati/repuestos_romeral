import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Luces",
    description: "LED, Halógenas, Xenón",
    image: "/placeholder.svg?height=200&width=300",
    link: "/catalog?category=luces",
  },
  {
    name: "Frenos",
    description: "Pastillas, Discos, Líquidos",
    image: "/placeholder.svg?height=200&width=300",
    link: "/catalog?category=frenos",
  },
  {
    name: "Suspensión",
    description: "Amortiguadores, Resortes",
    image: "/placeholder.svg?height=200&width=300",
    link: "/catalog?category=suspension",
  },
  {
    name: "Audio",
    description: "Radios, Parlantes, Amplificadores",
    image: "/placeholder.svg?height=200&width=300",
    link: "/catalog?category=audio",
  },
  {
    name: "Llantas",
    description: "Aleación, Acero, Deportivas",
    image: "/placeholder.svg?height=200&width=300",
    link: "/catalog?category=llantas",
  },
  {
    name: "Motor",
    description: "Filtros, Aceites, Bujías",
    image: "/placeholder.svg?height=200&width=300",
    link: "/catalog?category=motor",
  },
]

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Categorías Destacadas</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra todo lo que necesitas para tu vehículo en nuestras categorías principales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.link}>
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
