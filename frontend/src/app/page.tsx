import CTA from "@/components/custom/CTA";
import Features from "@/components/custom/Features";
import FunFact from "@/components/custom/FunFact";
import Hero from "@/components/custom/Hero";
import { HeroSection } from "@/components/custom/HeroSection";
import Integration from "@/components/custom/Integration";
import { OlympiadSection } from "@/components/custom/OlympiadSection";
import { OlympiadsPreview } from "@/components/custom/Olympiads";
import ScrollUp from "@/components/common/scrollUp";
import { getHomePageData } from "@/data/loaders";

const blockComponents = {
  "layout.olympiad-section": OlympiadsPreview,
};

function blockRenderer(block: any) {
  const Component =
    blockComponents[block.__component as keyof typeof blockComponents];
  return Component ? <Component key={block.id} data={block} /> : null;
}
export default async function Home() {
  const strapiData = await getHomePageData();
  const { blocks } = strapiData || [];

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Hero />
      <Features />
      <ScrollUp />
      <FunFact />
      <Integration />
      <CTA />
      {blocks.map(blockRenderer)}
    </div>
  );
}
