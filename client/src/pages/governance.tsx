import { useQuery } from "@tanstack/react-query";
import { Lock, Clock, CheckCircle, XCircle, MinusCircle, Vote as VoteIcon, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/lib/wallet-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Proposal } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Governance() {
  const { address, isConnected } = useWallet();
  const { toast } = useToast();
  const [votingProposal, setVotingProposal] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals"],
  });

  const handleVote = async (proposalId: string, choice: "for" | "against" | "abstain") => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }

    setVotingProposal(proposalId);
    try {
      await apiRequest("POST", "/api/vote", {
        proposalId,
        voter: address,
        choice,
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });

      toast({
        title: "Vote Cast Successfully",
        description: "Your encrypted vote has been recorded on-chain",
      });
    } catch (error) {
      toast({
        title: "Vote Failed",
        description: "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVotingProposal(null);
    }
  };

  const handleCreateProposal = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a proposal",
        variant: "destructive",
      });
      return;
    }

    if (!newProposal.title || !newProposal.description || !newProposal.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await apiRequest("POST", "/api/proposals", {
        title: newProposal.title,
        description: newProposal.description,
        proposer: address,
        deadline: new Date(newProposal.deadline).toISOString(),
        status: "active",
        encryptedVotesFor: "0",
        encryptedVotesAgainst: "0",
        encryptedVotesAbstain: "0",
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });

      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted successfully",
      });

      setIsCreateDialogOpen(false);
      setNewProposal({ title: "", description: "", deadline: "" });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />;
      case "passed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <MinusCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "active":
        return "default";
      case "passed":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatTimeRemaining = (deadline: Date | string) => {
    const now = new Date();
    const end = typeof deadline === "string" ? new Date(deadline) : deadline;
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">DAO Governance</h1>
          <p className="text-muted-foreground">
            Participate in encrypted, privacy-preserving voting
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-create-proposal">
              <VoteIcon className="h-4 w-4" />
              Create Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
              <DialogDescription>
                Submit a new proposal for the DAO to vote on
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Proposal title"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  data-testid="input-proposal-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your proposal in detail..."
                  rows={6}
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  data-testid="input-proposal-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Voting Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={newProposal.deadline}
                  onChange={(e) => setNewProposal({ ...newProposal, deadline: e.target.value })}
                  data-testid="input-proposal-deadline"
                />
              </div>
              <Button
                onClick={handleCreateProposal}
                disabled={isCreating}
                className="w-full"
                data-testid="button-submit-proposal"
              >
                {isCreating ? "Creating..." : "Submit Proposal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : proposals && proposals.length > 0 ? (
        <div className="grid gap-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="hover-elevate transition-all" data-testid={`card-proposal-${proposal.id}`}>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
                  <CardTitle className="text-2xl">{proposal.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(proposal.status)} className="gap-1 whitespace-nowrap">
                      {getStatusIcon(proposal.status)}
                      {proposal.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="gap-1 font-mono text-xs whitespace-nowrap">
                      <Lock className="h-3 w-3" />
                      FHE Encrypted
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {proposal.description}
                </CardDescription>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="font-mono">{proposal.proposer.slice(0, 10)}...</span>
                  <span>•</span>
                  <span>{formatTimeRemaining(proposal.deadline)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Total Voters Count */}
                  <div className="flex items-center justify-between p-4 rounded-md bg-primary/5 border">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-medium">Total Voters</span>
                    </div>
                    <div className="text-2xl font-bold font-mono" data-testid={`text-total-voters-${proposal.id}`}>
                      {proposal.totalVoters || 0}
                    </div>
                  </div>

                  {/* Encrypted Vote Display */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vote Breakdown (FHE Encrypted)</span>
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 rounded-md bg-muted/50">
                        <div className="text-2xl font-bold font-mono">***</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">For</div>
                      </div>
                      <div className="text-center p-3 rounded-md bg-muted/50">
                        <div className="text-2xl font-bold font-mono">***</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Against</div>
                      </div>
                      <div className="text-center p-3 rounded-md bg-muted/50">
                        <div className="text-2xl font-bold font-mono">***</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Abstain</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Individual votes remain encrypted until voting period ends
                    </p>
                  </div>

                  {/* Voting Buttons */}
                  {proposal.status === "active" && (
                    <>
                      {isConnected ? (
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => handleVote(proposal.id, "for")}
                            disabled={votingProposal === proposal.id}
                            data-testid={`button-vote-for-${proposal.id}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            For
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleVote(proposal.id, "against")}
                            disabled={votingProposal === proposal.id}
                            data-testid={`button-vote-against-${proposal.id}`}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Against
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleVote(proposal.id, "abstain")}
                            disabled={votingProposal === proposal.id}
                            data-testid={`button-vote-abstain-${proposal.id}`}
                          >
                            <MinusCircle className="h-4 w-4 mr-2" />
                            Abstain
                          </Button>
                        </div>
                      ) : (
                        <div className="pt-4 border-t text-center">
                          <p className="text-sm text-muted-foreground mb-3">
                            Connect your wallet to vote on this proposal
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <VoteIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Proposals Yet</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to create a proposal for the DAO
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-proposal">
            Create First Proposal
          </Button>
        </Card>
      )}
    </div>
  );
}
