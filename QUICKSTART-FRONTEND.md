# 🚀 Quick Start Guide

## System Status

✅ **MCP Server:** Ready (dist/index.js)  
✅ **Frontend:** Running (http://localhost:3000)  
✅ **Dependencies:** Installed (1505 packages)  

## Start the Frontend

```powershell
npm run dev:web
```

Then open: **http://localhost:3000**

## What You'll See

1. **Dashboard Header**
   - App title
   - "Connect Wallet" button

2. **Connect Your Wallet**
   - Click "Connect Wallet"
   - Select MetaMask or other wallet
   - Approve connection

3. **View Balances**
   - See your connected Ethereum address
   - Click "Fetch ETH" to get balance
   - Enter Solana address (optional) to check SOL balance

4. **Send Transactions**
   - Choose chain (ETH or SOL)
   - Enter recipient address
   - Enter amount
   - Set minimum balance condition (optional)
   - Click "Send Transaction"

5. **Activity Log**
   - See real-time operations
   - Transaction confirmations
   - Error messages

## Features Demo

### Check ETH Balance
1. Connect wallet
2. Click "Fetch ETH"
3. See balance in real-time

### Send Conditional Transaction
1. Enter recipient: `0x...`
2. Enter amount: `0.01`
3. Set min balance: `1.0`
4. Click "Send Transaction"
5. Transaction only executes if balance > 1 ETH

### Check SOL Balance
1. Enter Solana address
2. See balance automatically

## Configuration

### Required
- Ethereum RPC: Already configured (`https://eth.llamarpc.com`)
- Solana RPC: Already configured (`https://api.mainnet-beta.solana.com`)

### Optional
Add to `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

Get your project ID: https://cloud.walletconnect.com

## Troubleshooting

### Port 3000 Already in Use
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or use different port
$env:PORT=3001; npm run dev:web
```

### Wallet Not Connecting
1. Make sure MetaMask is installed
2. Refresh the page
3. Check browser console for errors

### Balance Not Loading
1. Check console for API errors
2. Verify RPC endpoints in `.env.local`
3. Try public RPC URLs

## Architecture

```
User Browser
    ↓ (HTTP)
Next.js Frontend (localhost:3000)
    ↓ (API Routes)
Blockchain APIs (ethers.js + @solana/web3.js)
    ↓ (RPC)
Ethereum & Solana Networks
```

## Key Files

- `app/page.tsx` - Main dashboard UI
- `app/api/get-eth-balance/route.ts` - ETH balance API
- `app/api/send-eth-transaction/route.ts` - ETH transaction API
- `components/WalletConnect.tsx` - Wallet connect button
- `app/providers.tsx` - Wagmi + RainbowKit setup

## Next Steps

1. ✅ Frontend is running
2. 📱 Connect your wallet
3. 💰 Check balances
4. 🚀 Send transactions
5. 📊 View activity log

## Production Deployment

### Deploy to Vercel
```powershell
npm install -g vercel
vercel login
vercel deploy
```

### Environment Variables on Vercel
Add these in Vercel dashboard:
- `ETH_RPC_URL`
- `SOL_RPC_URL`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `SUPABASE_URL` (optional)
- `SUPABASE_SERVICE_KEY` (optional)

## Support

- MCP Server docs: `PROOF.md`
- Full docs: `FRONTEND-COMPLETE.md`
- API reference: `mcp-manifest.json`

---

**Ready to use!** 🎉  
Frontend: http://localhost:3000  
Status: ✅ RUNNING
