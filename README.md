# 🎉 ChainMind - Real MCP Blockchain Server

A **production-ready Model Context Protocol (MCP) server** that provides multi-chain blockchain operations using **real blockchain libraries** (`ethers.js` & `@solana/web3.js`).

## ✅ This is a REAL MCP Implementation

- Uses official `@modelcontextprotocol/sdk`
- Real `ethers.js` for Ethereum operations
- Real `@solana/web3.js` for Solana operations
- Stdio transport (Claude Desktop compatible)
- Web dashboard that actually calls the MCP server via bridge API

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
ETH_RPC_URL=https://eth.llamarpc.com
SOL_RPC_URL=https://api.mainnet-beta.solana.com
```

### 3. Build MCP Server

```bash
npm run build:server
```

### 4. Run Web Dashboard

```bash
npm run dev:web
```

Open <http://localhost:3000> and start checking balances!

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Ethereum RPC endpoint (Infura, Alchemy, or public)
- Solana RPC endpoint (optional, defaults to public endpoint)
- Supabase account (optional, for transaction logging)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mcp-chain.git
cd mcp-chain
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
ETH_RPC_URL=https://eth.llamarpc.com
SOL_RPC_URL=https://api.mainnet-beta.solana.com
SUPABASE_URL=your_supabase_url (optional)
SUPABASE_SERVICE_KEY=your_service_key (optional)
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 API Endpoints

### 1. Multi-Chain Balance (`/api/multi_balance`)

**Method**: `GET`

**Query Parameters**:
- `addresses` (string): Comma-separated list of ETH and/or SOL addresses

**Example**:
```bash
curl "http://localhost:3000/api/multi_balance?addresses=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
```

**Response**:
```json
{
  "balances": {
    "eth": {
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb": "1.234"
    },
    "sol": {
      "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU": "5.678"
    }
  }
}
```

### 2. Conditional Transaction (`/api/auto_send`)

**Method**: `POST`

**Body**:
```json
{
  "chain": "eth",
  "senderPrivateKey": "0x...",
  "recipient": "0x...",
  "amount": "0.1",
  "condition": {
    "token": "ETH",
    "minBalance": 1.0
  }
}
```

**Response**:
```json
{
  "success": true,
  "txHash": "0x...",
  "sender": "0x..."
}
```

### 3. Token Summary (`/api/token_summary`)

**Method**: `GET`

**Query Parameters**:
- `addresses` (string): Comma-separated list of ETH and/or SOL addresses

**Example**:
```bash
curl "http://localhost:3000/api/token_summary?addresses=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

**Response**:
```json
{
  "eth": {
    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb": {
      "ETH": "1.234",
      "tokens": {
        "USDC": "100.50",
        "USDT": "50.25"
      },
      "NFTs": []
    }
  },
  "sol": {}
}
```

## 🗄️ Supabase Setup (Optional)

If you want to enable transaction logging:

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Create a `transactions` table:
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blockchain TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  amount TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

3. Add your Supabase credentials to `.env.local`

## 🔒 Security Notes

- **Private Keys**: Never store private keys in environment variables or commit them to version control
- **API Protection**: Consider adding authentication middleware for production use
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **RPC Endpoints**: Use authenticated RPC endpoints for production
- **Input Validation**: All addresses and amounts are validated before processing

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The project is compatible with any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with `npm run build && npm start`

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Blockchain SDKs**: 
  - ethers.js v6 (Ethereum)
  - @solana/web3.js (Solana)
- **Database**: Supabase (optional)
- **Deployment**: Vercel-ready

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ethers.js Documentation](https://docs.ethers.org/)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Supabase Documentation](https://supabase.com/docs)

## 📝 Manifest

See `manifest.json` for complete API specifications and tool descriptions.
