import Banner from "@/components/homepage/banner";
import FeaturedServices from "@/components/homepage/FeaturedSection";
import SalonServiceCategories from "@/components/homepage/SalonServiceCategories";
import WhyChooseSalonBook from "@/components/homepage/WhyChooseSalonBook";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <FeaturedServices></FeaturedServices>
      <SalonServiceCategories></SalonServiceCategories>
      <WhyChooseSalonBook></WhyChooseSalonBook>
    </div>
  );
}
