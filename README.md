# Folio — LibraryManagement dApp

Solidity + Next.js app for on-chain library lending ("Folio"). Users register a borrower profile, list books, borrow available copies, return active loans, and track points. The contract stays `LibraryManagement`; Folio is the product name across the frontend.

## Workspaces

- `hardhat/` - Hardhat 3 contract workspace for `LibraryManagement.sol`.
- `frontend/` - Next.js 16 app router frontend with RainbowKit, wagmi, viem, and Tailwind 4.

## Contract commands

```powershell
cd hardhat
npm run compile
npm run deploy
npm run deploy:sepolia
npm run node
```

Create `hardhat/.env` from `.env.example` when deploying to Sepolia:

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

`DEPLOYER_PRIVATE_KEY` must be a funded private key for the target network. Never commit real keys.

## Frontend commands

```powershell
cd frontend
npm run dev
npm run lint
npm run build
```

Create `frontend/.env.local` from `.env.example`:

```env
NEXT_PUBLIC_LIBRARY_ADDRESS=0xYourDeployedContract
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

The app defaults to Sepolia and also includes local Hardhat chain support. If the contract address is missing or zero, the UI renders setup guidance instead of attempting writes.

## Manual flow

1. Deploy `LibraryManagement` and copy the address into `frontend/.env.local`.
2. Connect a wallet on the matching chain.
3. Register a profile under Profile.
4. List a book from List book.
5. Borrow from Browse.
6. Return from Profile.
7. Manage owned listings under My listings.

