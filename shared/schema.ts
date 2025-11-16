import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Proposal schema for DAO voting with FHE
export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  proposer: text("proposer").notNull(), // wallet address
  status: text("status").notNull().default("active"), // active, passed, rejected
  encryptedVotesFor: text("encrypted_votes_for").notNull().default("0"), // FHE encrypted count
  encryptedVotesAgainst: text("encrypted_votes_against").notNull().default("0"),
  encryptedVotesAbstain: text("encrypted_votes_abstain").notNull().default("0"),
  totalVoters: integer("total_voters").notNull().default(0), // Public count of how many people voted
  deadline: timestamp("deadline").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
}).extend({
  deadline: z.string().transform((val) => new Date(val)),
});

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

// Vote schema - tracks individual votes (encrypted)
export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").notNull(),
  voter: text("voter").notNull(), // wallet address (kept for user's own vote retrieval, but not publicly listed)
  encryptedChoice: text("encrypted_choice").notNull(), // FHE encrypted vote choice
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  timestamp: true,
});

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

// Bridge transaction schema
export const bridgeTransactions = pgTable("bridge_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromChain: text("from_chain").notNull(),
  toChain: text("to_chain").notNull(),
  token: text("token").notNull(),
  encryptedAmount: text("encrypted_amount").notNull(), // FHE encrypted amount
  sender: text("sender").notNull(), // wallet address
  recipient: text("recipient").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, failed
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBridgeTransactionSchema = createInsertSchema(bridgeTransactions).omit({
  id: true,
  createdAt: true,
});

export type InsertBridgeTransaction = z.infer<typeof insertBridgeTransactionSchema>;
export type BridgeTransaction = typeof bridgeTransactions.$inferSelect;

// Wallet balance schema (encrypted)
export const walletBalances = pgTable("wallet_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  encryptedBalance: text("encrypted_balance").notNull(), // FHE encrypted balance
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertWalletBalanceSchema = createInsertSchema(walletBalances).omit({
  id: true,
  lastUpdated: true,
});

export type InsertWalletBalance = z.infer<typeof insertWalletBalanceSchema>;
export type WalletBalance = typeof walletBalances.$inferSelect;

// Chain configuration
export const chains = [
  { id: "zama-devnet", name: "Zama Devnet" },
  { id: "ethereum", name: "Ethereum Mainnet" },
  { id: "sepolia", name: "Sepolia Testnet" },
  { id: "base-sepolia", name: "Base Sepolia" },
  { id: "arbitrum-sepolia", name: "Arbitrum Sepolia" },
] as const;

export type ChainId = typeof chains[number]["id"];
