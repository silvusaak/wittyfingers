import { useState } from "react";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useNavigate } from "react-router-dom";

export const MenuButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-accent"
        onClick={() => navigate("/")}
        aria-label="Return to home"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] bg-card">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serious">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          <Button
            variant="ghost"
            className="text-xl font-serious justify-start h-auto py-4"
            onClick={() => handleNavigation("/mission")}
          >
            Mission
          </Button>
          <Button
            variant="ghost"
            className="text-xl font-serious justify-start h-auto py-4"
            onClick={() => handleNavigation("/submit")}
          >
            Submit
          </Button>
          <Button
            variant="ghost"
            className="text-xl font-serious justify-start h-auto py-4"
            onClick={() => handleNavigation("/contact")}
          >
            Contact & Disclaimer
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
    </div>
  );
};
