import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Repuestos Romeral</h3>
            <p className="text-gray-300 mb-4">
              Tu tienda de repuestos confiable en el Maule. Especialistas en vehículos livianos con atención
              personalizada y asesoría técnica.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              {/* <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" /> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-white">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contacto
                </Link>
              </li>
              {/* <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white">
                  Devoluciones
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog?category=motor" className="text-gray-300 hover:text-white">
                  Motor
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=transmision" className="text-gray-300 hover:text-white">
                  Transmisión
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=direccion" className="text-gray-300 hover:text-white">
                  Dirección
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=suspension" className="text-gray-300 hover:text-white">
                  Suspensión
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=frenos" className="text-gray-300 hover:text-white">
                  Frenos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-2 text-gray-300">
              <p>📞 +56 9 6812 9078</p>
              <p>✉️ repuestosromeral.mc@gmail.com</p>
              <p>📍 Av. Libertad 1116 y 1024, Local 4 – Romeral</p>
              <p>🕒 Lun-Vie: 09:30 a 13:30 / 15:00 a 19:00</p>
              <p>🕒 Sáb: 10:00 a 17:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Repuestos Romeral. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
