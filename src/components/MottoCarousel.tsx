import { useEffect, useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchMottos();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('mottos-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mottos'
        },
        () => fetchMottos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMottos = async () => {
    const { data, error } = await supabase
      .from('mottos')
      .select('*')
      .order('number', { ascending: false });

    if (error) {
      console.error('Error fetching mottos:', error);
      return;
    }

    setMottos(data || []);
  };

  // Get dynamic font size based on text length
  const getFontSize = (text: string) => {
    const length = text.length;
    if (length > 200) return 'text-lg md:text-xl lg:text-2xl';
    if (length > 150) return 'text-xl md:text-2xl lg:text-3xl';
    if (length > 100) return 'text-2xl md:text-3xl lg:text-4xl';
    if (length > 50) return 'text-3xl md:text-4xl lg:text-5xl';
    return 'text-4xl md:text-5xl lg:text-6xl';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (mottos.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mottos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [mottos.length, isPaused]);

  if (mottos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-2xl">
        No mottos yet. Be the first to share!
      </div>
    );
  }

  const currentMotto = mottos[currentIndex];

  return (
    <div 
      className="relative w-full h-full min-h-[300px] overflow-hidden"
      style={{ perspective: '300px' }}
    >
      <div
        key={currentMotto.id}
        className={`absolute inset-0 flex items-center justify-center ${isPaused ? '' : 'animate-crawl'}`}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 100%',
          transform: isPaused ? 'rotateX(25deg)' : undefined,
        }}
      >
        <div className="text-center max-w-4xl px-4 md:px-8 space-y-4">
          <p className={`${getFontSize(currentMotto.motto_text)} leading-relaxed break-words`}>
            {currentMotto.motto_text}
          </p>
          <div className="text-base md:text-lg lg:text-xl text-muted-foreground">
            #{currentMotto.number} • {currentMotto.nickname || 'anonymous'} • [{currentMotto.created_at 
              ? format(new Date(currentMotto.created_at), "MMMM d")
              : ''}{currentMotto.timezone ? `, ${currentMotto.timezone}` : ''}]
          </div>
        </div>
      </div>
      {isPaused && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
          Paused - Press Space to resume
        </div>
      )}
    </div>
  );
};
