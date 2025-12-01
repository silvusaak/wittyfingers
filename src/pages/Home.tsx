import { MottoCarousel } from "@/components/MottoCarousel";
import { MenuButton } from "@/components/MenuButton";
import { useNavigate } from "react-router-dom";
import wtfLogo from "@/assets/wtf-logo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="w-full bg-muted/30 border-b border-border py-4 px-4">
        <button
          onClick={() => navigate("/")}
          className="hover:opacity-80 transition-opacity"
          aria-label="Return to home"
        >
          <img src={wtfLogo} alt="WTF Logo" className="w-20 h-20 md:w-24 md:h-24" />
        </button>
      </div>
      
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
