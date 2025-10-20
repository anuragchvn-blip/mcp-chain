# ChainMind MCP Architecture

## 🏗️ System Architecture

This project demonstrates **TWO different ways** to interact with blockchain operations:

### 1. **MCP Server** (for AI Agents like Claude Desktop)
- **Location**: `dist/index.js` (compiled from `src/index.ts`)
- **Transport**: **stdio** (standard input/output)
- **Purpose**: Allow AI agents to call blockchain tools directly
- **SDK**: `@modelcontextprotocol/sdk` (official Model Context Protocol)
- **Tools**: 5 blockchain operations
  - `get_eth_balance` - Get Ethereum balance
  - `send_eth_transaction` - Send ETH with optional conditions
  - `get_sol_balance` - Get Solana balance
  - `send_sol_transaction` - Send SOL with optional conditions
  - `multi_chain_summary` - Get balances across multiple chains

**How Claude Desktop uses it:**
```json
{
  "mcpServers": {
    "chainmind": {
      "command": "node",
      "args": ["C:/Users/Windows/mcp-chain/dist/index.js"]
    }
  }
}
```

Claude can then call tools like:
```
"Get the ETH balance for 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

---

### 2. **Web Frontend** (for Human Users)

The frontend has **TWO dashboards**:

#### A. **Wallet Dashboard** (`/`) - Traditional Web3 Interface
- **Purpose**: Connect wallet, check balances, send transactions
- **Tech**: Next.js + RainbowKit + wagmi
- **Communication**: HTTP API routes (NOT using MCP)
- **Files**:
  - `app/page.tsx` - Main wallet UI
  - `app/api/get-eth-balance/route.ts` - ETH balance API
  - `app/api/send-eth-transaction/route.ts` - ETH transaction API
  - Similar for Solana

**This is just a regular wallet interface** - it does NOT communicate with the MCP server!

#### B. **MCP Dashboard** (`/mcp-dashboard`) - Real MCP Client
- **Purpose**: Directly communicate with MCP server using official protocol
- **Tech**: MCP SDK Client + stdio transport
- **Communication**: **Directly calls MCP server via stdio**
- **Files**:
  - `app/mcp-dashboard/page.tsx` - MCP UI
  - `lib/mcpClient.ts` - MCP Client wrapper
  - `app/api/mcp/route.ts` - Proxy API that spawns MCP server

**This is a real MCP client** - it demonstrates the same protocol Claude Desktop uses!

---

## 🔌 How MCP Communication Works

### Traditional Wallet Dashboard Flow:
```
Browser → HTTP Request → Next.js API Route → ethers.js/Solana Web3
```

### MCP Dashboard Flow:
```
Browser → HTTP Request → Next.js API Route → MCP Client (stdio) → MCP Server → ethers.js/Solana Web3
```

### Claude Desktop Flow:
```
Claude → MCP Client (stdio) → MCP Server → ethers.js/Solana Web3
```

---

## 📁 Project Structure

```
mcp-chain/
├── src/
│   └── index.ts              # MCP Server (stdio transport)
├── dist/
│   └── index.js              # Compiled MCP Server
├── app/
│   ├── page.tsx              # Wallet Dashboard (NO MCP)
│   ├── mcp-dashboard/
│   │   └── page.tsx          # MCP Dashboard (YES MCP!)
│   ├── api/
│   │   ├── mcp/
│   │   │   └── route.ts      # MCP proxy API
│   │   ├── get-eth-balance/  # Direct blockchain APIs
│   │   └── send-eth-transaction/
├── lib/
│   ├── mcpClient.ts          # MCP Client wrapper
│   └── supabaseClient.ts     # Transaction logging
└── components/
    └── WalletConnect.tsx     # Wallet UI component
```

---

## 🚀 Usage

### For AI Agents (Claude Desktop):
1. Build MCP server: `npm run build:server`
2. Configure Claude Desktop config
3. Ask Claude to use blockchain tools

### For Human Users (Wallet Dashboard):
1. Start frontend: `npm run dev:web`
2. Visit http://localhost:3000
3. Connect wallet with RainbowKit
4. **This does NOT use MCP server!**

### For Developers (MCP Dashboard):
1. Start frontend: `npm run dev:web`
2. Visit http://localhost:3000/mcp-dashboard
3. **This DOES use MCP server via stdio!**
4. Select tools and see real MCP communication

---

## 🎯 Key Differences

| Feature | Wallet Dashboard | MCP Dashboard | Claude Desktop |
|---------|-----------------|---------------|----------------|
| Uses MCP Protocol | ❌ No | ✅ Yes | ✅ Yes |
| Transport | HTTP | stdio (via proxy) | stdio (direct) |
| SDK | wagmi/ethers | @modelcontextprotocol/sdk | @modelcontextprotocol/sdk |
| Purpose | Human wallet UI | Demo MCP protocol | AI agent tools |
| Blockchain Library | ethers.js direct | ethers.js via MCP | ethers.js via MCP |

---

## 💡 Why Two Dashboards?

1. **Wallet Dashboard** - Shows traditional Web3 wallet integration
2. **MCP Dashboard** - Demonstrates how the SAME tools work via MCP protocol

Both use the same blockchain libraries (ethers.js, @solana/web3.js), but:
- Wallet Dashboard = Direct access
- MCP Dashboard = Access via Model Context Protocol
- Claude Desktop = Same as MCP Dashboard but for AI agents

---

## 🔧 Technical Details

### MCP Server (stdio transport):
```typescript
// src/index.ts
const transport = new StdioServerTransport();
await server.connect(transport);
```

### MCP Client (stdio transport):
```typescript
// lib/mcpClient.ts
const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/index.js'],
});
await client.connect(transport);
```

### Direct Blockchain Access:
```typescript
// app/api/get-eth-balance/route.ts
const ethProvider = new ethers.JsonRpcProvider(ETH_RPC_URL);
const balance = await ethProvider.getBalance(address);
```

---

## 📊 Summary

**You wanted to see MCP server in action!** 

- **Wallet Dashboard** (`/`) = Traditional Web3 (NO MCP)
- **MCP Dashboard** (`/mcp-dashboard`) = Real MCP Protocol (YES MCP!)

Visit `/mcp-dashboard` to see the **real MCP server communication** with:
- Tool discovery via `listTools()`
- Tool execution via `callTool()`
- stdio transport (same as Claude Desktop)
- Official @modelcontextprotocol/sdk

This demonstrates the **same protocol Claude Desktop uses** to communicate with MCP servers!
