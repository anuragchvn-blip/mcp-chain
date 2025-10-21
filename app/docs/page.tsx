'use client';

import Link from 'next/link';
import { useState } from 'react';

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
# Getting Started with ChainMind

ChainMind is a production-ready Model Context Protocol (MCP) server that enables AI agents to interact with Ethereum and Solana blockchains.

## Quick Start

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/yourusername/mcp-chain.git
cd mcp-chain

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your RPC endpoints

# 4. Build the MCP server
npm run build:server

# 5. Run the web dashboard
npm run dev:web
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

## Environment Variables

\`\`\`env
ETH_RPC_URL=https://eth.llamarpc.com
SOL_RPC_URL=https://api.mainnet-beta.solana.com
SUPABASE_URL=your_supabase_url (optional)
SUPABASE_SERVICE_KEY=your_service_key (optional)
\`\`\`
`
  },
  {
    id: 'architecture',
    title: 'Architecture',
    content: `
# Architecture Overview

ChainMind uses a bridge architecture to connect browser-based frontends to the MCP server.

## Components

### 1. MCP Server (stdio)
- **Location:** \`dist/index.js\`
- **Transport:** stdio (stdin/stdout)
- **SDK:** @modelcontextprotocol/sdk
- **Compatible with:** Claude Desktop, any MCP client

### 2. Web Dashboard (HTTP)
- **Location:** \`app/dashboard/page.tsx\`
- **Framework:** Next.js 14
- **Features:** Wallet connect, balance checking, transactions

### 3. MCP Bridge API
- **Location:** \`app/api/mcp-bridge/route.ts\`
- **Purpose:** Converts HTTP requests to MCP stdio calls
- **How:** Spawns MCP server as child process

## Data Flow

\`\`\`
Browser → /api/mcp-bridge → MCP Server (stdio) → ethers.js/Solana → Blockchain RPC
        ← JSON response ← JSON-RPC ← Balance/TX data ← 
\`\`\`

## Why This Architecture?

- **MCP servers use stdio** - They can't be called directly from browsers
- **Bridge API solves this** - Spawns server, handles communication
- **Best of both worlds** - Web UI + MCP compatibility
`
  },
  {
    id: 'mcp-tools',
    title: 'MCP Tools',
    content: `
# MCP Tools Reference

ChainMind provides 5 MCP tools for blockchain operations.

## get_eth_balance

Get Ethereum balance for any address.

**Parameters:**
\`\`\`typescript
{
  address: string  // Ethereum address (0x...)
}
\`\`\`

**Response:**
\`\`\`typescript
{
  address: string
  balance: string        // ETH (formatted)
  balanceWei: string     // Wei (exact)
  chain: "ethereum"
}
\`\`\`

**Example:**
\`\`\`json
{
  "tool": "get_eth_balance",
  "arguments": {
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  }
}
\`\`\`

## get_sol_balance

Get Solana balance for any address.

**Parameters:**
\`\`\`typescript
{
  address: string  // Solana public key
}
\`\`\`

**Response:**
\`\`\`typescript
{
  address: string
  balance: string           // SOL (formatted)
  balanceLamports: string   // Lamports (exact)
  chain: "solana"
}
\`\`\`

## send_eth_transaction

Send Ethereum transaction with optional conditional execution.

**Parameters:**
\`\`\`typescript
{
  privateKey: string     // Hex private key
  recipient: string      // Recipient address
  amount: string         // Amount in ETH
  minBalance?: number    // Optional: only send if balance > this
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: boolean
  txHash?: string
  sender: string
  recipient: string
  amount: string
  message?: string  // If condition not met
}
\`\`\`

## send_sol_transaction

Send Solana transaction with optional conditional execution.

**Parameters:**
\`\`\`typescript
{
  privateKey: string     // JSON array: [1,2,3,...]
  recipient: string      // Recipient address
  amount: string         // Amount in SOL
  minBalance?: number    // Optional: only send if balance > this
}
\`\`\`

## multi_chain_summary

Get balances across multiple addresses on both chains.

**Parameters:**
\`\`\`typescript
{
  addresses: string[]  // Mix of ETH and SOL addresses
}
\`\`\`

**Response:**
\`\`\`typescript
{
  ethereum: {
    [address: string]: {
      balance: string
      balanceWei: string
    }
  },
  solana: {
    [address: string]: {
      balance: string
      balanceLamports: string
    }
  }
}
\`\`\`
`
  },
  {
    id: 'claude-integration',
    title: 'Claude Integration',
    content: `
# Using with Claude Desktop

ChainMind works seamlessly with Claude Desktop using the Model Context Protocol.

## Setup

### 1. Build the Server

\`\`\`bash
npm run build:server
\`\`\`

This creates \`dist/index.js\` - your MCP server.

### 2. Add to Claude Config

**macOS/Linux:**
\`~/.config/Claude/claude_desktop_config.json\`

**Windows:**
\`%APPDATA%\\Claude\\claude_desktop_config.json\`

**Configuration:**
\`\`\`json
{
  "mcpServers": {
    "chainmind": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-chain/dist/index.js"],
      "env": {
        "ETH_RPC_URL": "https://eth.llamarpc.com",
        "SOL_RPC_URL": "https://api.mainnet-beta.solana.com"
      }
    }
  }
}
\`\`\`

### 3. Restart Claude Desktop

The server will appear in Claude's MCP menu.

## Usage Examples

### Check Balance

> *"Check the Ethereum balance for Vitalik's address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"*

Claude will use the \`get_eth_balance\` tool and return the real balance.

### Multi-Chain Summary

> *"Get balances for these addresses: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045, 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"*

Claude will use \`multi_chain_summary\` to fetch all balances at once.

### Conditional Transaction

> *"Send 0.1 ETH to 0x123... but only if the sender has at least 1 ETH"*

Claude will use \`send_eth_transaction\` with the \`minBalance\` parameter.
`
  },
  {
    id: 'web-dashboard',
    title: 'Web Dashboard',
    content: `
# Web Dashboard Usage

The ChainMind web dashboard provides a beautiful UI for interacting with all MCP tools.

## Accessing the Dashboard

1. Start the dev server: \`npm run dev:web\`
2. Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Features

### 1. Balance Checker

- Enter any Ethereum or Solana address
- Click "Check ETH via MCP" or "Check SOL via MCP"
- See real balances with exact Wei/Lamport amounts
- Watch the activity log show MCP calls in real-time

**Example:**
- Address: \`0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\` (Vitalik)
- Result: Real ETH balance from Ethereum mainnet

### 2. Send Transaction

- Choose chain (Ethereum or Solana)
- Enter recipient address
- Enter amount to send
- Optionally set minimum balance for conditional execution
- Enter private key (⚠️ testnet only!)
- Click "Send via MCP Server"

**Conditional Logic:**
Set "Min Balance" to \`1.0\` - transaction only executes if sender has > 1 ETH/SOL.
Otherwise returns: "Condition not met: balance 0.5 < minimum 1.0"

### 3. Multi-Chain Summary

- Enter multiple addresses (comma-separated)
- Can mix Ethereum and Solana addresses
- Click "Get Summary via MCP"
- See JSON with all balances

**Example:**
\`\`\`
Input:
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

Output: JSON with both balances
\`\`\`

## Activity Log

The activity log shows all MCP server interactions:

\`\`\`
[12:34:56] 🔍 Calling MCP server to fetch ETH balance for 0xd8dA...
[12:34:57] ✅ MCP Response: 1234.567 ETH (1234567000000000000000 Wei)
[12:35:01] 📤 Calling MCP server to send 0.1 ETH to 0x...
[12:35:03] ✅ Transaction sent! Hash: 0xabc123...
\`\`\`

The exact Wei/Lamport amounts prove it's using real blockchain data!
`
  },
  {
    id: 'deployment',
    title: 'Deployment',
    content: `
# Deployment Guide

Deploy ChainMind to production.

## Vercel (Recommended)

Perfect for the web dashboard.

### Steps

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   \`\`\`
   ETH_RPC_URL=https://eth.llamarpc.com
   SOL_RPC_URL=https://api.mainnet-beta.solana.com
   SUPABASE_URL=your_supabase_url (optional)
   SUPABASE_SERVICE_KEY=your_key (optional)
   \`\`\`

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically detects Next.js
   - Dashboard will be live at \`your-app.vercel.app\`

## MCP Server (Standalone)

For Claude Desktop or other MCP clients.

### Option 1: Local

\`\`\`bash
npm run build:server
node dist/index.js
\`\`\`

Add to Claude Desktop config with absolute path to \`dist/index.js\`.

### Option 2: Docker

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:server
CMD ["node", "dist/index.js"]
\`\`\`

\`\`\`bash
docker build -t chainmind-mcp .
docker run -e ETH_RPC_URL=... -e SOL_RPC_URL=... chainmind-mcp
\`\`\`

## Production Checklist

- [ ] Use authenticated RPC endpoints (not public)
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Use environment variables for all secrets
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure Supabase for transaction logging
- [ ] Test on testnet first
- [ ] Never expose private keys in frontend code
`
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    content: `
# API Reference

## MCP Bridge API

### POST /api/mcp-bridge

Bridge endpoint that spawns the MCP server and executes tool calls.

**Request:**
\`\`\`typescript
{
  tool: string         // MCP tool name
  arguments: object    // Tool-specific arguments
}
\`\`\`

**Response:**
\`\`\`typescript
{
  result?: any      // Tool result
  error?: string    // Error message if failed
}
\`\`\`

**Example:**
\`\`\`bash
curl -X POST http://localhost:3000/api/mcp-bridge \\
  -H "Content-Type: application/json" \\
  -d '{
    "tool": "get_eth_balance",
    "arguments": {"address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}
  }'
\`\`\`

## Direct MCP Server

### JSON-RPC via stdio

The MCP server uses JSON-RPC 2.0 over stdio.

**Initialize:**
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {"name": "your-client", "version": "1.0"}
  }
}
\`\`\`

**Call Tool:**
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_eth_balance",
    "arguments": {"address": "0x..."}
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\\"address\\":\\"0x...\\",\\"balance\\":\\"1.234\\"}"
      }
    ]
  }
}
\`\`\`
`
  }
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const currentSection = sections.find(s => s.id === activeSection);

  // Enhanced markdown to HTML converter
  const renderMarkdown = (content: string) => {
    return content
      // Code blocks first (before other replacements)
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-6 text-sm font-mono leading-relaxed"><code>$2</code></pre>')
      // Headers
      .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold text-gray-900 mb-6 mt-2">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-10 border-b border-gray-200 pb-3">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-8">$1</h3>')
      // Bold labels (like **Parameters:**)
      .replace(/\*\*(.+?):\*\*/g, '<p class="font-semibold text-gray-900 mt-6 mb-2">$1:</p>')
      // Regular bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>')
      // List items
      .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2 text-gray-700 list-disc">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '<br/><br/>');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm tracking-tighter">A</span>
              </div>
              <span className="brand-logo text-2xl tracking-tighter">ALON</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/docs" className="text-gray-900 font-medium text-sm">
                Docs
              </Link>
              <Link href="/whitepaper" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                Whitepaper
              </Link>
              <Link href="/dashboard" className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Documentation</h1>
          <p className="text-gray-600">Complete guide to using <span className="brand-logo text-lg">ALON</span> MCP Server</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    activeSection === section.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl p-8 lg:p-10">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(currentSection?.content || '')
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
