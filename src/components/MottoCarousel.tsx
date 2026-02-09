import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Answer {
  id: number;
  nickname: string | null;
  motto_text: string;
  created_at: string;
  timezone: string | null;
}

type Motto = Answer & { number: number };

export const MottoCarousel = () => {
  const [mottos, setMottos] = useState<Motto[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const fetchMottos = async () => {
    const { data, error } = await supabase
      .from("answers")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching mottos:", error);
      return;
    }

    const withNumbers: Motto[] =
      (data || []).map((row, index) => ({
        ...(row as Answer),
        number: index + 1,
      })) ?? [];

    setMottos(withNumbers);
  };

  useEffect(() => {
    fetchMottos();
  }, []);

  // Get dynamic font size based on text length
  const getFontSize = (text: string) => {
    const length = text.length;
    if (length > 200) return "text-lg md:text-xl lg:text-2xl";
    if (length > 150) return "text-xl md:text-2xl lg:text-3xl";
    if (length > 100) return "text-2xl md:text-3xl lg:text-4xl";
    if (length > 50) return "text-3xl md:text-4xl lg:text-5xl";
    return "text-4xl md:text-5xl lg:text-6xl";
  };

  // Estimate animation duration from total text length
  const animationDuration = useMemo(() => {
    if (mottos.length === 0) return 20;

    let totalLines = 0;
    mottos.forEach((m) => {
      const textLines = Math.ceil(m.motto_text.length / 40);
      totalLines += textLines + 2;
    });

    return Math.max(15, totalLines * 1.5);
  }, [mottos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (mottos.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-center">
        <p className="text-lg md:text-xl text-muted-foreground">
          No mottos yet. Be the first to share!
        </p>
      </div>
    );
  }

  const MottoItem = ({ m }: { m: Motto }) => (
    <div className="mb-16">
      <div
        className={`font-handwritten leading-tight ${getFontSize(
          m.motto_text
        )}`}
      >
        {m.motto_text}
      </div>
      <div className="mt-4 text-xs md:text-sm text-muted-foreground font-serious">
        #{m.number} • {m.nickname || "anonymous"} •{" "}
        {m.created_at
          ? format(new Date(m.created_at), "MMMM d")
          : ""}
        {m.timezone ? `, ${m.timezone}` : ""}
      </div>
    </div>
  );

  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Fade overlay at top and bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Scrollable content */}
      <div
        className={`h-full overflow-y-auto pr-4 ${
          isPaused ? "" : "animate-none"
        }`}
      >
        <div className="py-8">
          {mottos.map((m) => (
            <MottoItem key={m.id} m={m} />
          ))}
        </div>
      </div>

      {isPaused && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs md:text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-full border">
          paused - press space to resume
        </div>
      )}
    </div>
  );
};
