import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { PromoBanner } from '@/components/home/PromoBanner';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoBanner />
      <TestimonialsSection />
    </>
  );
}
