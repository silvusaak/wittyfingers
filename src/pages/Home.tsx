import { MottoCarousel } from "@/components/MottoCarousel";
import { MenuButton } from "@/components/MenuButton";
import { useNavigate } from "react-router-dom";
import wtfLogo from "@/assets/wtf-logo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 hover:opacity-80 transition-opacity"
        aria-label="Return to home"
      >
        <img src={wtfLogo} alt="WTF Logo" className="w-12 h-12 md:w-16 md:h-16" />
      </button>
      
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
