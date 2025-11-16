import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProposalSchema, insertVoteSchema, insertBridgeTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proposal routes
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals();
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const proposal = await storage.getProposal(req.params.id);
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ error: "Failed to fetch proposal" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const validated = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(validated);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid proposal data", details: error.errors });
      }
      console.error("Error creating proposal:", error);
      res.status(500).json({ error: "Failed to create proposal" });
    }
  });

  // Vote routes
  app.post("/api/vote", async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse({
        proposalId: req.body.proposalId,
        voter: req.body.voter,
        encryptedChoice: `encrypted_${req.body.choice}_${Date.now()}`,
      });

      // Check if user has already voted
      const existingVotes = await storage.getVotesByProposal(voteData.proposalId);
      const hasVoted = existingVotes.some(v => v.voter === voteData.voter);
      
      if (hasVoted) {
        return res.status(400).json({ error: "You have already voted on this proposal" });
      }

      const vote = await storage.createVote(voteData);

      // Update proposal vote counts (mock FHE operations)
      const proposal = await storage.getProposal(voteData.proposalId);
      if (proposal) {
        const updates: any = {
          totalVoters: (proposal.totalVoters || 0) + 1, // Increment total voter count
        };
        const choice = req.body.choice?.toLowerCase();
        
        switch (choice) {
          case "for":
            updates.encryptedVotesFor = String((parseInt(proposal.encryptedVotesFor) || 0) + 1);
            break;
          case "against":
            updates.encryptedVotesAgainst = String((parseInt(proposal.encryptedVotesAgainst) || 0) + 1);
            break;
          case "abstain":
            updates.encryptedVotesAbstain = String((parseInt(proposal.encryptedVotesAbstain) || 0) + 1);
            break;
        }

        await storage.updateProposal(voteData.proposalId, updates);
      }

      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid vote data", details: error.errors });
      }
      console.error("Error creating vote:", error);
      res.status(500).json({ error: "Failed to create vote" });
    }
  });

  app.get("/api/votes/:proposalId", async (req, res) => {
    try {
      const votes = await storage.getVotesByProposal(req.params.proposalId);
      res.json(votes);
    } catch (error) {
      console.error("Error fetching votes:", error);
      res.status(500).json({ error: "Failed to fetch votes" });
    }
  });

  // Bridge transaction routes
  app.get("/api/bridge/transactions", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (address && typeof address === "string") {
        const transactions = await storage.getBridgeTransactionsByAddress(address);
        return res.json(transactions);
      }

      const transactions = await storage.getBridgeTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching bridge transactions:", error);
      res.status(500).json({ error: "Failed to fetch bridge transactions" });
    }
  });

  app.post("/api/bridge", async (req, res) => {
    try {
      const validated = insertBridgeTransactionSchema.parse(req.body);
      const transaction = await storage.createBridgeTransaction(validated);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      console.error("Error creating bridge transaction:", error);
      res.status(500).json({ error: "Failed to create bridge transaction" });
    }
  });

  app.get("/api/bridge/transactions/:id", async (req, res) => {
    try {
      const transactions = await storage.getBridgeTransactions();
      const transaction = transactions.find(tx => tx.id === req.params.id);
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.json(transaction);
    } catch (error) {
      console.error("Error fetching bridge transaction:", error);
      res.status(500).json({ error: "Failed to fetch bridge transaction" });
    }
  });

  // Wallet balance routes
  app.get("/api/wallet/:address", async (req, res) => {
    try {
      const balance = await storage.getWalletBalance(req.params.address);
      
      if (!balance) {
        // Return default encrypted balance of 0 for new wallets
        return res.json({
          address: req.params.address,
          encryptedBalance: "0",
          lastUpdated: new Date(),
        });
      }

      res.json(balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      res.status(500).json({ error: "Failed to fetch wallet balance" });
    }
  });

  app.post("/api/wallet/balance", async (req, res) => {
    try {
      const { address, encryptedBalance } = req.body;

      if (!address || !encryptedBalance) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const balance = await storage.updateWalletBalance(address, encryptedBalance);
      res.json(balance);
    } catch (error) {
      console.error("Error updating wallet balance:", error);
      res.status(500).json({ error: "Failed to update wallet balance" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
