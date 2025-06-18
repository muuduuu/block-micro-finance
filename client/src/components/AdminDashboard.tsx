import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LoanRequest, 
  BlockchainLoanDetails, 
  loanBlockchainService 
} from '@/lib/loanBlockchainService';
import { PendingLoansTable } from './PendingLoansTable';
import { ApprovedLoansTable } from './ApprovedLoansTable';
import { LoanStatistics } from './LoanStatistics';
import { SystemStatus } from './SystemStatus';
import { UserManagement } from './UserManagement';
import { RealTimeMonitor } from './RealTimeMonitor';
import { 
  AlertCircle, 
  Shield, 
  Users, 
  TrendingUp, 
  Activity,
  Settings,
  Eye,
  RefreshCw
} from 'lucide-react';

export function AdminDashboard() {
  const { isAdmin, adminRole, isOwner, hasPermission, loading } = useAdmin();
  const [pendingLoans, setPendingLoans] = useState<LoanRequest[]>([]);
  const [approvedLoans, setApprovedLoans] = useState<BlockchainLoanDetails[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin && !loading) {
      loadAdminData();
    }
  }, [isAdmin, loading]);

  const loadAdminData = async () => {
    try {
      setDataLoading(true);
      setError(null);

      const [pendingData, approvedData, statsData] = await Promise.all([
        loanBlockchainService.getPendingLoanRequests(),
        loanBlockchainService.getApprovedLoans(),
        loanBlockchainService.getLoanStatistics(),
      ]);

      setPendingLoans(pendingData);
      setApprovedLoans(approvedData);
      setStatistics(statsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLoanApproval = async (borrowerAddress: string) => {
    try {
      if (!hasPermission('approve_loans')) {
        setError('You do not have permission to approve loans.');
        return;
      }

      await loanBlockchainService.approveLoan(borrowerAddress);
      await loadAdminData(); // Refresh data
    } catch (err) {
      console.error('Error approving loan:', err);
      setError('Failed to approve loan. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have admin privileges. If you believe this is an error, 
            please contact your system administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Control Center
            </h1>
            <p className="opacity-90 mt-1">
              Role: {isOwner ? 'Contract Owner' : adminRole} | 
              Contract Owner: {isOwner ? 'Yes' : 'No'}
            </p>
          </div>
          <Button 
            variant="secondary" 
            onClick={loadAdminData}
            disabled={dataLoading}
          >
            {dataLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="loans" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Loan Requests ({pendingLoans.length + approvedLoans.length})
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Real-time Monitor
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Statistics Cards */}
            {statistics && <LoanStatistics statistics={statistics} />}
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-20 flex-col gap-2" 
                    variant="outline"
                    onClick={() => {
                      const tab = document.querySelector('[value="loans"]') as HTMLElement;
                      tab?.click();
                    }}
                  >
                    <AlertCircle className="h-6 w-6" />
                    <span>Review Pending Loans</span>
                    <Badge variant="secondary">{pendingLoans.length}</Badge>
                  </Button>
                  
                  <Button 
                    className="h-20 flex-col gap-2" 
                    variant="outline"
                    onClick={() => {
                      const tab = document.querySelector('[value="monitoring"]') as HTMLElement;
                      tab?.click();
                    }}
                  >
                    <Activity className="h-6 w-6" />
                    <span>System Monitor</span>
                  </Button>
                  
                  <Button 
                    className="h-20 flex-col gap-2" 
                    variant="outline"
                    onClick={() => {
                      const tab = document.querySelector('[value="users"]') as HTMLElement;
                      tab?.click();
                    }}
                  >
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Go to Monitor tab for real-time activity feed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loans">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Loan Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="text-center py-8">Loading pending loans...</div>
                ) : (
                  <PendingLoansTable 
                    loans={pendingLoans}
                    onApproveLoan={handleLoanApproval}
                    canApprove={hasPermission('approve_loans')}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="text-center py-8">Loading active loans...</div>
                ) : (
                  <ApprovedLoansTable loans={approvedLoans} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <RealTimeMonitor />
        </TabsContent>

        <TabsContent value="users">
          {hasPermission('manage_users') ? (
            <UserManagement />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  You don't have permission to manage users.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="system">
          <SystemStatus onRefresh={loadAdminData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
