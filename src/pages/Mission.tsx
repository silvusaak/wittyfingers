import { MenuButton } from "@/components/MenuButton";

const Mission = () => {
  return (
    <div className="min-h-screen bg-background">
      <MenuButton />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-handwritten font-bold mb-8 text-center">
          Mission
        </h1>
        
        <div className="space-y-6 text-lg md:text-xl leading-relaxed">
          <p>
            This space exists to capture the fleeting, often contradictory moments
            of living with ADHD.
          </p>
          
          <p>
            Each motto is a snapshot - a glimpse into how ADHD feels in a particular
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
