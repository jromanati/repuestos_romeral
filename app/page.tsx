"use client"

import Hero from "@/components/hero"
import WhyChooseUs from "@/components/why-choose-us"
import FeaturedProducts from "@/components/featured-products"
import FeaturedCategories from "@/components/featured-categories"
import Testimonials from "@/components/testimonials"
import ContactSection from "@/components/contact-section"
import { useCatalog } from "@/hooks/use-catalog"

export default function HomePage() {
  const { data } = useCatalog()

  const products = data?.products ?? []
  const categories = data?.categories ?? []

  return (
    <main>
      <Hero products={products } />
      <FeaturedProducts products={products} />
      <FeaturedCategories categories={categories} />
      <WhyChooseUs />
      {/* <Testimonials /> */}
      <ContactSection />
    </main>
  )
}
