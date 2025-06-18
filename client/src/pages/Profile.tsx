import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";

export function Profile() {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Mock wallet address - in production, this would be from Web3 connection
  const walletAddress = "0x742d35Cc6634C0532925a3b8D41b85F9D0F84f4E2e";

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

  const handleWalletRefresh = () => {
    // Mock Web3 connection refresh
    toast({
      title: "Wallet connection refreshed",
      description: "Your Ethereum wallet connection has been verified.",
    });
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
      </Card>

      {/* Ethereum Wallet */}
      <Card>
        <CardHeader>
          <CardTitle>Ethereum Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Connected Wallet</span>
              <Badge variant="secondary">Connected</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono mb-3">{walletAddress}</p>
            <Button variant="outline" size="sm" onClick={handleWalletRefresh}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Refresh Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
