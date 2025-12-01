import { MenuButton } from "@/components/MenuButton";
import { useNavigate } from "react-router-dom";
import wtfLogo from "@/assets/wtf-logo.png";

const Mission = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 hover:opacity-80 transition-opacity"
        aria-label="Return to home"
      >
        <img src={wtfLogo} alt="WTF Logo" className="w-20 h-20 md:w-28 md:h-28" />
      </button>
      
      <MenuButton />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
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
            This is not about defining ADHD. It's about acknowledging its many
            faces and finding solidarity in shared experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mission;
