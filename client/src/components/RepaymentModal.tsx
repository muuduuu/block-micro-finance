import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X, Shield } from "lucide-react";

interface RepaymentModalProps {
  open: boolean;
  onClose: () => void;
  loanBalance?: number;
  nextPaymentAmount?: number;
}

export function RepaymentModal({ 
  open, 
  onClose, 
  loanBalance = 825, 
  nextPaymentAmount = 125 
}: RepaymentModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("crypto");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const repaymentData = {
      userId: user.uid,
      loanId: "demo-loan-id", // In production, this would be passed as prop
      amount: parseFloat(formData.get("amount") as string),
      paymentMethod,
      status: "completed",
      createdAt: new Date(),
      paidDate: new Date(),
      transactionHash: paymentMethod === "crypto" ? `0x${Math.random().toString(16).substr(2, 40)}` : null,
    };

    try {
      await addDoc(collection(db, "repayments"), repaymentData);
      
      toast({
        title: "Payment processed!",
        description: `Your payment of $${repaymentData.amount} has been processed successfully.`,
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Make Payment
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Current Loan Balance</span>
            <span className="text-lg font-bold text-foreground">${loanBalance}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Next Payment Due</span>
            <span className="text-sm font-medium text-foreground">${nextPaymentAmount} (March 15)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
              <Input
                id="amount"
                name="amount"
                type="number"
                defaultValue={nextPaymentAmount}
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="crypto" id="crypto" />
                <Label htmlFor="crypto">Ethereum Smart Contract</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Shield className="text-primary h-4 w-4 mr-2" />
              <span className="text-sm font-medium text-foreground">Secure Smart Contract Payment</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Payment will be processed automatically through our secure Ethereum smart contract
            </p>
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-secondary hover:bg-secondary/90">
              <Shield className="h-4 w-4 mr-2" />
              {loading ? "Processing..." : "Process Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
