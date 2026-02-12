import { useEffect, useState } from "react";
import { MottoCarousel } from "@/components/MottoCarousel";
import { MenuButton } from "@/components/MenuButton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import wtfLogo from "@/assets/wtf-logo.png";

type SubmissionRow = {
  id: number;
  nickname: string | null;
  motto_text: string;
  created_at: string;
  timezone: string | null;
};

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchNum, setSearchNum] = useState("");
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [currentRow, setCurrentRow] = useState<SubmissionRow | null>(null);
  const [currentNum, setCurrentNum] = useState<number | null>(null);
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Want to share your thoughts?",
        description: (
          <span>
            Submit{" "}
            <button
              onClick={() => navigate("/submit")}
              className="underline font-bold hover:opacity-80"
            >
              here
            </button>
            !
          </span>
        ),
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  const fetchCount = async () => {
    const { count, error } = await supabase
      .from("answers")
      .select("*", { count: "exact", head: true });
    if (error) return null;
    return count;
  };

  const fetchSubmissionByNumber = async (n: number) => {
    setLoading(true);
    setSearchError("");
    const count = await fetchCount();
    if (count !== null) setTotalCount(count);
    if (!count || n < 1 || n > count) {
      setSearchError(count ? `Enter a number between 1 and ${count}` : "No submissions yet.");
      setCurrentRow(null);
      setCurrentNum(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("answers")
      .select("*")
      .order("created_at", { ascending: true })
      .range(n - 1, n - 1)
      .single();
    setLoading(false);
    if (error || !data) {
      setSearchError("Could not load that submission.");
      setCurrentRow(null);
      setCurrentNum(null);
      return;
    }
    setCurrentRow(data as SubmissionRow);
    setCurrentNum(n);
  };

  const handleSearchGo = () => {
    const n = parseInt(searchNum, 10);
    if (Number.isNaN(n) || n < 1) {
      setSearchError("Enter a valid number (1 or higher).");
      return;
    }
    fetchSubmissionByNumber(n);
  };

  const handlePrev = () => {
    if (currentNum !== null && currentNum > 1) {
      const n = currentNum - 1;
      setSearchNum(String(n));
      fetchSubmissionByNumber(n);
    }
  };

  const handleNext = () => {
    if (totalCount !== null && currentNum !== null && currentNum < totalCount) {
      const n = currentNum + 1;
      setSearchNum(String(n));
      fetchSubmissionByNumber(n);
    }
  };

  useEffect(() => {
    if (searchOpen && totalCount === null) {
      fetchCount().then((c) => setTotalCount(c ?? 0));
    }
  }, [searchOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
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

      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="Search by submission number"
            >
              <Search className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>View submission by number</DialogTitle>
            </DialogHeader>
            {totalCount !== null && (
              <p className="text-sm text-muted-foreground">
                There are {totalCount} submission{totalCount !== 1 ? "s" : ""}. Enter a number to view it.
              </p>
            )}
            <div className="flex gap-2 py-2">
              <Input
                type="number"
                min={1}
                placeholder="e.g. 42"
                value={searchNum}
                onChange={(e) => setSearchNum(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchGo()}
              />
              <Button onClick={handleSearchGo} disabled={loading}>
                {loading ? "Loading..." : "Go"}
              </Button>
            </div>
            {searchError && (
              <p className="text-sm text-destructive">{searchError}</p>
            )}
            {currentRow && currentNum !== null && (
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-xs text-muted-foreground font-serious">
                  #{currentNum} • {currentRow.nickname || "anonymous"} •{" "}
                  {currentRow.created_at
                    ? format(new Date(currentRow.created_at), "MMMM d, yyyy")
                    : ""}
                  {currentRow.timezone ? ` • ${currentRow.timezone}` : ""}
                </p>
                <p className="font-handwritten text-lg whitespace-pre-wrap">
                  {currentRow.motto_text}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentNum <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={totalCount === null || currentNum >= totalCount}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <MenuButton />
      </div>

      <header className="pt-32 md:pt-40 pb-6 px-4 text-center">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-serious font-bold">
          What having ADHD feels like today...
        </h1>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <MottoCarousel />
      </main>

      <footer className="py-2 px-4 text-center shrink-0 mb-16">
        <p className="text-[10px] font-serious text-green-600">
          If you or anyone close to you struggles with mental health, don't be ashamed to contact your local helpline for support.
        </p>
      </footer>
    </div>
  );
};

export default Home;
