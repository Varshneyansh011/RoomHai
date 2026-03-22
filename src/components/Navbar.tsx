import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home as HomeIcon, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/cities", label: "Cities" },
  { to: "/become-provider", label: "Become a Provider" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 section-padding">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <HomeIcon className="h-6 w-6 text-accent" />
          <span className="text-foreground">ROOM</span>
          <span className="text-accent">HAI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-primary flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-b border-border animate-reveal-up">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-primary flex items-center gap-2">
                <Shield className="h-4 w-4" /> Admin Panel
              </Link>
            )}
            {user ? (
              <Button size="sm" variant="ghost" onClick={() => { signOut(); setOpen(false); }} className="mt-2">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => { navigate("/auth"); setOpen(false); }} className="mt-2">
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
