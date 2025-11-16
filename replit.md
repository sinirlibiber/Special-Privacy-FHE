# Stargate FHE DAO

## Overview

Stargate FHE DAO is a privacy-preserving cross-chain decentralized autonomous organization that leverages Zama's Fully Homomorphic Encryption (FHE) technology. The application enables users to:

- Cast encrypted votes on DAO proposals where voting choices remain private until the voting period ends
- Transfer tokens across multiple blockchain networks (Ethereum, Polygon, Arbitrum, Optimism, Avalanche, BNB Chain) with encrypted transaction amounts
- Manage encrypted wallet balances that remain private while still being verifiable
- Connect Web3 wallets seamlessly through WalletConnect integration

The system is built with quantum-resistant cryptography to ensure long-term security of user data and transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI & Styling:**
- Tailwind CSS as the utility-first CSS framework
- Shadcn/ui component library built on Radix UI primitives for accessible, composable components
- Custom design system inspired by Linear and Uniswap aesthetics (defined in design_guidelines.md)
- Dark mode support with theme persistence via localStorage
- Google Fonts: Inter for primary text, JetBrains Mono for addresses and encrypted values

**State Management:**
- React Context API for global wallet connection state (WalletProvider)
- React Context for theme management (ThemeProvider)
- TanStack Query for server data caching with infinite staleTime to reduce refetching

**Web3 Integration:**
- Custom WalletProvider context manages wallet connection state
- Direct integration with window.ethereum (MetaMask/injected wallets)
- localStorage persistence for wallet addresses
- Event listeners for account changes

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js for the REST API server
- TypeScript for end-to-end type safety
- ESM module system

**Data Layer:**
- In-memory storage implementation (MemStorage class) for development
- Database schema defined using Drizzle ORM with PostgreSQL dialect
- Ready for migration to PostgreSQL via Drizzle Kit migrations
- Shared schema definitions between client and server via @shared namespace

**API Design:**
- RESTful API endpoints under `/api` prefix
- Zod validation for request payloads using schemas derived from Drizzle tables
- Consistent error handling with appropriate HTTP status codes
- Request/response logging middleware for debugging

**Data Models:**
- **Proposals**: DAO governance proposals with encrypted vote tallies (for/against/abstain)
- **Votes**: Individual encrypted vote records linked to proposals
- **Bridge Transactions**: Cross-chain transfer records with encrypted amounts
- **Wallet Balances**: Per-address encrypted balance storage

### Encryption & Privacy

**FHE Integration Strategy:**
- All sensitive data (votes, transaction amounts, balances) stored as encrypted text fields
- Client-side encryption before data transmission (Zama FHE SDK integration expected)
- Server stores encrypted ciphertexts without ability to decrypt
- Homomorphic operations allow computation on encrypted data without revealing plaintext

**Privacy-Preserving Features:**
- Vote choices encrypted until proposal deadline passes
- Bridge transaction amounts hidden from observers
- Wallet balances viewable only by owner with decryption key

### Cross-Chain Bridge

**Architecture:**
- Multi-network support for 6+ EVM-compatible chains
- Transaction status tracking (pending, completed, failed)
- Chain-specific parameters defined in shared schema (chain names, icons, native tokens)
- Encrypted amount fields for privacy-preserving transfers

**Design Pattern:**
- Inspired by LayerZero's cross-chain messaging approach
- Status-based transaction lifecycle management
- User address tracking for transaction history queries

## External Dependencies

### Blockchain & Crypto Libraries

- **Zama FHE SDK**: Fully Homomorphic Encryption library for privacy-preserving computations (planned integration)
- **Ethers.js**: Ethereum library for wallet interactions and smart contract communication
- **WalletConnect v1**: Multi-wallet connection protocol for Web3 wallet support

### Database & ORM

- **Drizzle ORM**: TypeScript ORM for PostgreSQL with type-safe query builder
- **@neondatabase/serverless**: Serverless PostgreSQL driver for production deployment
- **Drizzle Kit**: Migration tool for schema management and database pushes

### UI Component Libraries

- **Radix UI**: Headless UI primitives for 20+ accessible components (dialogs, dropdowns, tooltips, etc.)
- **class-variance-authority (CVA)**: Component variant styling system
- **cmdk**: Command menu component (Cmd+K style search)
- **react-day-picker**: Calendar/date picker component
- **embla-carousel-react**: Carousel component
- **recharts**: Chart visualization library
- **vaul**: Drawer component for mobile interfaces

### Form Management & Validation

- **React Hook Form**: Performant form state management
- **@hookform/resolvers**: Resolver adapters for validation libraries
- **Zod**: Runtime validation and TypeScript type inference
- **drizzle-zod**: Automatic Zod schema generation from Drizzle tables

### Development Tools

- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Static type checking across entire codebase
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **esbuild**: Fast JavaScript bundler for server-side code

### Deployment & Hosting

- **Replit**: Development platform with integrated deployment
- Custom Vite plugins for Replit integration (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)

### Path Aliases

- `@/`: Maps to client/src/ for frontend imports
- `@shared/`: Maps to shared/ for shared type definitions
- `@assets/`: Maps to attached_assets/ for static resources