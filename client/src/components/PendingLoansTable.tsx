import { useState } from 'react';
import { LoanRequest } from '@/lib/loanBlockchainService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatAddress } from '@/lib/web3';
import { ExternalLink, Check, X } from 'lucide-react';

interface PendingLoansTableProps {
  loans: LoanRequest[];
  onApproveLoan: (borrowerAddress: string) => Promise<void>;
  canApprove: boolean;
}

export function PendingLoansTable({ loans, onApproveLoan, canApprove }: PendingLoansTableProps) {
  const [approvingLoans, setApprovingLoans] = useState<Set<string>>(new Set());

  const handleApprove = async (borrowerAddress: string) => {
    setApprovingLoans(prev => new Set(prev).add(borrowerAddress));
    try {
      await onApproveLoan(borrowerAddress);
    } finally {
      setApprovingLoans(prev => {
        const newSet = new Set(prev);
        newSet.delete(borrowerAddress);
        return newSet;
      });
    }
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pending loan requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Borrower</TableHead>
            <TableHead>Loan Amount (ETH)</TableHead>
            <TableHead>Repayment %</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.borrowerAddress}>
              <TableCell>
                <div className="font-mono text-sm">
                  {formatAddress(loan.borrowerAddress)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {parseFloat(loan.loanAmount).toFixed(4)} ETH
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {loan.repaymentPercent}%
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {loan.timestamp.toLocaleDateString()}
                  <div className="text-xs text-muted-foreground">
                    {loan.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => {
                    window.open(`https://etherscan.io/tx/${loan.transactionHash}`, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {canApprove && (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(loan.borrowerAddress)}
                      disabled={approvingLoans.has(loan.borrowerAddress)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      {approvingLoans.has(loan.borrowerAddress) ? 'Approving...' : 'Approve'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // TODO: Implement reject functionality
                      console.log('Reject loan:', loan.borrowerAddress);
                    }}
                  >
                    <X className="h-3 w-3" />
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
