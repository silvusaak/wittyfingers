import { MenuButton } from "@/components/MenuButton";
import { useNavigate } from "react-router-dom";
import wtfLogo from "@/assets/wtf-logo.png";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
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
        <h1 className="text-5xl md:text-7xl font-serious font-extrabold mb-12 md:mb-16 text-center">
          Contact & Disclaimer
        </h1>

        <div className="space-y-8 text-lg md:text-xl leading-relaxed font-handwritten">
          <section className="space-y-4">
            <p>
              This website is a creative space for sharing personal experiences
              related to ADHD. The mottos shared here are individual perspectives
              and should not be considered medical advice or professional guidance.
            </p>
            <p>
              If you're seeking help with ADHD or related concerns, please consult
              with qualified healthcare professionals.
            </p>
            <p>
              We reserve the right to moderate and remove content that is
              inappropriate, offensive, or violates community guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-serious font-extrabold mb-48 md:mb-64">
              Contact : <a href="mailto:info@wittyfingers.com" className="hover:underline">info@wittyfingers.com</a>
            </h2>
          </section>
        </div>
      </div>
      
      <footer className="py-2 px-4 text-center shrink-0 mt-auto mb-16">
        <p className="text-[10px] font-serious text-green-600">
          If you or anyone close to you struggles with mental health, don't be ashamed to contact your local helpline for support.
        </p>
      </footer>
    </div>
  );
};

export default Contact;
