import { ethers } from 'ethers';

// Smart contract ABI for the updated Loan contract
export const LOAN_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" }
    ],
    "name": "LoanApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" }
    ],
    "name": "LoanCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "repaid", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalRepaid", "type": "uint256" }
    ],
    "name": "LoanRepaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "repaymentPercent", "type": "uint256" }
    ],
    "name": "LoanRequested",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_borrower", "type": "address" }],
    "name": "approveLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_borrower", "type": "address" }],
    "name": "checkLoanStatus",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "loans",
    "outputs": [
      { "internalType": "uint256", "name": "loanAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "repaidAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "repaymentPercent", "type": "uint256" },
      { "internalType": "bool", "name": "isApproved", "type": "bool" },
      { "internalType": "bool", "name": "isCompleted", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "income", "type": "uint256" }],
    "name": "repayLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_loanAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "_repaymentPercent", "type": "uint256" }
    ],
    "name": "requestLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Factory contract ABI for deploying new loan contracts
export const LOAN_FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_borrower", "type": "address" },
      { "internalType": "uint256", "name": "_loanAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "_repaymentPercent", "type": "uint256" }
    ],
    "name": "createLoanContract",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract addresses
export const LOAN_CONTRACT_ADDRESS = "0x4569c1460f5954353e0d28d8af6fedef283c0533";

// Web3 Provider Setup
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;

export const initializeWeb3 = async (): Promise<{ provider: ethers.BrowserProvider; signer: ethers.JsonRpcSigner } | null> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    return { provider, signer };
  } catch (error) {
    console.error('Failed to initialize Web3:', error);
    throw error;
  }
};

export const getProvider = (): ethers.BrowserProvider | null => provider;
export const getSigner = (): ethers.JsonRpcSigner | null => signer;

// Contract interaction functions
export const getLoanContract = (contractAddress: string): ethers.Contract => {
  if (!signer) {
    throw new Error('Web3 not initialized. Please connect your wallet first.');
  }
  return new ethers.Contract(contractAddress, LOAN_CONTRACT_ABI, signer);
};

export const getLoanContractReadOnly = async (contractAddress: string): Promise<ethers.Contract> => {
  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.Contract(contractAddress, LOAN_CONTRACT_ABI, provider);
};

// Loan contract functions
export const requestLoan = async (contractAddress: string, loanAmount: number, repaymentPercent: number): Promise<string> => {
  const contract = getLoanContract(contractAddress);
  const amountWei = ethers.parseEther(loanAmount.toString());
  const tx = await contract.requestLoan(amountWei, repaymentPercent);
  await tx.wait();
  return tx.hash;
};

export const approveLoan = async (contractAddress: string, borrowerAddress: string): Promise<string> => {
  const contract = getLoanContract(contractAddress);
  const tx = await contract.approveLoan(borrowerAddress);
  await tx.wait();
  return tx.hash;
};

export const repayLoan = async (contractAddress: string, income: number): Promise<string> => {
  const contract = getLoanContract(contractAddress);
  const incomeWei = ethers.parseEther(income.toString());
  const tx = await contract.repayLoan(incomeWei);
  await tx.wait();
  return tx.hash;
};

export const getLoanStatus = async (contractAddress: string, borrowerAddress: string): Promise<string> => {
  const contract = await getLoanContractReadOnly(contractAddress);
  return await contract.checkLoanStatus(borrowerAddress);
};

export const getLoanDetails = async (contractAddress: string, borrowerAddress: string) => {
  const contract = await getLoanContractReadOnly(contractAddress);
  
  const [loanAmount, repaidAmount, repaymentPercent, isApproved, isCompleted] = await contract.loans(borrowerAddress);
  const statusText = await contract.checkLoanStatus(borrowerAddress);

  return {
    loanAmount: ethers.formatEther(loanAmount),
    repaidAmount: ethers.formatEther(repaidAmount),
    repaymentPercent: repaymentPercent.toString(),
    isApproved,
    isCompleted,
    statusText
  };
};

// Utility functions
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

export const getWalletAddress = async (): Promise<string> => {
  if (!signer) {
    throw new Error('Wallet not connected');
  }
  return await signer.getAddress();
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
