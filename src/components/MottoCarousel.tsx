import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Motto {
  id: string;
  number: number;
  nickname: string;
  motto_text: string;
  created_at: string;
}

export const MottoCarousel = () => {
  const [mottos, setMottos] = useState<Motto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (mottos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mottos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [mottos.length]);

  if (mottos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-2xl">
        No mottos yet. Be the first to share!
      </div>
    );
  }

  const currentMotto = mottos[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden perspective-1000">
      <div
        key={currentMotto.id}
        className="absolute inset-0 flex flex-col items-center justify-center animate-scroll-up"
        style={{
          transformOrigin: 'center bottom',
          transform: 'rotateX(25deg)',
        }}
      >
        <div className="text-center max-w-3xl px-8 space-y-6">
          <p className="text-4xl md:text-5xl lg:text-6xl leading-relaxed">
            {currentMotto.motto_text}
          </p>
          <div className="flex items-center justify-center gap-4 text-xl md:text-2xl text-muted-foreground">
            <span>#{currentMotto.number}</span>
            <span>•</span>
            <span>{currentMotto.nickname || 'anonymous'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
