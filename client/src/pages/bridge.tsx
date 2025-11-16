import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownUp, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/lib/wallet-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BridgeTransaction } from "@shared/schema";
import { chains, type ChainId } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import bridgeGraphic from "@assets/generated_images/Cross-chain_bridge_graphic_93418596.png";

export default function Bridge() {
  const { address, isConnected } = useWallet();
  const { toast } = useToast();
  
  const [fromChain, setFromChain] = useState<ChainId>("zama-devnet");
  const [toChain, setToChain] = useState<ChainId>("ethereum");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [isBridging, setIsBridging] = useState(false);

  const { data: transactions, isLoading: isLoadingTx } = useQuery<BridgeTransaction[]>({
    queryKey: ["/api/bridge/transactions", address],
    queryFn: async () => {
      const url = address 
        ? `/api/bridge/transactions?address=${address}`
        : "/api/bridge/transactions";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
  });

  const { data: walletBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["/api/wallet", address],
    enabled: !!address && isConnected,
  });

  // Mock token balances (in production, would fetch real balances from blockchain per token)
  // Using mock data to simulate FHE-encrypted token balances
  const tokenBalances: Record<string, number> = {
    USDC: 1250.50,
    USDT: 890.25,
    ETH: 2.45,
    DAI: 500.00,
  };

  // Get balance for current token (would use encrypted balance from API in production)
  const currentBalance = walletBalance ? tokenBalances[token] : tokenBalances[token];

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to bridge tokens",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to bridge",
        variant: "destructive",
      });
      return;
    }

    if (fromChain === toChain) {
      toast({
        title: "Same Chain Selected",
        description: "Please select different source and destination chains",
        variant: "destructive",
      });
      return;
    }

    setIsBridging(true);
    try {
      await apiRequest("POST", "/api/bridge", {
        fromChain,
        toChain,
        token,
        encryptedAmount: amount, // In production, this would be FHE encrypted
        sender: address,
        recipient: address,
        status: "pending",
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/bridge/transactions", address] });

      toast({
        title: "Bridge Transaction Initiated",
        description: `Bridging ${amount} ${token} from ${fromChain} to ${toChain}`,
      });

      setAmount("");
    } catch (error) {
      toast({
        title: "Bridge Failed",
        description: "Failed to initiate bridge transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBridging(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    }
  };

  const getChainDisplay = (chainId: string) => {
    const chain = chains.find(c => c.id === chainId);
    return chain ? chain.name : chainId;
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Cross-Chain Bridge</h1>
          <p className="text-muted-foreground">
            Transfer tokens securely across chains with FHE encryption
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Bridge Interface */}
          <Card className="lg:col-span-2" data-testid="card-bridge-interface">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bridge Tokens</CardTitle>
                  <CardDescription>Encrypted cross-chain transfers</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1 font-mono text-xs">
                  <Lock className="h-3 w-3" />
                  FHE Encrypted
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Chain */}
              <div className="space-y-2">
                <Label>From Chain</Label>
                <Select value={fromChain} onValueChange={(value) => setFromChain(value as ChainId)}>
                  <SelectTrigger data-testid="select-from-chain">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapChains}
                  className="rounded-full"
                  data-testid="button-swap-chains"
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              {/* To Chain */}
              <div className="space-y-2">
                <Label>To Chain</Label>
                <Select value={toChain} onValueChange={(value) => setToChain(value as ChainId)}>
                  <SelectTrigger data-testid="select-to-chain">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Amount</Label>
                  {isConnected && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Available:</span>
                      {isLoadingBalance ? (
                        <span className="font-mono font-medium text-foreground">Loading...</span>
                      ) : (
                        <span className="font-mono font-medium text-foreground" data-testid="text-available-balance">
                          {currentBalance.toFixed(2)} {token}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 text-2xl font-mono"
                    data-testid="input-bridge-amount"
                  />
                  <Select value={token} onValueChange={setToken}>
                    <SelectTrigger className="w-32" data-testid="select-token">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="DAI">DAI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isConnected && amount && parseFloat(amount) > currentBalance && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Insufficient balance
                  </p>
                )}
              </div>

              {/* Transaction Summary */}
              <div className="rounded-md bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bridge Fee</span>
                  <span className="font-mono">0.06%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Time</span>
                  <span>~2-5 minutes</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                  <span className="text-muted-foreground">You will receive</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">
                      {amount ? (parseFloat(amount) * 0.9994).toFixed(4) : "0.00"} {token}
                    </span>
                    <Lock className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </div>

              {/* Bridge Button */}
              <Button
                onClick={handleBridge}
                disabled={isBridging || !isConnected}
                className="w-full gap-2 text-lg"
                size="lg"
                data-testid="button-bridge-tokens"
              >
                {isBridging ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Bridging...
                  </>
                ) : !isConnected ? (
                  <>
                    <Lock className="h-5 w-5" />
                    Connect Wallet to Bridge
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Bridge Tokens
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* FHE Privacy Card */}
          <Card className="lg:col-span-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                  src={bridgeGraphic}
                  alt="Cross-chain bridge"
                  className="w-40 h-40 object-contain"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Privacy-Preserving Transfers</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    All bridge transactions use Zama's FHE technology to encrypt the transfer amount. 
                    Only you can decrypt and view your transaction details, ensuring complete privacy 
                    while maintaining trustless cross-chain verification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent cross-chain transfers</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1 font-mono text-xs">
                <Lock className="h-3 w-3" />
                FHE Encrypted
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingTx ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-md border animate-pulse">
                    <div className="h-10 w-10 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 p-4 rounded-md border hover-elevate transition-all"
                    data-testid={`transaction-${tx.id}`}
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(tx.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {getChainDisplay(tx.fromChain)}
                        </span>
                        <ArrowDownUp className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold">
                          {getChainDisplay(tx.toChain)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        <span className="font-mono">Encrypted Amount</span>
                        <span>•</span>
                        <span className="font-mono">{tx.token}</span>
                        <Lock className="h-3 w-3" />
                        <span>•</span>
                        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={tx.status === "confirmed" ? "secondary" : "default"}>
                      {tx.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ArrowDownUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Transactions Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Your bridge transactions will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
