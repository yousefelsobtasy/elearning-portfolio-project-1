import { useState } from "react";
import { NavLink } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Moon, Sun, LogOut, Shield, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const { user, signOut, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = user ? (
    <>
      <NavLink
        to="/"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        activeClassName="text-foreground"
        onClick={() => setIsMenuOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/courses"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        activeClassName="text-foreground"
        onClick={() => setIsMenuOpen(false)}
      >
        Courses
      </NavLink>
      <NavLink
        to="/community"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        activeClassName="text-foreground"
        onClick={() => setIsMenuOpen(false)}
      >
        Community
      </NavLink>
      <NavLink
        to="/news"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        activeClassName="text-foreground"
        onClick={() => setIsMenuOpen(false)}
      >
        News
      </NavLink>
      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigate('/admin');
            setIsMenuOpen(false);
          }}
          className="gap-2 justify-start w-full"
        >
          <Shield size={16} />
          Admin
        </Button>
      )}
    </>
  ) : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-xl font-bold">
            Chemistry Hub
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {navLinks}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="gap-2"
                >
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
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                <Button onClick={() => navigate('/auth')}>Sign In</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="mr-2"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t mt-2 pt-4">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  {navLinks}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Signed in as {user.email}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}