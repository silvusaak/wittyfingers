import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Motto {
  id: string;
  number: number;
  nickname: string;
  motto_text: string;
  created_at: string;
  timezone: string | null;
}

export const MottoCarousel = () => {
  const [mottos, setMottos] = useState<Motto[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchMottos();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("mottos-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mottos",
        },
        (payload) => {
          const incoming = payload.new as Motto;
          setMottos((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMottos = async () => {
    const { data, error } = await supabase
      .from("mottos")
      .select("*")
      .order("number", { ascending: true });

    if (error) {
      console.error("Error fetching mottos:", error);
      return;
    }

    setMottos(data || []);
  };

  // Get dynamic font size based on text length
  const getFontSize = (text: string) => {
    const length = text.length;
    if (length > 200) return "text-lg md:text-xl lg:text-2xl";
    if (length > 150) return "text-xl md:text-2xl lg:text-3xl";
    if (length > 100) return "text-2xl md:text-3xl lg:text-4xl";
    if (length > 50) return "text-3xl md:text-4xl lg:text-5xl";
    return "text-4xl md:text-5xl lg:text-6xl";
  };

  // Calculate estimated lines per motto and total reading time
  // Roughly: 50 chars per line, 2 seconds per line + 2 seconds per motto for metadata
  const animationDuration = useMemo(() => {
    if (mottos.length === 0) return 30;
    
    let totalLines = 0;
    mottos.forEach((m) => {
      const textLines = Math.ceil(m.motto_text.length / 40); // ~40 chars per line on average
      totalLines += textLines + 2; // +2 for metadata and spacing
    });
    
    // 2 seconds per line, minimum 20 seconds
    return Math.max(20, totalLines * 2);
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
      <div className="flex items-center justify-center h-full text-muted-foreground text-2xl">
        No mottos yet. Be the first to share!
      </div>
    );
  }

  const MottoItem = ({ m, keyPrefix = "" }: { m: Motto; keyPrefix?: string }) => (
    <div
      key={`${keyPrefix}${m.id}`}
      className="text-center max-w-3xl mx-auto px-4 md:px-8 mb-20"
    >
      <p className={`${getFontSize(m.motto_text)} leading-relaxed break-words`}>
        {m.motto_text}
      </p>
      <div className="mt-4 text-base md:text-lg text-muted-foreground">
        #{m.number} • {m.nickname || "anonymous"} • [
        {m.created_at ? format(new Date(m.created_at), "MMMM d") : ""}
        {m.timezone ? `, ${m.timezone}` : ""}]
      </div>
    </div>
  );

  // Create a seamless loop by duplicating content
  const allItems = [...mottos, ...mottos];

  return (
    <div className="relative w-full h-[60vh] overflow-hidden star-wars-container">
      {/* Fade overlay at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)"
        }}
      />
      
      {/* The crawl container */}
      <div 
        className="absolute inset-0 flex justify-center overflow-hidden"
        style={{
          perspective: "400px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        <div
          className="w-full absolute bottom-0"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(25deg)",
            transformOrigin: "50% 100%",
          }}
        >
          <div
            className="will-change-transform pt-8"
            style={{
              animation: `crawl-stream ${animationDuration}s linear infinite`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {allItems.map((m, index) => (
              <MottoItem key={`${index < mottos.length ? "" : "dup-"}${m.id}`} m={m} keyPrefix={index < mottos.length ? "" : "dup-"} />
            ))}
          </div>
        </div>
      </div>

      {isPaused && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground z-20">
          Paused - Press Space to resume
        </div>
      )}
    </div>
  );
};
