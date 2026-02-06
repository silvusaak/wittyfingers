import { useEffect } from "react";
import { MottoCarousel } from "@/components/MottoCarousel";
import { MenuButton } from "@/components/MenuButton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import wtfLogo from "@/assets/wtf-logo.png";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Want to share your thoughts?",
        description: (
          <span>
            Submit{" "}
            <button
              onClick={() => navigate("/submit")}
              className="underline font-bold hover:opacity-80"
            >
              here
            </button>
            !
          </span>
        ),
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="hover:opacity-80 transition-opacity flex flex-col items-center"
          aria-label="Return to home"
        >
          <img src={wtfLogo} alt="WTF Logo" className="w-20 h-20 md:w-28 md:h-28" />
          <span className="text-xs md:text-sm font-handwritten text-muted-foreground">wittyfingers.com</span>
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

      <footer className="py-2 px-4 text-center shrink-0 mb-16">
        <p className="text-[10px] font-serious text-green-600">
          If you or anyone close to you struggles with mental health, don't be ashamed to contact your local helpline for support.
        </p>
      </footer>
    </div>
  );
};

export default Home;
