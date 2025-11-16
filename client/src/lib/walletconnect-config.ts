import { createAppKit } from '@reown/appkit/react';
import { mainnet, sepolia, arbitrum, base } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// Get project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

// Networks configuration (using built-in networks only for now)
const networks = [mainnet, sepolia, arbitrum, base];

// Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

// Metadata
const metadata = {
  name: 'Special Privacy FHE',
  description: 'Privacy-preserving cross-chain DAO with FHE encryption',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://special-privacy-fhe.repl.co',
  icons: []
};

// Create AppKit modal only if project ID exists
export const modal = projectId ? createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false,
    onramp: false,
    swaps: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': 'hsl(var(--primary))',
  }
}) : null;
