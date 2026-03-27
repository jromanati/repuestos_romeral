"use client"

import Hero from "@/components/hero"
import WhyChooseUs from "@/components/why-choose-us"
import FeaturedProducts from "@/components/featured-products"
import Testimonials from "@/components/testimonials"
import ContactSection from "@/components/contact-section"
import { useCatalog } from "@/hooks/use-catalog"

export default function HomePage() {
  const { data } = useCatalog()

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
