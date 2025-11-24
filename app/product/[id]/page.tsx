"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useProduct} from "@/hooks/use-products"
import type { ProductResponse} from "@/types/products"
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
  const { id } = useParams()
  const productId = Number(id)
  const { getProduct, isLoading } = useProduct()
  const [product, setProductData] = useState<ProductResponse | null>(null)
  const [relatedProducts, setrelatedProducts] = useState<ProductResponse[]>([])
  
  const [quantity, setQuantity] = useState(1)
  const { images = [], main_image } = product ?? {}
  const PLACEHOLDER = "/placeholder.svg?height=600&width=600"
  const { addItem, clear } = useCart()

  const imageUrls = useMemo(() => {
    const primary = (typeof main_image === "string" && main_image.trim()) ? [main_image] : []
    const gallery = Array.isArray(images) ? images.map(i => i?.url).filter(Boolean) : []
    const all = [...primary, ...gallery]
    const dedup = Array.from(new Set(all))
    return dedup.length ? dedup : [PLACEHOLDER]
  }, [main_image, images])
  const [selectedImage, setSelectedImage] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (selectedImage >= imageUrls.length) setSelectedImage(0)
  }, [imageUrls.length, selectedImage])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const [showFeatureErrors, setShowFeatureErrors] = useState(false)

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  function firstImageUrl(images?: any): string | undefined {
    if (!images || !Array.isArray(images) || images.length === 0) return undefined
    const first = images[0]
    return typeof first === "string" ? first : (first?.url || first?.secure_url || first?.path)
  }

  const handleAddToCart = (product: any) => {
    // construir opciones elegidas para el carrito
    console.log("Agregar al carrito:", product, "Cantidad:", quantity)
    clear()
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price), // venía string en tu payload
      image: product.image || product.main_image || firstImageUrl(product.images) || PLACEHOLDER,
      quantity, // usa tu estado de cantidad
    })
  }

  const handleSelect = (featureId: string | number, value: string | number) => {
    setSelectedOptions(prev => ({ ...prev, [String(featureId)]: String(value) }))
  }

  function mapRelatedProduct(product: any) {
    let image = PLACEHOLDER
    if (product.main_image){
      image = product.main_image
    }
    if (product.images.length > 0){
      image = product.images[0].url
    }
    return { ...product, image }
  }
  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        const productData = await getProduct(productId)
        if (productData) {
          console.log("Producto cargado:", productData)
          setProductData(productData)
          setrelatedProducts(productData.related.map(mapRelatedProduct))
        } else {
          setTimeout(() => router.push("/"), 3000)
          // setProductData(mockproduct)
        }
      }
      // setProductData(mockproduct)
    }
    loadProduct()
  }, [productId])
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  // const discountPercentage = product.originalPrice
  //   ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  //   : 0
  
  const discountPercentage = (product: ProductResponse) => {
    return product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0
  }

  const benefitConfig: Record<
    string,
    { icon: JSX.Element; label: string }
  > = {
    delivery: {
      icon: <Truck className="w-4 h-4 text-blue-600" />,
      label: "Envío gratis sobre",
    },
    warranty: {
      icon: <Shield className="w-4 h-4 text-blue-600" />,
      label: "Garantía",
    },
    return: {
      icon: <RotateCcw className="w-4 h-4 text-blue-600" />,
      label: "Devolución",
    },
  };

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
            <img src={imageUrls[selectedImage]} alt={product.name} className="object-cover"/>
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.is_new && <Badge className="bg-green-600 text-white font-bold">
                Nuevo</Badge>
              }
              {discountPercentage(product) > 0 && (
                <Badge className={`absolute top-4 left-4 bg-red-500 text-white`}>
                  Oferta
                  {` -${discountPercentage(product)}%`}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {imageUrls.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                  selectedImage === index ? "border-red-500" : "border-red-800/30 hover:border-red-600"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            {product.brand_data && (
              <div className="text-sm text-gray-500 mb-2">
                {product.brand_data.name} • SKU: {product.sku}
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* rating */}
            {/* <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ({product.reviews} reseñas)
              </span>
            </div> */}

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.original_price != product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6" style={{ whiteSpace: "pre-line" }}>
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center mb-6">
              {product.stock ? (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  <span>En stock ({product.stock} disponibles)</span>
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
                onClick={() => handleAddToCart(product)}
                disabled={!product.in_stock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {product.benefits?.map((benefit) => {
                const config = benefitConfig[benefit.benefit_type];
                if (!config) return null; // por si viene algo raro
                return (
                  <div
                    key={benefit.id}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    {config.icon}
                    <span>
                      {benefit.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs con información adicional */}
      <div className="mt-16">
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibilidad</TabsTrigger>
            {/* <TabsTrigger value="reviews">Reseñas</TabsTrigger> */}
          </TabsList>

          <TabsContent value="specifications" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications && product.specifications.map((d) => {
                    return (
                      <div key={d.id} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{d.name}:</span>
                        <span className="text-gray-700">{d.value}</span>
                      </div>
                    )
                  })}
                </div> 
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Vehículos Compatibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.compatibilities && product.compatibilities.map((d) => {
                    return (
                      <div key={d.id} className="flex items-center py-2">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{d.value}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  * Esta lista no es exhaustiva. Si tu vehículo no aparece, contáctanos para verificar compatibilidad.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="reviews" className="mt-8">
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
          </TabsContent> */}
        </Tabs>

        {/* Related Products */}
        <div>
          <h3 className="text-3xl font-bold text-red-600 mb-8 my-5 text-center">PRODUCTOS RELACIONADOS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="bg-gray-900 border border-red-800/30 hover:border-red-500 transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-0">
                  <img
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <h4 className="font-bold text-white mb-2">
                      {relatedProduct.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold text-lg">
                        ${relatedProduct.price.toLocaleString()}</span>
                      {/* rating */}
                      {/* <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-400">{relatedProduct.rating}</span>
                      </div> */}
                    </div>
                    <Link href={`/product/${relatedProduct.id}`}>
                      <Button className="w-full mt-4 bg-red-700 hover:bg-red-600">Ver Producto</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
