import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { HandHeart, LogOut } from "lucide-react";

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function Header({ currentSection, onSectionChange }: HeaderProps) {
  const { userProfile, logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "loans", label: "My Loans" },
    { id: "repayments", label: "Repayments" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <header className="bg-background shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <HandHeart className="text-primary text-2xl mr-3" />
            <h1 className="text-xl font-bold text-foreground">MicroLend</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`font-medium border-b-2 pb-1 transition-colors ${
                  currentSection === item.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {userProfile?.firstName} {userProfile?.lastName}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
