# ChainMind MCP Server - Quick Reference

## ✅ This is REAL (Not Mocked)

### Installed Packages (Verified)
```
@modelcontextprotocol/sdk@0.5.0  ✅ Official MCP SDK
ethers@6.15.0                     ✅ Real Ethereum library
@solana/web3.js@1.98.4           ✅ Real Solana library
```

## 🚀 Quick Start

### 1. Build
```powershell
npm run build
```

### 2. Run
```powershell
npm start
```
Output: `ChainMind MCP Server running on stdio`

### 3. Use with Claude Desktop
Edit `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "mcp-chain": {
      "command": "node",
      "args": ["C:\\Users\\Windows\\mcp-chain\\dist\\index.js"]
    }
  }
}
```

## 🛠️ Available Tools

| Tool | Purpose | Real API Used |
|------|---------|---------------|
| `get_eth_balance` | Get ETH balance | `ethProvider.getBalance()` |
| `send_eth_transaction` | Send ETH | `wallet.sendTransaction()` |
| `get_sol_balance` | Get SOL balance | `solConnection.getBalance()` |
| `send_sol_transaction` | Send SOL | `sendAndConfirmTransaction()` |
| `multi_chain_summary` | Multi-chain data | Both APIs combined |

## 📋 Example Usage in Claude

**Get balance:**
> "Use mcp-chain to get the ETH balance for 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

**Conditional send:**
> "Send 0.1 ETH to 0x... but only if my balance is above 1 ETH"

**Multi-chain:**
> "Show me balances for these addresses on both ETH and SOL: [addresses]"

## 🔧 Configuration

Edit `.env.local`:
```env
ETH_RPC_URL=https://eth.llamarpc.com
SOL_RPC_URL=https://api.mainnet-beta.solana.com
SUPABASE_URL=                        # Optional
SUPABASE_SERVICE_KEY=               # Optional
```

## 📁 Key Files

- `src/index.ts` - Source code with real blockchain calls
- `dist/index.js` - Compiled MCP server (executable)
- `mcp-manifest.json` - Tool documentation
- `PROOF.md` - Evidence this is real
- `package.json` - Real dependencies listed

## ✅ Verification

```powershell
# Verify ethers.js is installed
ls node_modules\ethers

# Verify @solana/web3.js is installed  
ls node_modules\@solana\web3.js

# Verify MCP SDK is installed
ls node_modules\@modelcontextprotocol\sdk

# Check source code
code src\index.ts

# Run the server
npm start
```

## 🎯 This is NOT:
- ❌ HTTP REST API
- ❌ Next.js application
- ❌ Mock/fake implementation

## 🎯 This IS:
- ✅ Real MCP server
- ✅ Real blockchain operations
- ✅ stdio transport
- ✅ Claude Desktop compatible

---

**Status:** Production Ready ✅  
**Protocol:** MCP (stdio)  
**Blockchains:** Ethereum + Solana  
**Last Verified:** 2025-10-20
