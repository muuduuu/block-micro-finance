import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';
import {
  getLoanDetails,
  approveLoan,
  repayLoan,
  requestLoan,
  getLoanStatus,
  LOAN_CONTRACT_ADDRESS
} from '@/lib/web3';
import { Loader2, ExternalLink, DollarSign, Check, AlertCircle } from 'lucide-react';

interface LoanContractProps {
  contractAddress?: string;
  loanId?: string;
}

export function LoanContract({ contractAddress = LOAN_CONTRACT_ADDRESS, loanId }: LoanContractProps) {
  const { isConnected, account } = useWeb3();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [loanDetails, setLoanDetails] = useState<any>(null);  const [loanAmount, setLoanAmount] = useState('');
  const [repaymentPercent, setRepaymentPercent] = useState('12');
  const [income, setIncome] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadLoanDetails = async () => {
    if (!contractAddress || !account) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const details = await getLoanDetails(contractAddress, account);
      setLoanDetails(details);
    } catch (err: any) {
      setError(err.message || 'Failed to load loan details');
      console.error('Error loading loan details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLoan = async () => {
    if (!isConnected || !contractAddress || !loanAmount || !repaymentPercent) return;
    
    setActionLoading('request');
    try {
      const txHash = await requestLoan(contractAddress, parseFloat(loanAmount), parseInt(repaymentPercent));
      toast({
        title: 'Loan Requested!',
        description: `Transaction: ${txHash}`,
      });
      setLoanAmount('');
      await loadLoanDetails(); // Refresh details
    } catch (err: any) {
      toast({
        title: 'Request Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveLoan = async () => {
    if (!isConnected || !contractAddress || !account) return;
    
    setActionLoading('approve');
    try {
      const txHash = await approveLoan(contractAddress, account);
      toast({
        title: 'Loan Approved!',
        description: `Transaction: ${txHash}`,
      });
      await loadLoanDetails(); // Refresh details
    } catch (err: any) {
      toast({
        title: 'Approval Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRepayLoan = async () => {
    if (!isConnected || !contractAddress || !income) return;
    
    setActionLoading('repay');
    try {
      const txHash = await repayLoan(contractAddress, parseFloat(income));
      toast({
        title: 'Repayment Processed!',
        description: `Transaction: ${txHash}`,
      });
      setIncome('');
      await loadLoanDetails(); // Refresh details
    } catch (err: any) {
      toast({
        title: 'Repayment Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };
  useEffect(() => {
    if (isConnected && contractAddress && account) {
      loadLoanDetails();
    }
  }, [isConnected, contractAddress, account]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Smart Contract Interaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to interact with the smart contract.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Smart Contract Interaction
            {loanId && <Badge variant="outline">Loan #{loanId}</Badge>}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadLoanDetails}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Contract Address:</span>
            <a
              href={`https://etherscan.io/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              {contractAddress}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading contract details...</span>
          </div>        ) : loanDetails && loanDetails.loanAmount !== '0.0' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Loan Amount</Label>
                <div className="text-lg font-bold">{loanDetails.loanAmount} ETH</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Repayment %</Label>
                <div className="text-lg font-bold">{loanDetails.repaymentPercent}%</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Repaid Amount</Label>
                <div className="text-lg font-bold">{loanDetails.repaidAmount} ETH</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Status</Label>
                <Badge variant={loanDetails.isApproved ? "default" : "secondary"}>
                  {loanDetails.statusText}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {!loanDetails.isApproved && (
                <Button
                  onClick={handleApproveLoan}
                  disabled={actionLoading === 'approve'}
                  className="w-full"
                >
                  {actionLoading === 'approve' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    'Approve Loan (Owner Only)'
                  )}
                </Button>
              )}

              {loanDetails.isApproved && !loanDetails.isCompleted && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income (ETH)</Label>
                    <Input
                      id="income"
                      type="number"
                      step="0.001"
                      placeholder="0.0"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">
                      Repayment will be calculated as {loanDetails.repaymentPercent}% of your income
                    </div>
                  </div>
                  <Button
                    onClick={handleRepayLoan}
                    disabled={!income || actionLoading === 'repay'}
                    className="w-full"
                  >
                    {actionLoading === 'repay' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Make Repayment'
                    )}
                  </Button>
                </div>
              )}

              {loanDetails.isCompleted && (
                <div className="text-center py-4">
                  <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    Loan Completed
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <h3 className="text-lg font-medium mb-2">No Loan Found</h3>
              <p className="text-sm text-muted-foreground mb-4">Request a new loan to get started</p>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (ETH)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repaymentPercent">Repayment Percentage (%)</Label>
                <Input
                  id="repaymentPercent"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="12"
                  value={repaymentPercent}
                  onChange={(e) => setRepaymentPercent(e.target.value)}
                />
                <div className="text-xs text-muted-foreground">
                  Percentage of monthly income to be deducted for loan repayment
                </div>
              </div>
              <Button
                onClick={handleRequestLoan}
                disabled={!loanAmount || !repaymentPercent || actionLoading === 'request'}
                className="w-full"
              >
                {actionLoading === 'request' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  'Request Loan'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
