import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RepaymentModal } from "@/components/RepaymentModal";
import { CreditCard } from "lucide-react";

export function Repayments() {
  const [repaymentModalOpen, setRepaymentModalOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");

  // Mock data - in production, this would come from Firebase
  const nextPayment = {
    amount: 125,
    dueDate: "March 15, 2024",
    daysUntilDue: 5,
  };

  const upcomingPayments = [
    { date: "March 15, 2024", amount: 125 },
    { date: "April 15, 2024", amount: 125 },
    { date: "May 15, 2024", amount: 125 },
  ];

  const paymentHistory = [
    {
      id: "ML2024001-15",
      date: "February 15, 2024",
      amount: 125,
      method: "Smart Contract",
      status: "Completed",
    },
    {
      id: "ML2024001-14",
      date: "January 15, 2024",
      amount: 125,
      method: "Smart Contract",
      status: "Completed",
    },
    {
      id: "ML2024001-13",
      date: "December 15, 2023",
      amount: 125,
      method: "Smart Contract",
      status: "Completed",
    },
  ];

  const calculatePayment = (income: number) => {
    return Math.round(income * 0.05); // 5% of income
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Repayments</h2>
        <Button onClick={() => setRepaymentModalOpen(true)} className="bg-secondary hover:bg-secondary/90">
          <CreditCard className="h-4 w-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Next Payment Due */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-foreground">Next Payment Due</p>
                <p className="text-sm text-muted-foreground">Due in {nextPayment.daysUntilDue} days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-accent">${nextPayment.amount}</p>
                <p className="text-sm text-muted-foreground">{nextPayment.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Payment Calculator */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Payment Calculator</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="Enter monthly income"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment (5% of income)</Label>
                <div className="px-3 py-2 bg-muted border border-border rounded-md text-foreground font-medium">
                  ${monthlyIncome ? calculatePayment(parseFloat(monthlyIncome)) : 0}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Upcoming Payments</h4>
            <div className="space-y-2">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                  <span className="text-sm text-muted-foreground">{payment.date}</span>
                  <span className="text-sm font-medium text-foreground">${payment.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-foreground">Payment #{payment.id}</p>
                  <p className="text-xs text-muted-foreground">{payment.date} • Via {payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary">${payment.amount}</p>
                  <span className="text-xs text-secondary">{payment.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RepaymentModal open={repaymentModalOpen} onClose={() => setRepaymentModalOpen(false)} />
    </div>
  );
}
