import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

interface LoanStatisticsProps {
  statistics: {
    totalRequests: number;
    pendingLoans: number;
    approvedLoans: number;
    completedLoans: number;
    totalLoanAmount: number;
    totalRepaidAmount: number;
    repaymentRate: number;
  };
}

export function LoanStatistics({ statistics }: LoanStatisticsProps) {
  const {
    totalRequests,
    pendingLoans,
    approvedLoans,
    completedLoans,
    totalLoanAmount,
    totalRepaidAmount,
    repaymentRate,
  } = statistics;

  const statsCards = [
    {
      title: 'Total Requests',
      value: totalRequests,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Approval',
      value: pendingLoans,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Active Loans',
      value: approvedLoans,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Completed Loans',
      value: completedLoans,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const financialCards = [
    {
      title: 'Total Loan Amount',
      value: `${totalLoanAmount.toFixed(4)} ETH`,
      subtitle: `$${(totalLoanAmount * 2000).toFixed(2)} USD`, // Approximate conversion
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Repaid',
      value: `${totalRepaidAmount.toFixed(4)} ETH`,
      subtitle: `$${(totalRepaidAmount * 2000).toFixed(2)} USD`,
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'Repayment Rate',
      value: `${repaymentRate.toFixed(1)}%`,
      subtitle: 'Overall portfolio performance',
      icon: repaymentRate >= 80 ? TrendingUp : TrendingDown,
      color: repaymentRate >= 80 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Loan Count Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  </div>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                
                {stat.title === 'Repayment Rate' && (
                  <div className="space-y-2">
                    <Progress value={repaymentRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Loan Distribution</span>
              <span className="text-sm text-muted-foreground">
                {totalRequests} total loans
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs">Pending ({pendingLoans})</span>
                <span className="text-xs">
                  {totalRequests > 0 ? ((pendingLoans / totalRequests) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <Progress 
                value={totalRequests > 0 ? (pendingLoans / totalRequests) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs">Active ({approvedLoans})</span>
                <span className="text-xs">
                  {totalRequests > 0 ? ((approvedLoans / totalRequests) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <Progress 
                value={totalRequests > 0 ? (approvedLoans / totalRequests) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs">Completed ({completedLoans})</span>
                <span className="text-xs">
                  {totalRequests > 0 ? ((completedLoans / totalRequests) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <Progress 
                value={totalRequests > 0 ? (completedLoans / totalRequests) * 100 : 0} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
