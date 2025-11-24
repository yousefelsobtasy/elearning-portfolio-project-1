import { NavLink } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Moon, Sun, LogOut, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const { user, signOut, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-xl font-bold">
            Chemistry Hub
          </NavLink>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <NavLink
                  to="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="text-foreground"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/courses"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="text-foreground"
                >
                  Courses
                </NavLink>
                <NavLink
                  to="/community"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="text-foreground"
                >
                  Community
                </NavLink>
                <NavLink
                  to="/news"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="text-foreground"
                >
                  News
                </NavLink>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="gap-2"
                  >
                    <Shield size={16} />
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                <Button onClick={() => navigate('/auth')}>Sign In</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
