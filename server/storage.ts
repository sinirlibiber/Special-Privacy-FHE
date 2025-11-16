import {
  type Proposal,
  type InsertProposal,
  type Vote,
  type InsertVote,
  type BridgeTransaction,
  type InsertBridgeTransaction,
  type WalletBalance,
  type InsertWalletBalance,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Proposal methods
  getProposals(): Promise<Proposal[]>;
  getProposal(id: string): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined>;

  // Vote methods
  getVotesByProposal(proposalId: string): Promise<Vote[]>;
  createVote(vote: InsertVote): Promise<Vote>;

  // Bridge transaction methods
  getBridgeTransactions(): Promise<BridgeTransaction[]>;
  getBridgeTransactionsByAddress(address: string): Promise<BridgeTransaction[]>;
  createBridgeTransaction(transaction: InsertBridgeTransaction): Promise<BridgeTransaction>;
  updateBridgeTransaction(id: string, updates: Partial<BridgeTransaction>): Promise<BridgeTransaction | undefined>;

  // Wallet balance methods
  getWalletBalance(address: string): Promise<WalletBalance | undefined>;
  updateWalletBalance(address: string, encryptedBalance: string): Promise<WalletBalance>;
}

export class MemStorage implements IStorage {
  private proposals: Map<string, Proposal>;
  private votes: Map<string, Vote>;
  private bridgeTransactions: Map<string, BridgeTransaction>;
  private walletBalances: Map<string, WalletBalance>;

  constructor() {
    this.proposals = new Map();
    this.votes = new Map();
    this.bridgeTransactions = new Map();
    this.walletBalances = new Map();
  }

  // Proposal methods
  async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProposal(id: string): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const proposal: Proposal = {
      ...insertProposal,
      id,
      createdAt: new Date(),
      deadline: new Date(insertProposal.deadline),
      status: insertProposal.status || "active",
      encryptedVotesFor: insertProposal.encryptedVotesFor || "0",
      encryptedVotesAgainst: insertProposal.encryptedVotesAgainst || "0",
      encryptedVotesAbstain: insertProposal.encryptedVotesAbstain || "0",
      totalVoters: 0,
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) return undefined;

    const updated = { ...proposal, ...updates };
    this.proposals.set(id, updated);
    return updated;
  }

  // Vote methods
  async getVotesByProposal(proposalId: string): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      (vote) => vote.proposalId === proposalId
    );
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const vote: Vote = {
      ...insertVote,
      id,
      timestamp: new Date(),
    };
    this.votes.set(id, vote);
    return vote;
  }

  // Bridge transaction methods
  async getBridgeTransactions(): Promise<BridgeTransaction[]> {
    return Array.from(this.bridgeTransactions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBridgeTransactionsByAddress(address: string): Promise<BridgeTransaction[]> {
    return Array.from(this.bridgeTransactions.values())
      .filter((tx) => tx.sender === address || tx.recipient === address)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBridgeTransaction(insertTransaction: InsertBridgeTransaction): Promise<BridgeTransaction> {
    const id = randomUUID();
    const transaction: BridgeTransaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
      txHash: null,
      status: insertTransaction.status || "pending",
    };
    this.bridgeTransactions.set(id, transaction);

    // Simulate transaction confirmation after 2 seconds
    setTimeout(() => {
      const tx = this.bridgeTransactions.get(id);
      if (tx) {
        tx.status = "confirmed";
        tx.txHash = `0x${randomUUID().replace(/-/g, '')}`;
        this.bridgeTransactions.set(id, tx);
      }
    }, 2000);

    return transaction;
  }

  async updateBridgeTransaction(id: string, updates: Partial<BridgeTransaction>): Promise<BridgeTransaction | undefined> {
    const transaction = this.bridgeTransactions.get(id);
    if (!transaction) return undefined;

    const updated = { ...transaction, ...updates };
    this.bridgeTransactions.set(id, updated);
    return updated;
  }

  // Wallet balance methods
  async getWalletBalance(address: string): Promise<WalletBalance | undefined> {
    return this.walletBalances.get(address);
  }

  async updateWalletBalance(address: string, encryptedBalance: string): Promise<WalletBalance> {
    const existing = this.walletBalances.get(address);
    if (existing) {
      const updated: WalletBalance = {
        ...existing,
        encryptedBalance,
        lastUpdated: new Date(),
      };
      this.walletBalances.set(address, updated);
      return updated;
    }

    const id = randomUUID();
    const balance: WalletBalance = {
      id,
      address,
      encryptedBalance,
      lastUpdated: new Date(),
    };
    this.walletBalances.set(address, balance);
    return balance;
  }
}

export const storage = new MemStorage();
