import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { modal } from "./walletconnect-config";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  connectQR: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Wagmi hooks for WalletConnect
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  useEffect(() => {
    // Sync with Wagmi state (WalletConnect)
    if (wagmiConnected && wagmiAddress) {
      setAddress(wagmiAddress);
      setIsConnected(true);
      localStorage.setItem("walletAddress", wagmiAddress);
      localStorage.setItem("walletType", "walletconnect");
      return;
    }

    // Check if wallet was previously connected (browser extension)
    const savedAddress = localStorage.getItem("walletAddress");
    const walletType = localStorage.getItem("walletType");
    
    if (savedAddress && walletType === "browser" && window.ethereum) {
      setAddress(savedAddress);
      setIsConnected(true);
    }

    // Listen for account changes (browser extension)
    if (window.ethereum) {
      window.ethereum.on?.("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          const newAddress = accounts[0];
          setAddress(newAddress);
          setIsConnected(true);
          localStorage.setItem("walletAddress", newAddress);
          localStorage.setItem("walletType", "browser");
        }
      });
    }
  }, [wagmiAddress, wagmiConnected]);

  // Connect with browser extension (MetaMask, etc.)
  const connect = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: "eth_requestAccounts" 
        });
        
        if (accounts && accounts.length > 0) {
          const userAddress = accounts[0];
          setAddress(userAddress);
          setIsConnected(true);
          localStorage.setItem("walletAddress", userAddress);
          localStorage.setItem("walletType", "browser");
        }
      } else {
        // Fallback to WalletConnect if no browser extension
        await connectQR();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  // Connect with WalletConnect (QR code)
  const connectQR = async () => {
    try {
      if (modal) {
        await modal.open();
      } else {
        throw new Error("WalletConnect is not configured. Please set VITE_WALLETCONNECT_PROJECT_ID.");
      }
    } catch (error) {
      console.error("Failed to connect via WalletConnect:", error);
      throw error;
    }
  };

  const disconnect = () => {
    // Disconnect browser extension
    setAddress(null);
    setIsConnected(false);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletType");

    // Disconnect WalletConnect
    if (wagmiConnected) {
      wagmiDisconnect();
    }
  };

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, connectQR, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
