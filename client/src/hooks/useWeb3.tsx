import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { initializeWeb3, isMetaMaskInstalled, getWalletAddress } from '@/lib/web3';

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    // In development, log the error but provide a fallback instead of crashing
    if (process.env.NODE_ENV === 'development') {
      console.error('useWeb3 must be used within a Web3Provider - providing fallback');
      return {
        isConnected: false,
        account: null,
        provider: null,
        signer: null,
        connectWallet: async () => {
          console.warn('Web3Provider not available');
        },
        disconnectWallet: () => {
          console.warn('Web3Provider not available');
        },
        isLoading: false,
        error: 'Web3Provider not found',
      };
    }
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined') {
      setError('Not running in browser environment');
      return;
    }

    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const web3Instance = await initializeWeb3();
      if (web3Instance) {
        const { provider: web3Provider, signer: web3Signer } = web3Instance;
        const address = await getWalletAddress();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(address);
        setIsConnected(true);
        
        // Store connection state in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('web3Connected', 'true');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('web3Connected');
    }
  }, []);

  // Auto-connect on page load if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window === 'undefined') return;
      
      const wasConnected = localStorage.getItem('web3Connected');
      if (wasConnected && isMetaMaskInstalled()) {
        try {
          // Check if still connected to MetaMask
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Direct initialization instead of calling connectWallet to avoid dependency
            setIsLoading(true);
            const web3Instance = await initializeWeb3();
            if (web3Instance) {
              const { provider: web3Provider, signer: web3Signer } = web3Instance;
              const address = await getWalletAddress();
              
              setProvider(web3Provider);
              setSigner(web3Signer);
              setAccount(address);
              setIsConnected(true);
            }
            setIsLoading(false);
          } else {
            localStorage.removeItem('web3Connected');
          }
        } catch (error) {
          console.log('Auto-connect failed:', error);
          localStorage.removeItem('web3Connected');
          setIsLoading(false);
        }
      }
    };

    autoConnect();
  }, []); // Empty dependency array to run only once

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [account, disconnectWallet]);

  const value: Web3ContextType = {
    isConnected,
    account,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
