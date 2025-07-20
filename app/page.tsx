import Hero from "@/components/hero"
import WhyChooseUs from "@/components/why-choose-us"
import FeaturedProducts from "@/components/featured-products"
import Testimonials from "@/components/testimonials"
import ContactSection from "@/components/contact-section"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <FeaturedProducts />
      <Testimonials />
      <ContactSection />
    </main>
  )
}
