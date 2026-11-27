import Banner from "@/components/homepage/banner";
import FeaturedServices from "@/components/homepage/FeaturedSection";
import SalonServiceCategories from "@/components/homepage/SalonServiceCategories";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <FeaturedServices></FeaturedServices>
      <SalonServiceCategories></SalonServiceCategories>
    </div>
  );
}
