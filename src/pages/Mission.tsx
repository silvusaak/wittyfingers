import { MenuButton } from "@/components/MenuButton";
import { useNavigate } from "react-router-dom";
import wtfLogo from "@/assets/wtf-logo.png";

const Mission = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
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
      
      <div className="container mx-auto px-4 pt-32 md:pt-40 pb-12 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-serious font-extrabold mb-8 text-center">
          Mission
        </h1>
        
        <div className="space-y-6 text-lg md:text-xl leading-relaxed font-handwritten">
          <p>
            This space exists to capture the fleeting, often contradictory moments
            of living with ADHD.
          </p>
          
          <p>
            Each submitted answer is a snapshot - a glimpse into how ADHD feels in a particular
            moment. Some days it's chaos, some days it's clarity, some days it's
            both at once.
          </p>
          
          <p>
            By sharing these moments, we create a collective understanding that
            ADHD isn't just one thing - it's a spectrum of experiences, constantly
            shifting and evolving.
          </p>
          
          <p>
            This is not about defining ADHD.
          </p>
          <p>
            It's about acknowledging its many
            faces and finding solidarity in shared experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mission;
