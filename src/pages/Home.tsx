import { MottoCarousel } from "@/components/MottoCarousel";
import { MenuButton } from "@/components/MenuButton";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MenuButton />
      
      <header className="pt-12 pb-6 px-4 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-handwritten font-bold">
          What ADHD feels like today...
        </h1>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <MottoCarousel />
      </main>
    </div>
  );
};

export default Home;
