import { MottoCarousel } from "@/components/MottoCarousel";
import { MenuButton } from "@/components/MenuButton";
import { useNavigate } from "react-router-dom";
import wtfLogo from "@/assets/wtf-logo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="hover:opacity-80 transition-opacity"
          aria-label="Return to home"
        >
          <img src={wtfLogo} alt="WTF Logo" className="w-20 h-20 md:w-28 md:h-28" />
        </button>
      </div>
      
      <div className="absolute top-4 right-4 z-50">
        <MenuButton />
      </div>
      
      <header className="pt-32 md:pt-40 pb-6 px-4 text-center">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-serious font-bold">
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
