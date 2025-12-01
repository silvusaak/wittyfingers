import { useState, useEffect } from "react";
import { MenuButton } from "@/components/MenuButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import wtfLogo from "@/assets/wtf-logo.png";

const Submit = () => {
  const [nickname, setNickname] = useState("");
  const [mottoText, setMottoText] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setCaptcha("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mottoText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a motto",
        variant: "destructive",
      });
      return;
    }

    if (mottoText.length > 10000) {
      toast({
        title: "Error",
        description: "Motto must be less than 10,000 characters",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(captcha) !== captchaQuestion.answer) {
      toast({
        title: "Error",
        description: "Please answer the math problem correctly",
        variant: "destructive",
      });
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("mottos").insert({
      nickname: nickname.trim() || "anonymous",
      motto_text: mottoText.trim(),
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "This didn't work, let's try again",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your motto has been submitted",
    });

    setNickname("");
    setMottoText("");
    setCaptcha("");
    generateCaptcha();
    
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-background relative">
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

      <div className="container mx-auto px-4 pt-32 md:pt-40 pb-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-serious font-bold mb-8 text-center">
          Submit your thoughts
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-lg font-serious">
              Nickname (optional)
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Leave empty for 'anonymous'"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motto" className="text-lg font-serious">
              What ADHD feels like today...
            </Label>
            <Textarea
              id="motto"
              value={mottoText}
              onChange={(e) => setMottoText(e.target.value)}
              placeholder="Share your experience"
              className="min-h-[200px] text-lg resize-none"
              maxLength={10000}
            />
            <p className="text-sm text-muted-foreground text-right">
              {mottoText.length} / 10,000
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="captcha" className="text-base font-serious">
              Solve this to prove you're human:
            </Label>
            <div className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-lg">
              <span className="text-2xl font-handwritten">
                {captchaQuestion.num1} + {captchaQuestion.num2} = ?
              </span>
            </div>
            <Input
              id="captcha"
              type="number"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              placeholder="Enter your answer"
              className="text-base"
              required
            />
            <Button
              type="button"
              variant="ghost"
              onClick={generateCaptcha}
              className="text-xs"
            >
              Generate a new question
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-xl py-6 font-handwritten"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Submit;
