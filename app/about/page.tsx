"use client"

import Image from "next/image"
import { MapPin, Phone, Mail, Clock, Users, Award, Truck, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const stores = [
    {
      name: "Repuestos Romeral",
      address: "Av. Libertad 1116 y 1024, Local 4, Romeral",
      phone: "+56 9 6812 9078",
      hours: "Lun-Vie: 9:00-18:00, Sáb: 9:00-13:00",
      mapUrl: "https://maps.app.goo.gl/4gmbV9XsR5LEmFw99",
    },
  ]

  const stats = [
    { icon: Users, label: "Clientes Satisfechos", value: "5,000+" },
    { icon: Award, label: "Años de Experiencia", value: "9+" },
    { icon: Truck, label: "Repuestos en Stock", value: "2,000+" },
    { icon: Shield, label: "Garantía", value: "Calidad Garantizada" },
  ]

  const team = [
    {
      name: "Juan Carlos Pérez",
      position: "Gerente General",
      image: "/placeholder.svg?height=300&width=300&text=Juan+Carlos",
      description: "15 años de experiencia en el sector automotriz",
    },
    {
      name: "María Elena González",
      position: "Jefa de Ventas",
      image: "/placeholder.svg?height=300&width=300&text=María+Elena",
      description: "Especialista en atención al cliente y ventas",
    },
    {
      name: "Roberto Silva",
      position: "Jefe Técnico",
      image: "/placeholder.svg?height=300&width=300&text=Roberto",
      description: "Experto en instalación y soporte técnico",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quiénes Somos</h1>
            <p className="text-xl text-blue-100">
              Especialistas en repuestos para vehículos livianos en Romeral desde 2015
            </p>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Repuestos Romeral es un negocio local dedicado a proveer repuestos de calidad para vehículos livianos
                  en la comuna de Romeral. Desde 2015, nos hemos enfocado en brindar una atención personalizada y
                  asesoría técnica a nuestros clientes, convirtiéndonos en un referente en la zona.
                </p>
                <p>
                  Nuestro compromiso es ofrecer soluciones integrales para el mantenimiento y reparación de vehículos,
                  asegurando la satisfacción de cada cliente que confía en nosotros.
                </p>
              </div>
            </div>
            <div className="relative lg:h-[800px] rounded-lg overflow-hidden">
              <Image
                src="/images/image1.jpeg?height=400&width=600&text=Historia+AutoPartes"
                alt="Historia de AutoPartes Chile"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Números</h2>
            <p className="text-lg text-gray-600">Cifras que respaldan nuestra experiencia y compromiso</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Misión</h3>
                <p className="text-gray-700">
                  Ofrecer a nuestros clientes repuestos y accesorios de calidad para vehículos livianos, brindando una
                  atención personalizada y asesoría técnica para satisfacer sus necesidades y superar sus expectativas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Visión</h3>
                <p className="text-gray-700">
                  Ser reconocidos como el proveedor líder de repuestos y accesorios para vehículos livianos en Romeral,
                  destacando por nuestra calidad, servicio al cliente y compromiso con la comunidad.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Valores</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Calidad: Ofrecemos productos de alta calidad y durabilidad.</li>
                  <li>• Servicio al Cliente: Priorizamos la satisfacción de nuestros clientes.</li>
                  <li>• Compromiso: Estamos comprometidos con la comunidad de Romeral.</li>
                  <li>• Asesoría Técnica: Brindamos asesoría experta para ayudar a nuestros clientes.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
            <p className="text-lg text-gray-600">Profesionales comprometidos con tu satisfacción</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ubicaciones */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Sucursales</h2>
            <p className="text-lg text-gray-600">Visítanos en cualquiera de nuestras ubicaciones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stores.map((store, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{store.name}</h3>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{store.address}</span>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{store.phone}</span>
                    </div>

                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{store.hours}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-transparent"
                    variant="outline"
                    onClick={() => window.open(store.mapUrl, "_blank")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver en Google Maps
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contacto */}
      {/* <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Tienes Preguntas?</h2>
          <p className="text-xl text-blue-100 mb-8">Nuestro equipo está listo para ayudarte con cualquier consulta</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Phone className="w-5 h-5 mr-2" />
              Llamar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Mail className="w-5 h-5 mr-2" />
              Enviar Email
            </Button>
          </div>
        </div>
      </section> */}
    </div>
  )
}
