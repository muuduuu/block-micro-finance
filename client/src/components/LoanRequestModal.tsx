import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X } from "lucide-react";

interface LoanRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoanRequestModal({ open, onClose }: LoanRequestModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const loanData = {
      userId: user.uid,
      amount: parseFloat(formData.get("amount") as string),
      purpose: formData.get("purpose") as string,
      description: formData.get("description") as string,
      status: "pending",
      interestRate: 12.0,
      termMonths: 24,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "loans"), loanData);
      
      toast({
        title: "Loan request submitted!",
        description: "Your loan application has been submitted for review.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedPayment = (loanAmount: number) => {
    const monthlyRate = 0.12 / 12; // 12% APR
    const numPayments = 24;
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1);
    return payment;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Request New Loan
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Select name="purpose" required>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventory">Inventory Purchase</SelectItem>
                <SelectItem value="equipment">Equipment Purchase</SelectItem>
                <SelectItem value="expansion">Business Expansion</SelectItem>
                <SelectItem value="working_capital">Working Capital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Briefly describe how you'll use this loan..."
            />
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Estimated Terms</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Interest Rate:</span>
                <span>12% APR</span>
              </div>
              <div className="flex justify-between">
                <span>Term:</span>
                <span>24 months</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Payment:</span>
                <span>${amount ? calculateEstimatedPayment(parseFloat(amount)).toFixed(2) : "0"}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
