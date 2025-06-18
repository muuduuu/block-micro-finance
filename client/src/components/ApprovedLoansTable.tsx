import { BlockchainLoanDetails } from '@/lib/loanBlockchainService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatAddress } from '@/lib/web3';

interface ApprovedLoansTableProps {
  loans: BlockchainLoanDetails[];
}

export function ApprovedLoansTable({ loans }: ApprovedLoansTableProps) {
  if (loans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No active loans</p>
      </div>
    );
  }

  const getStatusBadge = (loan: BlockchainLoanDetails) => {
    if (loan.isCompleted) {
      return <Badge className="bg-green-500">Completed</Badge>;
    }
    if (loan.isApproved) {
      return <Badge className="bg-blue-500">Active</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getRepaymentProgress = (loan: BlockchainLoanDetails) => {
    const loanAmount = parseFloat(loan.loanAmount);
    const repaidAmount = parseFloat(loan.repaidAmount);
    
    if (loanAmount === 0) return 0;
    return Math.min((repaidAmount / loanAmount) * 100, 100);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Borrower</TableHead>
            <TableHead>Loan Amount (ETH)</TableHead>
            <TableHead>Repaid Amount (ETH)</TableHead>
            <TableHead>Repayment %</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
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
                <Badge variant="outline" className="font-mono">
                  {parseFloat(loan.repaidAmount).toFixed(4)} ETH
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {loan.repaymentPercent}%
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Progress 
                    value={getRepaymentProgress(loan)} 
                    className="w-24" 
                  />
                  <div className="text-xs text-muted-foreground">
                    {getRepaymentProgress(loan).toFixed(1)}%
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(loan)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
