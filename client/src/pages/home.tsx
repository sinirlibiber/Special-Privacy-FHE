import { Link } from "wouter";
import { Shield, Lock, ArrowRightLeft, Vote, Zap, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@assets/generated_images/FHE_encryption_network_hero_f51678b6.png";
import securityBadge from "@assets/generated_images/FHE_security_badge_icon_16aa26fc.png";

export default function Home() {
  const features = [
    {
      icon: Lock,
      title: "FHE Encryption",
      description: "Fully Homomorphic Encryption powered by Zama ensures your votes and balances remain private while being verifiable.",
    },
    {
      icon: Vote,
      title: "Private Governance",
      description: "Cast encrypted votes on proposals without revealing your choice until the voting period ends.",
    },
    {
      icon: ArrowRightLeft,
      title: "Cross-Chain Bridge",
      description: "Securely transfer tokens across 6+ blockchain networks with encrypted transaction amounts.",
    },
    {
      icon: Zap,
      title: "Quantum-Resistant",
      description: "Built on quantum-resistant cryptography to protect your assets from future threats.",
    },
  ];

  const stats = [
    { label: "Total Value Locked", value: "$12.5M", encrypted: true },
    { label: "Active Proposals", value: "8", encrypted: false },
    { label: "Cross-Chain Transfers", value: "2,341", encrypted: false },
    { label: "DAO Members", value: "1,247", encrypted: false },
  ];

  const supportedChains = [
    "Ethereum", "Polygon", "Arbitrum", "Optimism", "Avalanche", "BNB Chain"
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Encryption Network"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 text-center py-20 px-4">
          <Badge className="mb-6 gap-2 text-sm px-4 py-2" data-testid="badge-quantum-resistant">
            <Shield className="h-4 w-4" />
            Quantum-Resistant FHE Technology
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Privacy-Preserving
            <br />
            <span className="text-primary">Cross-Chain Governance</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience the future of decentralized governance with Zama's Fully Homomorphic Encryption. 
            Vote privately, bridge securely, govern transparently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/governance">
              <a data-testid="link-launch-governance">
                <Button size="lg" className="gap-2 text-lg px-8">
                  <Vote className="h-5 w-5" />
                  Launch Governance
                </Button>
              </a>
            </Link>
            <Link href="/bridge">
              <a data-testid="link-launch-bridge">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-lg px-8 backdrop-blur-sm bg-background/50"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                  Cross-Chain Bridge
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-card/30">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`text-3xl font-bold ${stat.encrypted ? 'font-mono' : ''} tabular-nums`}>
                    {stat.value}
                  </div>
                  {stat.encrypted && (
                    <Lock className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Built on Cutting-Edge Technology
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Leveraging Zama's FHE technology for unprecedented privacy in blockchain governance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-feature-${index}`}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-md bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Security Badge */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src={securityBadge}
                  alt="FHE Security"
                  className="w-32 h-32 object-contain"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-3">
                    Powered by Zama fhEVM
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform utilizes Zama's Fully Homomorphic Encryption Virtual Machine (fhEVM) 
                    to enable computation on encrypted data. Your votes, balances, and transactions 
                    remain private while maintaining full verifiability and trustlessness.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Supported Chains */}
      <section className="py-16 bg-card/30 border-y">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Network className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-semibold">Supported Networks</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {supportedChains.map((chain) => (
              <Badge key={chain} variant="secondary" className="text-sm px-4 py-2">
                {chain}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to Experience Private DeFi?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Connect your wallet and start participating in encrypted governance today
          </p>
          <Link href="/governance">
            <a data-testid="link-get-started">
              <Button size="lg" className="gap-2 text-lg px-8">
                Get Started
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
