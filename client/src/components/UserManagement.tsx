import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Mail,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AdminRole, isAdminEmail, getAdminRole } from '@/lib/adminConfig';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  adminRole?: AdminRole;
  walletAddress?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  totalLoans: number;
  totalRepaid: number;
}

export function UserManagement() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Mock data - In real implementation, fetch from your database
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@microfinance.com',
          firstName: 'Admin',
          lastName: 'User',
          isAdmin: true,
          adminRole: AdminRole.SUPER_ADMIN,
          walletAddress: '0x1234...5678',
          status: 'active',
          lastLogin: new Date(),
          totalLoans: 0,
          totalRepaid: 0,
        },
        {
          id: '2',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          isAdmin: false,
          walletAddress: '0x2345...6789',
          status: 'active',
          lastLogin: new Date(Date.now() - 86400000), // Yesterday
          totalLoans: 2,
          totalRepaid: 0.5,
        },
        {
          id: '3',
          email: 'manager@microfinance.com',
          firstName: 'Manager',
          lastName: 'Smith',
          isAdmin: true,
          adminRole: AdminRole.LOAN_MANAGER,
          walletAddress: '0x3456...7890',
          status: 'active',
          lastLogin: new Date(Date.now() - 3600000), // 1 hour ago
          totalLoans: 0,
          totalRepaid: 0,
        },
        {
          id: '4',
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          isAdmin: false,
          walletAddress: '0x4567...8901',
          status: 'inactive',
          lastLogin: new Date(Date.now() - 604800000), // 1 week ago
          totalLoans: 1,
          totalRepaid: 1.2,
        },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'admin' && user.isAdmin) ||
      (filterStatus === 'user' && !user.isAdmin) ||
      user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = async (userId: string, action: 'activate' | 'suspend' | 'promote' | 'demote') => {
    // Mock implementation - In real app, make API calls
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'activate':
            return { ...user, status: 'active' as const };
          case 'suspend':
            return { ...user, status: 'suspended' as const };
          case 'promote':
            return { ...user, isAdmin: true, adminRole: AdminRole.SUPPORT_STAFF };
          case 'demote':
            return { ...user, isAdmin: false, adminRole: undefined };
          default:
            return user;
        }
      }
      return user;
    }));
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAdminBadge = (user: User) => {
    if (!user.isAdmin) return null;
    
    const roleColors = {
      [AdminRole.SUPER_ADMIN]: 'bg-purple-500',
      [AdminRole.LOAN_MANAGER]: 'bg-blue-500',
      [AdminRole.FINANCIAL_ANALYST]: 'bg-green-500',
      [AdminRole.SUPPORT_STAFF]: 'bg-yellow-500',
    };
    
    return (
      <Badge className={roleColors[user.adminRole!] || 'bg-gray-500'}>
        <Shield className="h-3 w-3 mr-1" />
        {user.adminRole}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Label htmlFor="filter">Filter by</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admins Only</SelectItem>
                  <SelectItem value="user">Regular Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Loans</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-2">
                          {getAdminBadge(user)}
                          {!user.isAdmin && <Badge variant="outline">User</Badge>}
                        </div>
                      </TableCell>
                      
                      <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                      
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {user.walletAddress || 'Not connected'}
                        </code>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div>Total: {user.totalLoans}</div>
                          <div className="text-muted-foreground">
                            Repaid: {user.totalRepaid} ETH
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {user.lastLogin.toLocaleDateString()}
                          <div className="text-muted-foreground">
                            {user.lastLogin.toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-1">
                          {user.status === 'suspended' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'activate')}
                            >
                              <UserCheck className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'suspend')}
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {!user.isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'promote')}
                            >
                              <UserPlus className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {user.isAdmin && user.email !== userProfile?.email && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'demote')}
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.isAdmin).length}
                </div>
                <div className="text-sm text-muted-foreground">Admin Users</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.totalLoans > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Borrowers</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
