import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWeb3 } from '@/hooks/useWeb3';
import { formatAddress } from '@/lib/web3';
import { Wallet, AlertCircle, Check, Loader2 } from 'lucide-react';

export function WalletConnection() {
  const { isConnected, account, connectWallet, disconnectWallet, isLoading, error } = useWeb3();
  const [showFullAddress, setShowFullAddress] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            {isConnected ? (
              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary">Disconnected</Badge>
            )}
          </div>

          {isConnected ? (
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          )}
        </div>

        {isConnected && account && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address:</span>
              <button
                onClick={() => setShowFullAddress(!showFullAddress)}
                className="text-sm font-mono text-foreground hover:text-primary transition-colors"
              >
                {showFullAddress ? account : formatAddress(account)}
              </button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Click address to {showFullAddress ? 'shorten' : 'expand'}
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="text-sm text-muted-foreground">
            Connect your MetaMask wallet to interact with smart contracts and manage loan payments on the blockchain.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
