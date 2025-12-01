import { useState } from "react";
import { MenuButton } from "@/components/MenuButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Submit = () => {
  const [nickname, setNickname] = useState("");
  const [mottoText, setMottoText] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

    if (captcha.toLowerCase() !== "adhd") {
      toast({
        title: "Error",
        description: "Please answer the captcha correctly",
        variant: "destructive",
      });
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
        description: "Failed to submit motto. Please try again.",
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
    
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <MenuButton />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-handwritten font-bold mb-8 text-center">
          Submit Your Motto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-lg">
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
            <Label htmlFor="motto" className="text-lg">
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
            <Label htmlFor="captcha" className="text-lg">
              What do the letters A-D-H-D spell?
            </Label>
            <Input
              id="captcha"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              placeholder="Type the answer"
              className="text-lg"
              required
            />
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
