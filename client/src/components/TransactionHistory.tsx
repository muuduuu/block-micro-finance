import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { getLoanDetails, LOAN_CONTRACT_ADDRESS } from '@/lib/web3';
import { ExternalLink, RefreshCw, Loader2 } from 'lucide-react';

export function TransactionHistory() {
  const { isConnected, account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState<any>(null);

  const loadContractData = async () => {
    if (!isConnected || !account) return;
    
    setLoading(true);
    try {
      const details = await getLoanDetails(LOAN_CONTRACT_ADDRESS, account);
      setContractData(details);
    } catch (error) {
      console.error('Error loading contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      loadContractData();
    }
  }, [isConnected, account]);

  if (!isConnected) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Smart Contract Activity</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadContractData}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading contract data...</span>
          </div>        ) : contractData && contractData.loanAmount !== '0.0' ? (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Loan Contract</span>
                <Badge variant={contractData.isApproved ? "default" : "secondary"}>
                  {contractData.statusText}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Loan Amount:</span>
                  <div className="font-mono">{contractData.loanAmount} ETH</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Repaid:</span>
                  <div className="font-mono">{contractData.repaidAmount} ETH</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Contract:</span>
                <a
                  href={`https://etherscan.io/address/${LOAN_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                >
                  {LOAN_CONTRACT_ADDRESS}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Mock transaction history */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Transactions</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                  <span>Contract Approval</span>
                  <span className="font-mono">0x1a2b3c...</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                  <span>Loan Repayment</span>
                  <span className="font-mono">0x4d5e6f...</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No smart contract activity found</p>
            <p className="text-xs mt-1">Connect to a loan contract to see transaction history</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
