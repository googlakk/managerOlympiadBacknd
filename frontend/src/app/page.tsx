import { HeroSection } from "@/components/custom/HeroSection";
import { OlympiadSection } from "@/components/custom/OlympiadSection";
import { getHomePageData } from "@/data/loaders";

const blockComponents = {
  "layout.hero-section": HeroSection,
  "layout.olympiad-section": OlympiadSection,
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
      {blocks.map(blockRenderer)}
    </div>
  );
}
