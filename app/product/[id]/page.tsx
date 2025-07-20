"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"

// Mock data - en una aplicación real vendría de una API
const mockProduct = {
  id: 1,
  name: "Kit de Luces LED H4 6000K Premium",
  price: 45990,
  originalPrice: 59990,
  rating: 4.8,
  reviews: 124,
  images: [
    "/placeholder.svg?height=500&width=500&text=LED+Kit+1",
    "/placeholder.svg?height=500&width=500&text=LED+Kit+2",
    "/placeholder.svg?height=500&width=500&text=LED+Kit+3",
    "/placeholder.svg?height=500&width=500&text=LED+Kit+4",
  ],
  category: "luces",
  brand: "Philips",
  model: "Universal",
  sku: "LED-H4-6000K",
  inStock: true,
  stockQuantity: 15,
  badge: "Oferta",
  badgeColor: "bg-red-500",
  description:
    "Kit de luces LED H4 de alta calidad con tecnología avanzada que proporciona una iluminación superior y mayor durabilidad que las luces halógenas convencionales.",
  features: [
    "Temperatura de color: 6000K (blanco puro)",
    "Potencia: 35W por bombilla",
    "Flujo luminoso: 3600 lúmenes por bombilla",
    "Vida útil: 50,000 horas",
    "Voltaje: 12V DC",
    "Resistente al agua IP67",
    "Instalación plug & play",
    "Garantía de 2 años",
  ],
  compatibility: [
    "Toyota Corolla 2009-2019",
    "Nissan Sentra 2013-2020",
    "Hyundai Accent 2012-2018",
    "Chevrolet Cruze 2011-2016",
    "Ford Focus 2012-2018",
  ],
  specifications: {
    "Tipo de base": "H4",
    Voltaje: "12V DC",
    Potencia: "35W",
    "Temperatura de color": "6000K",
    "Flujo luminoso": "3600 lm",
    "Vida útil": "50,000 horas",
    Certificación: "CE, RoHS",
    "Resistencia al agua": "IP67",
  },
}
interface PageProps {
  params: {
    id: string;
  };
}
// @ts-ignore
// export default function ProductPage({ params }: PageProps) {
export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        image: mockProduct.images[0],
      })
    }
  }

  const discountPercentage = mockProduct.originalPrice
    ? Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-8">
        <Link href="/catalog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Catálogo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={mockProduct.images[selectedImage] || "/placeholder.svg"}
              alt={mockProduct.name}
              fill
              className="object-cover"
            />
            {mockProduct.badge && (
              <Badge className={`absolute top-4 left-4 ${mockProduct.badgeColor} text-white`}>
                {mockProduct.badge}
                {discountPercentage > 0 && ` -${discountPercentage}%`}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {mockProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded border-2 transition-all ${
                  selectedImage === index ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${mockProduct.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-gray-500 mb-2">
              {mockProduct.brand} • SKU: {mockProduct.sku}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{mockProduct.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(mockProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {mockProduct.rating} ({mockProduct.reviews} reseñas)
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">{formatPrice(mockProduct.price)}</span>
              {mockProduct.originalPrice && (
                <span className="text-xl text-gray-500 line-through">{formatPrice(mockProduct.originalPrice)}</span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{mockProduct.description}</p>

            {/* Stock */}
            <div className="flex items-center mb-6">
              {mockProduct.inStock ? (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  <span>En stock ({mockProduct.stockQuantity} disponibles)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                  <span>Agotado</span>
                </div>
              )}
            </div>

            {/* Cantidad y botones */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100">
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100">
                  +
                </button>
              </div>

              <Button
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleAddToCart}
                disabled={!mockProduct.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>

              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>

              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Envío gratis sobre $50.000</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Garantía de 2 años</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>Devolución 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs con información adicional */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibilidad</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Descripción del Producto</h3>
                <p className="text-gray-700 mb-6">{mockProduct.description}</p>
                <h4 className="text-lg font-semibold mb-3">Características Principales:</h4>
                <ul className="space-y-2">
                  {mockProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(mockProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}:</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Vehículos Compatibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mockProduct.compatibility.map((vehicle, index) => (
                    <div key={index} className="flex items-center py-2">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{vehicle}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  * Esta lista no es exhaustiva. Si tu vehículo no aparece, contáctanos para verificar compatibilidad.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Reseñas de Clientes</h3>
                <div className="space-y-6">
                  {[
                    {
                      name: "Carlos M.",
                      rating: 5,
                      date: "15 de Enero, 2024",
                      comment:
                        "Excelente producto, muy fácil de instalar y la iluminación es increíble. Muy recomendado.",
                    },
                    {
                      name: "María G.",
                      rating: 5,
                      date: "8 de Enero, 2024",
                      comment:
                        "Llegó rápido y en perfecto estado. La calidad de la luz es superior a las halógenas que tenía antes.",
                    },
                    {
                      name: "Roberto S.",
                      rating: 4,
                      date: "2 de Enero, 2024",
                      comment:
                        "Buen producto, aunque la instalación requiere un poco más de tiempo del esperado. El resultado final vale la pena.",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 mr-2">{review.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
