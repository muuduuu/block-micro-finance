import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Wifi, 
  Database, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { loanBlockchainService } from '@/lib/loanBlockchainService';
import { LOAN_CONTRACT_ADDRESS } from '@/lib/web3';

interface SystemStatusProps {
  onRefresh?: () => void;
}

export function SystemStatus({ onRefresh }: SystemStatusProps) {
  const [contractStatus, setContractStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [blockchainHealth, setBlockchainHealth] = useState({
    latency: 0,
    gasPrice: 0,
    blockNumber: 0,
  });
  const [systemMetrics, setSystemMetrics] = useState({
    totalTransactions: 0,
    totalValueLocked: 0,
    activeUsers: 0,
    systemUptime: 99.9,
  });

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      setContractStatus('checking');
      
      // Check contract connectivity
      const stats = await loanBlockchainService.getLoanStatistics();
      setContractStatus('connected');
      
      // Update metrics
      setSystemMetrics(prev => ({
        ...prev,
        totalTransactions: stats.totalRequests,
        totalValueLocked: stats.totalLoanAmount,
        activeUsers: stats.approvedLoans + stats.pendingLoans,
      }));
      
      setLastUpdate(new Date());
      
      // Simulate blockchain health metrics
      setBlockchainHealth({
        latency: Math.floor(Math.random() * 500) + 100, // 100-600ms
        gasPrice: Math.floor(Math.random() * 50) + 20, // 20-70 gwei
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      });
      
    } catch (error) {
      console.error('System status check failed:', error);
      setContractStatus('disconnected');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disconnected': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'checking': return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => {
            checkSystemStatus();
            onRefresh?.();
          }}>
            <RefreshCw className="h-3 w-3 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Contract Status */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Smart Contract</p>
                <p className={`text-sm ${getStatusColor(contractStatus)}`}>
                  {contractStatus === 'connected' ? 'Connected' : 
                   contractStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
                </p>
              </div>
              {getStatusIcon(contractStatus)}
            </div>

            {/* Blockchain Health */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Network Latency</p>
                <p className="text-sm text-muted-foreground">{blockchainHealth.latency}ms</p>
              </div>
              <Wifi className="h-4 w-4 text-blue-600" />
            </div>

            {/* Gas Price */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Gas Price</p>
                <p className="text-sm text-muted-foreground">{blockchainHealth.gasPrice} gwei</p>
              </div>
              <Database className="h-4 w-4 text-purple-600" />
            </div>

            {/* System Uptime */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">System Uptime</p>
                <p className="text-sm text-green-600">{systemMetrics.systemUptime}%</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Detailed Metrics */}
          <div className="space-y-4">
            <h4 className="font-medium">System Metrics</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Transactions</span>
                  <span className="font-mono">{systemMetrics.totalTransactions}</span>
                </div>
                <Progress value={Math.min(systemMetrics.totalTransactions * 2, 100)} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Value Locked</span>
                  <span className="font-mono">{systemMetrics.totalValueLocked.toFixed(2)} ETH</span>
                </div>
                <Progress value={Math.min(systemMetrics.totalValueLocked * 10, 100)} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Users</span>
                  <span className="font-mono">{systemMetrics.activeUsers}</span>
                </div>
                <Progress value={Math.min(systemMetrics.activeUsers * 5, 100)} />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Contract Information */}
          <div className="space-y-2">
            <h4 className="font-medium">Contract Information</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Contract Address:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {LOAN_CONTRACT_ADDRESS}
                </code>
              </div>
              <div className="flex justify-between">
                <span>Current Block:</span>
                <span className="font-mono">{blockchainHealth.blockNumber.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-muted-foreground">
                  {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
