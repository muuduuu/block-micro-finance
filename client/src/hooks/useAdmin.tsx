import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { isAdminEmail, getAdminRole, hasPermission, AdminRole } from '@/lib/adminConfig';
import { getLoanContract, getWalletAddress } from '@/lib/web3';
import { LOAN_CONTRACT_ADDRESS } from '@/lib/web3';

interface AdminContextType {
  isAdmin: boolean;
  adminRole: AdminRole | null;
  isOwner: boolean;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  refreshOwnerStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user, userProfile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkOwnerStatus = async () => {
    try {
      if (!userProfile?.walletAddress) return false;
      
      const contract = await getLoanContract(LOAN_CONTRACT_ADDRESS);
      const contractOwner = await contract.owner();
      const userWalletAddress = await getWalletAddress();
      
      return contractOwner.toLowerCase() === userWalletAddress.toLowerCase();
    } catch (error) {
      console.error('Error checking owner status:', error);
      return false;
    }
  };

  const refreshOwnerStatus = async () => {
    setLoading(true);
    const ownerStatus = await checkOwnerStatus();
    setIsOwner(ownerStatus);
    setLoading(false);
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      
      if (!user || !userProfile) {
        setIsAdmin(false);
        setAdminRole(null);
        setIsOwner(false);
        setLoading(false);
        return;
      }

      // Check if user is admin by email
      const adminStatus = isAdminEmail(user.email || '');
      const role = getAdminRole(user.email || '');
      
      setIsAdmin(adminStatus);
      setAdminRole(role);

      // Check blockchain owner status
      const ownerStatus = await checkOwnerStatus();
      setIsOwner(ownerStatus);
      
      setLoading(false);
    };

    checkAdminStatus();
  }, [user, userProfile]);

  const checkPermission = (permission: string): boolean => {
    // Contract owner has all permissions
    if (isOwner) return true;
    
    // Check role-based permissions
    return hasPermission(adminRole, permission);
  };

  return (
    <AdminContext.Provider value={{
      isAdmin: isAdmin || isOwner,
      adminRole,
      isOwner,
      loading,
      hasPermission: checkPermission,
      refreshOwnerStatus,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
