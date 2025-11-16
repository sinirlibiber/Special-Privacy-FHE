import { Link, useLocation } from "wouter";
import { Wallet, Shield, LogOut, User, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useWallet } from "@/lib/wallet-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConnectWalletDialog } from "@/components/connect-wallet-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location] = useLocation();
  const { address, isConnected, disconnect } = useWallet();
  const { toast } = useToast();
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);


  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy address. Please copy it manually.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/governance", label: "Governance" },
    { path: "/bridge", label: "Bridge" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/">
          <a className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1" data-testid="link-home">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">Special Privacy FHE</span>
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ path, label }) => (
            <Link key={path} href={path}>
              <a data-testid={`link-nav-${label.toLowerCase()}`}>
                <Button
                  variant={location === path ? "secondary" : "ghost"}
                  className={location === path ? "font-semibold" : ""}
                >
                  {label}
                </Button>
              </a>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {!isConnected ? (
            <Button
              onClick={() => setConnectDialogOpen(true)}
              className="gap-2"
              data-testid="button-connect-wallet"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 font-mono text-sm"
                  data-testid="button-wallet-profile"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  {formatAddress(address!)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">Wallet Profile</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Connected to Special Privacy FHE
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer" data-testid="menu-item-view-profile">
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCopyAddress}
                  className="gap-2 cursor-pointer"
                  data-testid="menu-item-copy-address"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="flex-1 font-mono text-xs">
                    {address}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDisconnect}
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  data-testid="menu-item-disconnect"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect Wallet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center gap-1 px-4 pb-2">
        {navLinks.map(({ path, label }) => (
          <Link key={path} href={path}>
            <a data-testid={`link-nav-mobile-${label.toLowerCase()}`}>
              <Button
                size="sm"
                variant={location === path ? "secondary" : "ghost"}
                className={location === path ? "font-semibold" : ""}
              >
                {label}
              </Button>
            </a>
          </Link>
        ))}
      </nav>

      <ConnectWalletDialog 
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
      />
    </header>
  );
}
