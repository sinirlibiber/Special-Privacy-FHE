import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, QrCode, Chrome } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { useToast } from "@/hooks/use-toast";

interface ConnectWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectWalletDialog({ open, onOpenChange }: ConnectWalletDialogProps) {
  const { connect, connectQR } = useWallet();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleBrowserConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
      onOpenChange(false);
      toast({
        title: "Wallet Connected",
        description: "Your browser wallet has been connected successfully",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect browser wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleQRConnect = async () => {
    setIsConnecting(true);
    try {
      await connectQR();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect with QR code. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-connect-wallet">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to connect your wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* Browser Extension Option */}
          <Button
            variant="outline"
            className="w-full h-auto p-4 justify-start"
            onClick={handleBrowserConnect}
            disabled={isConnecting}
            data-testid="button-connect-browser"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Chrome className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Browser Extension</div>
                <div className="text-xs text-muted-foreground">
                  Connect with MetaMask, Coinbase Wallet, or other browser wallets
                </div>
              </div>
            </div>
          </Button>

          {/* QR Code Option */}
          <Button
            variant="outline"
            className="w-full h-auto p-4 justify-start"
            onClick={handleQRConnect}
            disabled={isConnecting}
            data-testid="button-connect-qr"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">QR Code</div>
                <div className="text-xs text-muted-foreground">
                  Scan with WalletConnect-compatible mobile wallet
                </div>
              </div>
            </div>
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
          By connecting, you agree to our Terms of Service
        </div>
      </DialogContent>
    </Dialog>
  );
}
