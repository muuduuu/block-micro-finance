import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LoanRequestModal } from "@/components/LoanRequestModal";
import { RepaymentModal } from "@/components/RepaymentModal";
import { DollarSign, TrendingUp, Percent, Plus, CreditCard, UserPen, Check, Handshake, FileText } from "lucide-react";

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

export function Dashboard({ onSectionChange }: DashboardProps) {
  const { userProfile } = useAuth();
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [repaymentModalOpen, setRepaymentModalOpen] = useState(false);

  // Mock data - in production, this would come from Firebase
  const activeLoan = {
    amount: 2500,
    remainingBalance: 825,
    progress: 67,
  };

  const nextPayment = {
    amount: 125,
    dueDate: "March 15, 2024",
  };

  const recentActivities = [
    {
      id: 1,
      type: "payment",
      description: "Payment received",
      amount: 125,
      date: "2 days ago",
      icon: Check,
      color: "text-secondary",
    },
    {
      id: 2,
      type: "approval",
      description: "Loan approved",
      amount: 2500,
      date: "1 week ago",
      icon: Handshake,
      color: "text-primary",
    },
    {
      id: 3,
      type: "application",
      description: "Application submitted",
      amount: null,
      date: "2 weeks ago",
      icon: FileText,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {userProfile?.firstName || "User"}!
          </h2>
          <p className="text-blue-100">Manage your loans and grow your business</p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Loan</p>
                <p className="text-2xl font-bold text-foreground">${activeLoan.amount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Next Payment</p>
                <p className="text-2xl font-bold text-foreground">${nextPayment.amount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold text-foreground">{activeLoan.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => setLoanModalOpen(true)}
            >
              <Plus className="h-5 w-5 text-primary mr-3" />
              <div className="text-left">
                <p className="font-medium">Request Loan</p>
                <p className="text-sm text-muted-foreground">Apply for new funding</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => setRepaymentModalOpen(true)}
            >
              <CreditCard className="h-5 w-5 text-secondary mr-3" />
              <div className="text-left">
                <p className="font-medium">Make Payment</p>
                <p className="text-sm text-muted-foreground">Pay your installment</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-start p-4 h-auto"
              onClick={() => onSectionChange("profile")}
            >
              <UserPen className="h-5 w-5 text-accent mr-3" />
              <div className="text-left">
                <p className="font-medium">Update Profile</p>
                <p className="text-sm text-muted-foreground">Edit your information</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 bg-muted rounded-full flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {activity.amount ? `$${activity.amount}` : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <LoanRequestModal open={loanModalOpen} onClose={() => setLoanModalOpen(false)} />
      <RepaymentModal open={repaymentModalOpen} onClose={() => setRepaymentModalOpen(false)} />
    </div>
  );
}
