# ChainMind Real-Time Blockchain MCP Server

A **real Model Context Protocol (MCP) server** providing multi-chain blockchain operations for AI agents and LLMs. Built with the official `@modelcontextprotocol/sdk`, `ethers.js`, and `@solana/web3.js`.

## 🚀 This is a REAL MCP Server

- ✅ Uses official `@modelcontextprotocol/sdk`
- ✅ Real blockchain operations (not mocked HTTP APIs)
- ✅ Works with Claude Desktop, MCP clients, and AI agents
- ✅ Real-time execution using actual RPC providers
- ✅ stdio transport for direct MCP communication

## 📦 Installation

```bash
npm install
npm run build
```

## 🔧 Configuration

Create `.env.local`:

```env
ETH_RPC_URL=https://eth.llamarpc.com
SOL_RPC_URL=https://api.mainnet-beta.solana.com

# Optional Supabase logging
SUPABASE_URL=your_url_here
SUPABASE_SERVICE_KEY=your_key_here
```

## 🎯 Available MCP Tools

### 1. `get_eth_balance`
Get Ethereum balance for any address.

**Input:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Output:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "balance": "1.234567",
  "balanceWei": "1234567000000000000",
  "chain": "ethereum"
}
```

### 2. `send_eth_transaction`
Send ETH with optional conditional execution.

**Input:**
```json
{
  "privateKey": "0x...",
  "recipient": "0x...",
  "amount": "0.1",
  "minBalance": 1.0
}
```

### 3. `get_sol_balance`
Get Solana balance for any address.

**Input:**
```json
{
  "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}
```

### 4. `send_sol_transaction`
Send SOL with optional conditional execution.

**Input:**
```json
{
  "privateKey": "[1,2,3,...]",
  "recipient": "...",
  "amount": "0.5",
  "minBalance": 2.0
}
```

### 5. `multi_chain_summary`
Get balances across multiple chains.

**Input:**
```json
{
  "addresses": ["0x...", "7xKX..."]
}
```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### With Claude Desktop

Add to your Claude Desktop MCP configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mcp-chain": {
      "command": "node",
      "args": ["C:\\Users\\Windows\\mcp-chain\\dist\\index.js"],
      "env": {
        "ETH_RPC_URL": "https://eth.llamarpc.com",
        "SOL_RPC_URL": "https://api.mainnet-beta.solana.com"
      }
    }
  }
}
```

## 🔍 How It Works

1. **MCP Protocol**: Server communicates via stdio using official MCP SDK
2. **Real Blockchain Calls**: Uses ethers.js and @solana/web3.js to interact with real networks
3. **No Mocking**: All operations execute against live RPC endpoints
4. **Tool Registration**: Tools are registered with MCP and callable by AI agents
5. **Transaction Logging**: Optional Supabase integration for audit trails

## 📡 Architecture

```
AI Agent (Claude/LLM)
    ↓ (MCP Protocol via stdio)
ChainMind MCP Server
    ↓ (RPC calls)
Blockchain Networks (ETH/SOL)
    ↓ (optional)
Supabase (transaction logs)
```

## 🛡️ Security

- Private keys handled in-memory only
- No storage of sensitive data
- Validate all inputs before execution
- Optional transaction logging to Supabase
- Use secure RPC endpoints in production

## 📚 Tech Stack

- **MCP SDK**: `@modelcontextprotocol/sdk` (official)
- **Ethereum**: `ethers.js` v6
- **Solana**: `@solana/web3.js`
- **Database**: Supabase (optional)
- **Runtime**: Node.js + TypeScript

## 🧪 Testing

After building, test individual tools:

```bash
# The server runs on stdio, so testing requires an MCP client
# Use Claude Desktop or another MCP-compatible client
```

## 📄 License

MIT

## 🤝 Contributing

This is a real MCP server implementation. Contributions welcome!
