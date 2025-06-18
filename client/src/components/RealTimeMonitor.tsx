import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { loanBlockchainService } from '@/lib/loanBlockchainService';

interface RealtimeActivity {
  id: string;
  type: 'loan_request' | 'loan_approved' | 'loan_repaid' | 'loan_completed';
  user: string;
  amount?: number;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

export function RealTimeMonitor() {
  const [activities, setActivities] = useState<RealtimeActivity[]>([]);
  const [stats, setStats] = useState({
    activeConnections: 0,
    transactionsPerSecond: 0,
    averageResponseTime: 0,
    errorRate: 0,
  });
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    generateMockActivities();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        addRandomActivity();
        updateStats();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const generateMockActivities = () => {
    const mockActivities: RealtimeActivity[] = [
      {
        id: '1',
        type: 'loan_request',
        user: '0x1234...5678',
        amount: 1.5,
        timestamp: new Date(Date.now() - 60000),
        status: 'pending',
      },
      {
        id: '2',
        type: 'loan_approved',
        user: '0x2345...6789',
        amount: 2.0,
        timestamp: new Date(Date.now() - 120000),
        status: 'success',
      },
      {
        id: '3',
        type: 'loan_repaid',
        user: '0x3456...7890',
        amount: 0.5,
        timestamp: new Date(Date.now() - 180000),
        status: 'success',
      },
      {
        id: '4',
        type: 'loan_completed',
        user: '0x4567...8901',
        amount: 1.8,
        timestamp: new Date(Date.now() - 240000),
        status: 'success',
      },
    ];
    setActivities(mockActivities);
  };

  const addRandomActivity = () => {
    const types: RealtimeActivity['type'][] = ['loan_request', 'loan_approved', 'loan_repaid', 'loan_completed'];
    const statuses: RealtimeActivity['status'][] = ['success', 'pending', 'failed'];
    
    const newActivity: RealtimeActivity = {
      id: Date.now().toString(),
      type: types[Math.floor(Math.random() * types.length)],
      user: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      amount: Math.random() * 5,
      timestamp: new Date(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep only last 20 activities
  };

  const updateStats = () => {
    setStats({
      activeConnections: Math.floor(Math.random() * 100) + 50,
      transactionsPerSecond: Math.random() * 10,
      averageResponseTime: Math.floor(Math.random() * 500) + 100,
      errorRate: Math.random() * 5,
    });
  };

  const getActivityIcon = (type: RealtimeActivity['type']) => {
    switch (type) {
      case 'loan_request':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'loan_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'loan_repaid':
        return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'loan_completed':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (type: RealtimeActivity['type']) => {
    switch (type) {
      case 'loan_request':
        return 'Loan Requested';
      case 'loan_approved':
        return 'Loan Approved';
      case 'loan_repaid':
        return 'Repayment Made';
      case 'loan_completed':
        return 'Loan Completed';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: RealtimeActivity['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold">{stats.activeConnections}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions/sec</p>
                <p className="text-2xl font-bold">{stats.transactionsPerSecond.toFixed(1)}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">{stats.averageResponseTime}ms</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">{stats.errorRate.toFixed(1)}%</p>
              </div>
              {stats.errorRate > 2 ? (
                <AlertCircle className="h-8 w-8 text-red-500" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Activity Feed
            {isLive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">LIVE</span>
              </div>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No recent activity
                </div>
              ) : (
                activities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <div className="font-medium">
                            {getActivityLabel(activity.type)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            User: {activity.user}
                            {activity.amount && (
                              <span className="ml-2">
                                Amount: {activity.amount.toFixed(4)} ETH
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.status)}
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    {index < activities.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>{Math.floor(Math.random() * 30) + 20}%</span>
              </div>
              <Progress value={Math.floor(Math.random() * 30) + 20} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{Math.floor(Math.random() * 40) + 30}%</span>
              </div>
              <Progress value={Math.floor(Math.random() * 40) + 30} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network I/O</span>
                <span>{Math.floor(Math.random() * 60) + 10}%</span>
              </div>
              <Progress value={Math.floor(Math.random() * 60) + 10} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Blockchain Sync</span>
                <span>99.{Math.floor(Math.random() * 9) + 1}%</span>
              </div>
              <Progress value={99 + Math.random()} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
