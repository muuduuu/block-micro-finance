// Admin configuration - These emails will have admin privileges
export const ADMIN_EMAILS = [
  'admin@microfinance.com',
  'manager@microfinance.com',
  'supervisor@microfinance.com',
  // Add more admin emails here
];

// Admin roles with different permission levels
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  LOAN_MANAGER = 'loan_manager', 
  FINANCIAL_ANALYST = 'financial_analyst',
  SUPPORT_STAFF = 'support_staff'
}

// Admin permissions mapping
export const ADMIN_PERMISSIONS = {
  [AdminRole.SUPER_ADMIN]: [
    'approve_loans',
    'reject_loans', 
    'view_all_loans',
    'manage_users',
    'view_analytics',
    'manage_admins',
    'blockchain_operations'
  ],
  [AdminRole.LOAN_MANAGER]: [
    'approve_loans',
    'reject_loans',
    'view_all_loans',
    'view_analytics',
    'blockchain_operations'
  ],
  [AdminRole.FINANCIAL_ANALYST]: [
    'view_all_loans',
    'view_analytics'
  ],
  [AdminRole.SUPPORT_STAFF]: [
    'view_all_loans'
  ]
};

// Default admin configuration
export const DEFAULT_ADMIN_CONFIG: Record<string, AdminRole> = {
  'admin@microfinance.com': AdminRole.SUPER_ADMIN,
  'manager@microfinance.com': AdminRole.LOAN_MANAGER,
  'supervisor@microfinance.com': AdminRole.FINANCIAL_ANALYST,
};

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const getAdminRole = (email: string): AdminRole | null => {
  const normalizedEmail = email.toLowerCase();
  return DEFAULT_ADMIN_CONFIG[normalizedEmail] || null;
};

export const hasPermission = (userRole: AdminRole | null, permission: string): boolean => {
  if (!userRole) return false;
  return ADMIN_PERMISSIONS[userRole]?.includes(permission) || false;
};
