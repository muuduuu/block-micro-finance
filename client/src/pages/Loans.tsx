import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LoanRequestModal } from "@/components/LoanRequestModal";
import { WalletConnection } from "@/components/WalletConnection";
import { LoanContract } from "@/components/LoanContract";
import { Plus, Link } from "lucide-react";

export function Loans() {
  const [loanModalOpen, setLoanModalOpen] = useState(false);  // Mock data - in production, this would come from Firebase
  const activeLoan = {
    id: "ML2024001",
    title: "Business Expansion Loan",
    amount: 2500,
    monthlyPayment: 125,
    remainingBalance: 825,
    progress: 67,
    status: "active",
    smartContractAddress: "0x4569c1460f5954353e0d28d8af6fedef283c0533",
  };

  const loanHistory = [
    {
      id: "ML2023015",
      title: "Equipment Purchase Loan",
      amount: 1200,
      status: "completed",
    },
    {
      id: "ML2023008",
      title: "Working Capital Loan",
      amount: 800,
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My Loans</h2>
        <Button onClick={() => setLoanModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Request Loan
        </Button>
      </div>

      {/* Active Loan */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{activeLoan.title}</CardTitle>
              <p className="text-sm text-muted-foreground">Loan ID: #{activeLoan.id}</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="text-xl font-bold text-foreground">${activeLoan.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Payment</p>
              <p className="text-xl font-bold text-foreground">${activeLoan.monthlyPayment}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining Balance</p>
              <p className="text-xl font-bold text-foreground">${activeLoan.remainingBalance}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{activeLoan.progress}%</span>
            </div>
            <Progress value={activeLoan.progress} className="h-2" />
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Link className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-foreground">Smart Contract</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono mb-1">
              {activeLoan.smartContractAddress}
            </p>
            <p className="text-xs text-muted-foreground">Automated payments enabled</p>
          </div>
        </CardContent>
      </Card>

      {/* Loan History */}
      <Card>        <CardHeader>
          <CardTitle>Loan History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loanHistory.map((loan) => (
              <div key={loan.id} className="flex justify-between items-center p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{loan.title}</p>
                  <p className="text-sm text-muted-foreground">Completed • #{loan.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${loan.amount.toLocaleString()}</p>
                  <Badge variant="secondary" className="text-xs">Paid Off</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Web3 Integration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WalletConnection />
        <LoanContract 
          contractAddress={activeLoan.smartContractAddress} 
          loanId={activeLoan.id}
        />
      </div>

      <LoanRequestModal open={loanModalOpen} onClose={() => setLoanModalOpen(false)} />
    </div>
  );
}
