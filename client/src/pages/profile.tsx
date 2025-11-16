import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/lib/wallet-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRightLeft, Vote, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { BridgeTransaction, Proposal, Vote as VoteType } from "@shared/schema";
import { chains } from "@shared/schema";
import { useLocation } from "wouter";

export default function Profile() {
  const { address, isConnected } = useWallet();
  const [, navigate] = useLocation();

  const { data: bridgeTransactions, isLoading: isLoadingBridge } = useQuery<BridgeTransaction[]>({
    queryKey: ["/api/bridge/transactions", address],
    queryFn: async () => {
      if (!address) return [];
      const response = await fetch(`/api/bridge/transactions?address=${address}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
    enabled: !!address && isConnected,
  });

  const { data: proposals } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals"],
  });

  // Filter proposals created by user
  const myProposals = proposals?.filter(p => p.proposer === address) || [];

  // Get votes for user's proposals
  const getVoteCount = (proposal: Proposal) => {
    const forVotes = parseInt(proposal.encryptedVotesFor) || 0;
    const againstVotes = parseInt(proposal.encryptedVotesAgainst) || 0;
    const abstainVotes = parseInt(proposal.encryptedVotesAbstain) || 0;
    return forVotes + againstVotes + abstainVotes;
  };

  if (!isConnected || !address) {
    return (
      <div className="container py-20 text-center">
        <Lock className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-3xl font-semibold mb-4">Connect Your Wallet</h2>
        <p className="text-muted-foreground mb-8">
          Please connect your wallet to view your profile and transaction history
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
      case "rejected":
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
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Profile</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="font-mono text-sm">{address}</span>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Connected
            </Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Bridge Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5" />
                    Bridge Transactions
                  </CardTitle>
                  <CardDescription>Your cross-chain transfer history</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1 font-mono text-xs">
                  <Lock className="h-3 w-3" />
                  FHE Encrypted
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBridge ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : bridgeTransactions && bridgeTransactions.length > 0 ? (
                <div className="space-y-3">
                  {bridgeTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-md bg-muted/30 hover-elevate"
                      data-testid={`transaction-${tx.id}`}
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(tx.status)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{getChainDisplay(tx.fromChain)}</span>
                            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{getChainDisplay(tx.toChain)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            <span className="font-mono">Amount: {tx.encryptedAmount} {tx.token}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={tx.status === "confirmed" ? "default" : tx.status === "failed" ? "destructive" : "secondary"}>
                        {tx.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowRightLeft className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No bridge transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Proposals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    My Proposals
                  </CardTitle>
                  <CardDescription>Proposals you've created</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1 font-mono text-xs">
                  <Lock className="h-3 w-3" />
                  FHE Encrypted Votes
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {myProposals.length > 0 ? (
                <div className="space-y-3">
                  {myProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="p-4 rounded-md bg-muted/30 hover-elevate cursor-pointer"
                      onClick={() => navigate("/governance")}
                      data-testid={`proposal-${proposal.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{proposal.title}</h3>
                        <Badge variant={proposal.status === "active" ? "default" : proposal.status === "passed" ? "default" : "secondary"}>
                          {proposal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{proposal.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Lock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono">{getVoteCount(proposal)} votes</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Vote className="h-3 w-3" />
                          <span>Created {new Date(proposal.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>You haven't created any proposals yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Encrypted Data Info */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Privacy & Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    All sensitive data including vote choices, transaction amounts, and wallet balances 
                    are encrypted using Zama's Fully Homomorphic Encryption (FHE) technology. Your data 
                    remains private while still being verifiable on-chain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
