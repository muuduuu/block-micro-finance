import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useWeb3 } from "@/hooks/useWeb3";
import { useToast } from "@/hooks/use-toast";
import { TransactionHistory } from "@/components/TransactionHistory";
import { formatAddress } from "@/lib/web3";
import { RotateCcw, Wallet, ExternalLink, AlertCircle } from "lucide-react";

export function Profile() {
  const { userProfile, updateUserProfile } = useAuth();
  const { isConnected, account, connectWallet, disconnectWallet, isLoading, error } = useWeb3();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePersonalInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    try {
      await updateUserProfile(updates);
      toast({
        title: "Profile updated!",
        description: "Your personal information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      businessName: formData.get("businessName") as string,
      businessType: formData.get("businessType") as string,
      monthlyIncome: formData.get("monthlyIncome") as string,
      yearsInBusiness: parseInt(formData.get("yearsInBusiness") as string),
    };

    try {
      await updateUserProfile(updates);
      toast({
        title: "Business profile updated!",
        description: "Your business information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleWalletRefresh = async () => {
    if (isConnected) {
      toast({
        title: "Wallet connection active",
        description: "Your Ethereum wallet is already connected and verified.",
      });
    } else {
      try {
        await connectWallet();
        toast({
          title: "Wallet connected!",
          description: "Your Ethereum wallet has been successfully connected.",
        });
      } catch (err) {
        toast({
          title: "Connection failed",
          description: "Failed to connect to your wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue={userProfile?.firstName || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={userProfile?.lastName || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={userProfile?.email || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={userProfile?.phone || ""}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Personal Info"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBusinessInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  defaultValue={userProfile?.businessName || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select name="businessType" defaultValue={userProfile?.businessType || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  name="monthlyIncome"
                  type="number"
                  defaultValue={userProfile?.monthlyIncome || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                <Input
                  id="yearsInBusiness"
                  name="yearsInBusiness"
                  type="number"
                  defaultValue={userProfile?.yearsInBusiness || ""}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Business Info"}
            </Button>
          </form>
        </CardContent>
      </Card>      {/* Ethereum Wallet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Ethereum Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          {isConnected && account ? (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Connected Wallet</span>
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs text-muted-foreground font-mono">{account}</p>
                <a
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleWalletRefresh} disabled={isLoading}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {isLoading ? "Connecting..." : "Refresh"}
                </Button>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Wallet Status</span>
                <Badge variant="secondary">Not Connected</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Connect your MetaMask wallet to enable smart contract interactions and crypto payments.
              </p>
              <Button variant="outline" size="sm" onClick={handleWalletRefresh} disabled={isLoading}>
                <Wallet className="h-4 w-4 mr-1" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <TransactionHistory />
    </div>
  );
}
