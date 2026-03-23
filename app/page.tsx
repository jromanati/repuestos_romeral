"use client"

import Hero from "@/components/hero"
import WhyChooseUs from "@/components/why-choose-us"
import FeaturedProducts from "@/components/featured-products"
import Testimonials from "@/components/testimonials"
import ContactSection from "@/components/contact-section"
import { ProductService } from "@/services/product.service"
import useSWR from "swr"

const fetchCatalog = async () => {
  const isAuthenticated = await ProductService.ensureAuthenticated()
  if (!isAuthenticated) return { products: [] }

  const resp = await ProductService.getProducts()
  const rawProducts = (resp as any)?.data?.products ?? []
  return { products: rawProducts }
}

export default function HomePage() {
  const { data } = useSWR("catalog", fetchCatalog, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const products = data?.products ?? []

  return (
    <main>
      <Hero products={products} />
      <FeaturedProducts products={products} />
      <WhyChooseUs />
      <Testimonials />
      <ContactSection />
    </main>
  )
}
