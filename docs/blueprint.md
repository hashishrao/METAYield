# **App Name**: METAYield

## Core Features:

- Wallet Connection: Connect a MetaMask wallet to the app using MetaMask SDK, with auto-network detection (Linea preferred) and contract/token approval prompts.
- Yield Dashboard: Display the user’s staked crypto assets (ETH, WETH, USDC) and their associated yields from protocols like Aave or Compound, along with projected monthly income.
- Spending Amount Input: Specify a USDC credit card spending amount to be auto-repaid based on expected yield, with dynamic feedback on repayment feasibility.
- AI Auto-Repayment Engine: AI-powered tool that analyzes current and projected yield data to calculate, schedule, and execute auto-repayments. Supports user-defined strategies (e.g., conservative, balanced, aggressive).
- Transaction History Display: Visualize repayment status, staking activity, and transaction logs in an easy-to-read timeline format, with success/failure indicators.
- Real-time Notifications: Alert users when auto-repayment transactions are executed, when yield thresholds are reached, or when yield is insufficient to cover repayments.
- Repayment Attestation (Verax): Generate on-chain attestations for successful repayments using Verax, enabling users to unlock badges, rewards, or benefits across integrated platforms.
- USDC Flow via Circle CCTP: Use Circle’s Cross-Chain Transfer Protocol (CCTP) to ensure efficient, native USDC flows across chains for repayments and credit management.

## Style Guidelines:

- Navbar / Highlights: #006D6D Branding & primary accent
- CTA Buttons / Links: #00BFD6 Calls to Action, hover states
- Page Background: #EAEFF2 App shell or base container
- Cards / Widgets: #FFFFFF With soft shadow for depth
- Positive Status: #34D399 Repayment success, staking
- Negative Status: #EF4444 Insufficient yield, error
- Body and headline font: 'Inter' (sans-serif) for a modern and neutral appearance.
- Use minimalist icons representing DeFi, credit cards, and yield generation.
- A card-based layout for intuitive access to account and repayment info.
- Smooth transitions and loading animations for a seamless user experience.