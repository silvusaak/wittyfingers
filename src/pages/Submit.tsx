import { useState, useEffect } from "react";
import { MenuButton } from "@/components/MenuButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import wtfLogo from "@/assets/wtf-logo.png";

const Submit = () => {
  const [nickname, setNickname] = useState("");
  const [mottoText, setMottoText] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const { toast, dismiss } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    dismiss();
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 90) + 10;
    const num2 = Math.floor(Math.random() * 90) + 10;
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

    const captchaNum = parseInt(captcha, 10);
    if (Number.isNaN(captchaNum) || captchaNum !== captchaQuestion.answer) {
      toast({
        title: "Error",
        description: "Please answer the math problem correctly",
        variant: "destructive",
      });
      generateCaptcha();
      return;
    }

    if (website.trim() !== "") {
      return;
    }

    setIsSubmitting(true);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      const { data, error } = await supabase.functions.invoke("submit-motto", {
        body: {
          nickname: nickname.trim() || "anonymous",
          motto_text: mottoText.trim(),
          timezone,
        },
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

      const errMsg = data?.error;
      if (errMsg) {
        if (data?.status === 429 || String(errMsg).includes("per day")) {
          toast({
            title: "Limit reached",
            description: "Maximum one submission per day per device. Try again tomorrow.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: errMsg,
            variant: "destructive",
          });
        }
        return;
      }

      const { count } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true });

      toast({
        title: "Success!",
        description:
          count != null
            ? `Your submission is #${count}. You can look it up anytime with the search icon on the home page.`
            : "Your answer has been submitted.",
      });

      setNickname("");
      setMottoText("");
      setCaptcha("");
      generateCaptcha();

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "This didn't work, let's try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="hover:opacity-80 transition-opacity flex flex-col items-center"
          aria-label="Return to home"
        >
          <img src={wtfLogo} alt="WTF Logo" className="w-20 h-20 md:w-28 md:h-28" />
          <span className="text-xs md:text-sm font-handwritten text-muted-foreground">
            wittyfingers.com
          </span>
        </button>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <MenuButton />
      </div>

      <div className="container mx-auto px-4 pt-32 md:pt-40 pb-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-serious font-bold mb-12 md:mb-16 text-center">
          Submit your thoughts
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

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
            <Label htmlFor="captcha" className="text-sm font-serious">
              Solve this to prove you're human:
            </Label>
            <div className="flex items-center gap-3 p-3 bg-secondary border border-border rounded">
              <span className="text-lg font-handwritten">
                {captchaQuestion.num1} + {captchaQuestion.num2} = ?
              </span>
            </div>
            <Input
              id="captcha"
              type="number"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              placeholder="Enter your answer"
              className="text-sm h-9"
              required
            />
            <Button
              type="button"
              variant="ghost"
              onClick={generateCaptcha}
              className="text-xs h-7"
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

          <p className="text-xs text-muted-foreground text-center space-y-2">
            Your nickname and timezone will be public with the corresponding date you submitted your
            answer. If you do not provide your nickname, we will publish as &apos;anonymous&apos;.
            <br />
            <br />
            Submissions are public, stored indefinitely and the provider reserves the right to
            moderate the content. By submitting you confirm you have read this note and agree to the
            terms of the service.
            <br />
            For deleting your submission please{" "}
            <Link to="/contact" className="underline font-medium">
              contact us
            </Link>
            .
          </p>
        </form>
      </div>

      <footer className="py-2 px-4 text-center shrink-0 mt-auto mb-16">
        <p className="text-[10px] font-serious text-green-600">
          If you or anyone close to you struggles with mental health, don&apos;t be ashamed to
          contact your local helpline for support.
        </p>
      </footer>
    </div>
  );
};

export default Submit;
