import { ethers } from 'ethers';
import { getLoanContract, getLoanContractReadOnly, LOAN_CONTRACT_ADDRESS } from '@/lib/web3';

export interface BlockchainLoanDetails {
  borrowerAddress: string;
  loanAmount: string;
  repaidAmount: string;
  repaymentPercent: string;
  isApproved: boolean;
  isCompleted: boolean;
  statusText: string;
}

export interface LoanRequest {
  borrowerAddress: string;
  loanAmount: string;
  repaymentPercent: string;
  timestamp: Date;
  transactionHash: string;
}

export class LoanBlockchainService {
  private static instance: LoanBlockchainService;

  static getInstance(): LoanBlockchainService {
    if (!LoanBlockchainService.instance) {
      LoanBlockchainService.instance = new LoanBlockchainService();
    }
    return LoanBlockchainService.instance;
  }

  // Get all loan requests from blockchain events
  async getAllLoanRequests(): Promise<LoanRequest[]> {
    try {
      const contract = await getLoanContractReadOnly(LOAN_CONTRACT_ADDRESS);
      
      // Get all LoanRequested events
      const filter = contract.filters.LoanRequested();
      const events = await contract.queryFilter(filter);
      
      const requests: LoanRequest[] = [];
        for (const event of events) {
        if (event instanceof ethers.EventLog) {
          const block = await event.getBlock();
          requests.push({
            borrowerAddress: event.args?.borrower || '',
            loanAmount: ethers.formatEther(event.args?.amount || 0),
            repaymentPercent: event.args?.repaymentPercent?.toString() || '0',
            timestamp: new Date(block.timestamp * 1000),
            transactionHash: event.transactionHash,
          });
        }
      }
      
      return requests.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Error fetching loan requests:', error);
      return [];
    }
  }

  // Get pending loan requests (not yet approved)
  async getPendingLoanRequests(): Promise<LoanRequest[]> {
    try {
      const allRequests = await this.getAllLoanRequests();
      const pendingRequests: LoanRequest[] = [];
      
      for (const request of allRequests) {
        const details = await this.getLoanDetails(request.borrowerAddress);
        if (!details.isApproved && !details.isCompleted && parseFloat(details.loanAmount) > 0) {
          pendingRequests.push(request);
        }
      }
      
      return pendingRequests;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  }

  // Get loan details for a specific borrower
  async getLoanDetails(borrowerAddress: string): Promise<BlockchainLoanDetails> {
    try {
      const contract = await getLoanContractReadOnly(LOAN_CONTRACT_ADDRESS);
      
      const [loanAmount, repaidAmount, repaymentPercent, isApproved, isCompleted] = 
        await contract.loans(borrowerAddress);
      const statusText = await contract.checkLoanStatus(borrowerAddress);

      return {
        borrowerAddress,
        loanAmount: ethers.formatEther(loanAmount),
        repaidAmount: ethers.formatEther(repaidAmount),
        repaymentPercent: repaymentPercent.toString(),
        isApproved,
        isCompleted,
        statusText
      };
    } catch (error) {
      console.error('Error fetching loan details:', error);
      throw error;
    }
  }

  // Approve a loan (admin function)
  async approveLoan(borrowerAddress: string): Promise<string> {
    try {
      const contract = getLoanContract(LOAN_CONTRACT_ADDRESS);
      const tx = await contract.approveLoan(borrowerAddress);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error approving loan:', error);
      throw error;
    }
  }

  // Get all approved loans
  async getApprovedLoans(): Promise<BlockchainLoanDetails[]> {
    try {
      const allRequests = await this.getAllLoanRequests();
      const approvedLoans: BlockchainLoanDetails[] = [];
      
      for (const request of allRequests) {
        const details = await this.getLoanDetails(request.borrowerAddress);
        if (details.isApproved) {
          approvedLoans.push(details);
        }
      }
      
      return approvedLoans;
    } catch (error) {
      console.error('Error fetching approved loans:', error);
      return [];
    }
  }

  // Get loan statistics
  async getLoanStatistics() {
    try {
      const allRequests = await this.getAllLoanRequests();
      const allLoans: BlockchainLoanDetails[] = [];
      
      for (const request of allRequests) {
        const details = await this.getLoanDetails(request.borrowerAddress);
        if (parseFloat(details.loanAmount) > 0) {
          allLoans.push(details);
        }
      }

      const totalRequests = allLoans.length;
      const pendingLoans = allLoans.filter(loan => !loan.isApproved && !loan.isCompleted).length;
      const approvedLoans = allLoans.filter(loan => loan.isApproved && !loan.isCompleted).length;
      const completedLoans = allLoans.filter(loan => loan.isCompleted).length;
      
      const totalLoanAmount = allLoans.reduce((sum, loan) => 
        sum + parseFloat(loan.loanAmount), 0);
      const totalRepaidAmount = allLoans.reduce((sum, loan) => 
        sum + parseFloat(loan.repaidAmount), 0);

      return {
        totalRequests,
        pendingLoans,
        approvedLoans,
        completedLoans,
        totalLoanAmount,
        totalRepaidAmount,
        repaymentRate: totalLoanAmount > 0 ? (totalRepaidAmount / totalLoanAmount) * 100 : 0,
      };
    } catch (error) {
      console.error('Error calculating loan statistics:', error);
      return {
        totalRequests: 0,
        pendingLoans: 0,
        approvedLoans: 0,
        completedLoans: 0,
        totalLoanAmount: 0,
        totalRepaidAmount: 0,
        repaymentRate: 0,
      };
    }
  }

  // Check if connected wallet is contract owner
  async isContractOwner(): Promise<boolean> {
    try {
      const contract = await getLoanContractReadOnly(LOAN_CONTRACT_ADDRESS);
      const owner = await contract.owner();
      
      // This would need to be compared with the current connected wallet
      // Implementation depends on your wallet connection setup
      return false; // Placeholder
    } catch (error) {
      console.error('Error checking contract owner:', error);
      return false;
    }
  }
}

export const loanBlockchainService = LoanBlockchainService.getInstance();
