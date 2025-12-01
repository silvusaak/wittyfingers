import { MenuButton } from "@/components/MenuButton";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <MenuButton />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-handwritten font-extrabold mb-8 text-center">
          Contact & Disclaimer
        </h1>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-handwritten font-extrabold">
              Disclaimer
            </h2>
            <div className="text-lg md:text-xl leading-relaxed space-y-4 font-serious">
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
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-handwritten font-extrabold">
              Contact
            </h2>
            <div className="text-lg md:text-xl leading-relaxed font-serious">
              <p>
                For questions, concerns, or feedback about this project, please
                reach out through appropriate channels.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
