import { Home, CreditCard, DollarSign, User } from "lucide-react";

interface MobileNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function MobileNavigation({ currentSection, onSectionChange }: MobileNavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "loans", label: "Loans", icon: DollarSign },
    { id: "repayments", label: "Payments", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                currentSection === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
