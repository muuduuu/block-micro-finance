import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AdminProvider, useAdmin } from "@/hooks/useAdmin";
import { Web3Provider } from "@/hooks/useWeb3";
import { AuthModal } from "@/components/AuthModal";
import { Header } from "@/components/Header";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Dashboard } from "@/pages/Dashboard";
import { Loans } from "@/pages/Loans";
import { Repayments } from "@/pages/Repayments";
import { Profile } from "@/pages/Profile";
import { Admin } from "@/pages/Admin";

function AppContent() {
  const { user, loading } = useAuth();
  const { isAdmin } = useAdmin();
  
  // Set default section based on user type
  const defaultSection = isAdmin ? "admin" : "dashboard";
  const [currentSection, setCurrentSection] = useState(defaultSection);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Update section when admin status changes
  useEffect(() => {
    if (isAdmin && currentSection === "dashboard") {
      setCurrentSection("admin");
    }
  }, [isAdmin, currentSection]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal open={true} onClose={() => {}} />;
  }  const renderSection = () => {
    // If user is admin, redirect to admin dashboard by default
    if (isAdmin && (currentSection === "dashboard" || currentSection === "loans" || currentSection === "repayments")) {
      return <Admin />;
    }

    switch (currentSection) {
      case "dashboard":
        return <Dashboard onSectionChange={setCurrentSection} />;
      case "loans":
        return <Loans />;
      case "repayments":
        return <Repayments />;
      case "profile":
        return <Profile />;
      case "admin":
        return isAdmin ? <Admin /> : <Dashboard onSectionChange={setCurrentSection} />;
      default:
        // Default view based on user type
        return isAdmin ? <Admin /> : <Dashboard onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
        {renderSection()}
      </main>

      <MobileNavigation currentSection={currentSection} onSectionChange={setCurrentSection} />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AdminProvider>
            <Web3Provider>
              <Toaster />
              <AppContent />
            </Web3Provider>
          </AdminProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
