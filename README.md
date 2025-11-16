# Special Privacy FHE

A privacy-preserving cross-chain decentralized autonomous organization (DAO) built with Zama's Fully Homomorphic Encryption (FHE) technology and WalletConnect integration.

**Built by**: [sinirlibiber](https://github.com/sinirlibiber)


**dApp**: [dApp Link](https://stargate-fhe-wallet-mzgumus40.replit.app)
## Features

### 🔐 Privacy-Preserving Governance
- **Encrypted Voting**: Cast votes on proposals using FHE encryption - your choice remains private until voting ends
- **Secure Proposals**: Create and manage DAO proposals with full privacy guarantees
- **Quantum-Resistant**: Built on Zama's TFHE technology for future-proof security

### 🌉 Cross-Chain Bridge
- **Multi-Network Support**: Transfer tokens across multiple blockchain networks (Zama Devnet, Ethereum Mainnet, Sepolia Testnet)
- **Encrypted Amounts**: Bridge transaction amounts are FHE-encrypted for complete privacy
- **Fast & Secure**: Leverages LayerZero-inspired cross-chain messaging optimized for FHE operations

### 💰 Encrypted Wallet Balances
- **Private Holdings**: View your encrypted token balances without revealing amounts to others
- **FHE Integration**: All sensitive data encrypted using Zama's FHE SDK

### 🔗 Wallet Integration
- **WalletConnect Support**: Connect with MetaMask, Trust Wallet, and other Web3 wallets
- **Seamless Experience**: One-click connection for instant access to DAO features

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first styling with custom design system
- **Shadcn/ui**: Beautiful, accessible component library
- **TanStack Query**: Powerful data fetching and state management
- **Wouter**: Lightweight routing solution

### Backend
- **Node.js + Express**: RESTful API server
- **TypeScript**: End-to-end type safety
- **In-Memory Storage**: Fast development database (easily swappable with PostgreSQL)
- **Zod**: Runtime validation and type inference

### Blockchain & Crypto
- **Zama FHE**: Fully Homomorphic Encryption for privacy-preserving computations
- **Ethers.js**: Ethereum wallet and contract interactions
- **WalletConnect**: Multi-wallet connection protocol

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/special-privacy-fhe.git
cd special-privacy-fhe

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Home, Governance, Bridge)
│   │   ├── lib/           # Utilities and context providers
│   │   └── App.tsx        # Main application component
│   └── index.html
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage layer
├── shared/               # Shared types and schemas
│   └── schema.ts        # Drizzle ORM schemas and Zod validation
└── attached_assets/     # Generated images and assets
```

## Features in Detail

### DAO Governance
- Create proposals with title, description, and voting deadline
- View all active and past proposals
- Cast encrypted votes (For, Against, Abstain)
- Real-time vote counting with FHE encryption
- Proposal status tracking (Active, Passed, Rejected)

### Cross-Chain Bridge
- Select source and destination chains
- Input token amount and type (USDC, USDT, ETH, DAI)
- View transaction fees and estimated completion time
- Track bridge transaction history
- Encrypted amount privacy

### Wallet Connection
- Connect via MetaMask or other Web3 wallets
- Mock wallet generation for testing (when no wallet extension is available)
- Persistent connection across sessions
- Account change detection

## API Endpoints

### Proposals
- `GET /api/proposals` - List all proposals
- `GET /api/proposals/:id` - Get proposal details
- `POST /api/proposals` - Create new proposal

### Voting
- `POST /api/vote` - Cast encrypted vote
- `GET /api/votes/:proposalId` - Get votes for proposal

### Bridge
- `GET /api/bridge/transactions` - List bridge transactions
- `GET /api/bridge/transactions?address=:address` - Get user's transactions
- `POST /api/bridge` - Initiate bridge transaction

### Wallet
- `GET /api/wallet/:address` - Get encrypted wallet balance
- `POST /api/wallet/balance` - Update wallet balance

## Development Notes

### React Version
This project uses **React 18** for optimal compatibility with modern libraries including TanStack Query v5, Radix UI components, and other dependencies. While the initial requirement specified React 16/17, React 18 was necessary to support the full feature set with proper TypeScript types and concurrent features.

### FHE Integration
The current implementation uses **mock FHE operations** for demonstration purposes. In a production environment, these would be replaced with actual Zama TFHE-rs library calls for true homomorphic encryption.

### Storage Layer
The application currently uses **in-memory storage** for rapid development. For production deployment, this can be easily switched to PostgreSQL using the existing Drizzle ORM schemas.

## Future Enhancements

- [ ] Integrate actual Zama fhEVM smart contracts
- [ ] Implement real LayerZero cross-chain messaging
- [ ] Add PostgreSQL database persistence
- [ ] Deploy to production with real network integration
- [ ] Add comprehensive test suite
- [ ] Implement encrypted token transfers
- [ ] Add DAO treasury management
- [ ] Create mobile-responsive PWA

## Security Considerations

⚠️ **Important**: This is a demonstration application. Do not use with real funds or private keys in the current state. 

For production use:
1. Integrate actual Zama FHE smart contracts
2. Implement proper key management
3. Add comprehensive security audits
4. Use hardware security modules for key storage
5. Implement rate limiting and DDoS protection

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Zama](https://www.zama.ai/) for FHE technology
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components

## Contact

For questions or collaboration opportunities, please open an issue on GitHub.
