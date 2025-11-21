import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-card flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">LearnHub</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              variant={isActive("/courses") ? "default" : "ghost"}
              onClick={() => navigate("/courses")}
            >
              Courses
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
