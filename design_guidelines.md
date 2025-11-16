# Design Guidelines: FHE-DAO Cross-Chain Platform

## Design Approach

**Reference-Based: Linear + Uniswap Fusion**
- Combine Linear's minimal dashboard aesthetics with Uniswap's trusted DeFi patterns
- Focus on clarity and precision for complex encrypted operations
- Build trust through clean layouts and professional data visualization
- Privacy-first visual language: use subtle lock icons, shield elements, encrypted state indicators

**Core Principles:**
1. Transparency through encryption: Make invisible security visible
2. Clarity in complexity: Simplify cross-chain flows with progressive disclosure
3. Trust through polish: Professional execution builds confidence in crypto applications

---

## Layout System

**Spacing Primitives:** Use Tailwind units 2, 4, 6, 8, 12, 16, 20
- Micro spacing: p-2, gap-2 (badges, tight groupings)
- Component spacing: p-4, p-6, gap-4 (cards, form fields)
- Section spacing: p-8, py-12, py-16 (major containers)
- Generous whitespace: py-20, py-24 (landing sections)

**Grid Strategy:**
- Dashboard: Single column mobile, 2-column tablet (md:grid-cols-2), 3-column desktop (lg:grid-cols-3)
- Bridge interface: Centered single column max-w-2xl with flanking info panels on xl screens
- Stats/metrics: 2-4 column responsive grid (grid-cols-2 lg:grid-cols-4)

**Container Widths:**
- Full-width sections: w-full with max-w-7xl mx-auto px-4
- Forms/interactions: max-w-2xl centered
- Text content: max-w-prose

---

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - clean, crypto-standard readability
- Monospace: JetBrains Mono (for addresses, transaction hashes, encrypted values)

**Hierarchy:**
- Hero/Landing: text-5xl md:text-6xl font-bold tracking-tight
- Section Headers: text-3xl md:text-4xl font-semibold
- Card Titles: text-xl font-semibold
- Body: text-base leading-relaxed
- Captions/labels: text-sm uppercase tracking-wide font-medium
- Encrypted values: font-mono text-sm (distinctive treatment)
- Data displays: tabular-nums for aligned numbers

---

## Component Library

### Navigation
- Top nav: Sticky header with logo, main links, WalletConnect button (prominent)
- Wallet button: Large, accent-colored with address truncation (0x1234...5678)
- Mobile: Hamburger menu with slide-out drawer

### Dashboard Cards
- Elevated panels: rounded-xl border with subtle shadow
- Header: Icon + title + action button
- Content: Generous padding (p-6), clear visual hierarchy
- Stats: Large numbers (text-3xl font-bold) with small labels below

### Bridge Interface
- Vertical flow: Source chain → bridge icon → destination chain
- Chain selectors: Large clickable cards with chain logos
- Amount input: Oversized number input with max button
- Transaction summary: Collapsible details panel showing fees, estimated time
- Encrypted indicator: Lock icon badge showing "FHE Encrypted" status

### Form Elements
- Input fields: Rounded borders, clear focus states, helper text below
- Buttons: Primary (solid), Secondary (outline), sizes sm/md/lg
- Toggle switches: For settings, chain selections
- Dropdowns: Custom styled with search for token/chain selection

### Voting Interface
- Proposal cards: Title, description, encrypted vote counts (shown as locked)
- Vote buttons: Large choice buttons (For/Against/Abstain)
- Progress bars: Show encrypted participation (visual fill without exact numbers)
- Deadline timer: Prominent countdown display

### Transaction States
- Pending: Animated spinner with step progress (1/3, 2/3, 3/3)
- Success: Checkmark with transaction hash (monospace, copyable)
- Error: Clear error message with retry action
- All states: Encrypted badge when FHE operations involved

### Data Tables
- Responsive: Stacked cards on mobile, full table on desktop
- Headers: Bold, uppercase small text
- Rows: Hover states, clickable for details
- Transaction history: Timestamp, type, amount, status badge

---

## Images

### Hero Section (Landing)
**Large hero image:** Abstract digital encryption visualization or network nodes
- Position: Background with gradient overlay (opacity-90) for text readability
- Dimensions: Full viewport height (h-screen), centered content
- Treatment: Subtle parallax scroll effect
- Content overlay: Hero headline + subtitle + dual CTAs (Launch App / Learn More)

### Feature Illustrations
- Privacy icon graphics: Custom illustrations showing encryption, cross-chain flows
- Position: Alongside feature descriptions in 2-column layouts
- Style: Modern, geometric line art matching brand aesthetic

### Chain Logos
- Display chain icons prominently in bridge interface, dropdowns
- Size: 32px-48px for primary selections, 24px for lists
- Format: SVG for crisp rendering

---

## Special Treatments

**Encrypted State Indicators:**
- Lock icon badges: Subtle background, placed near encrypted values
- Visual distinction: Encrypted values use monospace font, slight opacity variation
- Tooltip explanations: "This value is encrypted using FHE"

**Cross-Chain Visual Flow:**
- Directional arrows: Animated subtle movement from source to destination
- Chain connection: Visual bridge/arc connecting chain selectors
- Status dots: Show transaction progression across chains

**Trust Elements:**
- Security badges: "Quantum-resistant FHE" callout
- Audit links: Footer mentions (if applicable)
- TVL/transaction volume stats: Prominent display for credibility

---

## Animation Guidelines

**Minimal, purposeful:**
- Page transitions: Subtle fade-in (200ms)
- Loading states: Spinner only, no skeleton screens
- Success confirmations: Single bounce effect
- Hover states: Smooth color transitions (150ms)
- NO: Parallax overload, constant motion, distracting effects