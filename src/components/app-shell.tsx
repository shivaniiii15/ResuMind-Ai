import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  FileText,
  LayoutDashboard,
  Target,
  Sparkles,
  Layers,
  User,
  Shield,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  UploadCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppShellProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "AI Resume Analyzer", to: "/analyze", icon: FileText },
  { label: "Job Description Matcher", to: "/job-match", icon: Target },
  { label: "AI Cover Letter", to: "/cover-letter", icon: FileCheck },
  { label: "Resume Builder", to: "/builder", icon: Layers },
  { label: "Profile & History", to: "/profile", icon: User },
  { label: "Admin Console", to: "/admin", icon: Shield },
];

export function AppShell({ children }: AppShellProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-purple-600 shadow-md text-white">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent hidden sm:inline-block">
                ResuMind AI
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Upload CTA */}
            <Button
              size="sm"
              onClick={() => navigate({ to: "/analyze" })}
              className="hidden sm:flex bg-gradient-to-r from-primary to-purple-600 text-white shadow-sm hover:opacity-90 text-xs font-semibold gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Analyze Resume
            </Button>

            {/* Theme Toggle Button */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </Button>

            {/* User Avatar & Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none ring-2 ring-primary/20">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">AM</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Alex Morgan</p>
                    <p className="text-xs leading-none text-muted-foreground">alex.morgan@email.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                  <User className="mr-2 h-4 w-4" /> Profile & Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                  <Shield className="mr-2 h-4 w-4" /> Admin Console
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/auth" })} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Navigation Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-b border-border bg-card p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === item.to ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
