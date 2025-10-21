'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg tracking-tighter">A</span>
              </div>
              <div>
                <span className="brand-logo text-3xl tracking-tighter">ALON</span>
                <p className="text-xs text-gray-500 -mt-1 font-medium">Blockchain Intelligence</p>
              </div>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Documentation</Link>
              <Link href="/whitepaper" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Whitepaper</Link>
              <Link href="/dashboard" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                Launch App →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full mb-8">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-semibold text-gray-700">Model Context Protocol v1.0</span>
        </div>

        <h1 className="text-7xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
          Blockchain intelligence
          <br />
          for AI agents
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Production-ready MCP server that gives Claude and other AI assistants native blockchain capabilities. 
          <span className="brand-logo text-xl"> ALON</span> powers real-time queries, transaction execution, and multi-chain data analysis.
        </p>

        <div className="flex items-center justify-center space-x-4 mb-16">
          <Link href="/dashboard" className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all">
            Get Started Free
          </Link>
          <Link href="/docs" className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl text-base font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all">
            Read Docs
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="text-4xl font-bold mb-2 text-gray-900">5</div>
            <div className="text-sm font-semibold text-gray-600">MCP Tools</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="text-4xl font-bold mb-2 text-gray-900">2</div>
            <div className="text-sm font-semibold text-gray-600">Blockchains</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="text-4xl font-bold mb-2 text-gray-900">100%</div>
            <div className="text-sm font-semibold text-gray-600">Real Data</div>
          </div>
        </div>
      </section>

      {/* Features - Minimal Cards */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4">Supported blockchains</h2>
          <p className="text-gray-600">Native integration with Ethereum and Solana</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-xl p-8 hover:border-gray-200 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-xl">⟠</span>
              </div>
              <h3 className="text-xl font-semibold">Ethereum</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Query balances, send transactions, and interact with the Ethereum blockchain using ethers.js v6.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">✓</span> Get ETH balance in Wei
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span> Send transactions with gas estimation
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span> Real-time RPC connections
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-8 hover:border-gray-200 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">◎</span>
              </div>
              <h3 className="text-xl font-semibold">Solana</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Fast, low-cost transactions on Solana blockchain with native @solana/web3.js integration.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">✓</span> Get SOL balance in Lamports
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span> Send SOL with memo support
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span> Sub-second finality
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Tools */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4">Five powerful MCP tools</h2>
          <p className="text-gray-600">Ready-to-use blockchain operations through the Model Context Protocol</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-gray-100 rounded-lg p-6">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="font-semibold mb-2">get_eth_balance</h3>
            <p className="text-sm text-gray-600">Query Ethereum wallet balances with exact Wei precision</p>
          </div>
          <div className="border border-gray-100 rounded-lg p-6">
            <div className="text-2xl mb-3">💸</div>
            <h3 className="font-semibold mb-2">send_eth_transaction</h3>
            <p className="text-sm text-gray-600">Send ETH with optional minimum balance checks</p>
          </div>
          <div className="border border-gray-100 rounded-lg p-6">
            <div className="text-2xl mb-3">🪙</div>
            <h3 className="font-semibold mb-2">get_sol_balance</h3>
            <p className="text-sm text-gray-600">Check Solana balances in Lamports with RPC data</p>
          </div>
          <div className="border border-gray-100 rounded-lg p-6">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">send_sol_transaction</h3>
            <p className="text-sm text-gray-600">Transfer SOL with custom memo messages</p>
          </div>
          <div className="border border-gray-100 rounded-lg p-6 md:col-span-2">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">multi_chain_summary</h3>
            <p className="text-sm text-gray-600">Get comprehensive balance overview across Ethereum and Solana in a single call</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4">How it works</h2>
          <p className="text-gray-600">Three simple steps to blockchain-powered AI</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-semibold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Install MCP Server</h3>
            <p className="text-sm text-gray-600">Configure Claude Desktop with our MCP server</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-semibold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Ask Questions</h3>
            <p className="text-sm text-gray-600">Use natural language to query balances and send transactions</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-semibold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Get Real Results</h3>
            <p className="text-sm text-gray-600">Receive actual blockchain data with exact values</p>
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-3">Configuration example</h2>
          <p className="text-gray-600">Claude Desktop setup</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-gray-500">claude_desktop_config.json</span>
          </div>
          <pre className="text-sm font-mono text-gray-800 overflow-x-auto">{`{
  "mcpServers": {
    "alon": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "ETH_RPC_URL": "https://eth-mainnet.g.alchemy.com/...",
        "SOL_RPC_URL": "https://api.mainnet-beta.solana.com"
      }
    }
  }
}`}</pre>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center border-t border-gray-100">
        <h2 className="text-4xl font-semibold mb-4">Ready to start?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Deploy your own MCP blockchain server in minutes
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/dashboard" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium">
            Get started free
          </Link>
          <a 
            href="https://github.com/anuragchvn-blip/mcp-chain" 
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-200 hover:border-gray-300 px-8 py-3 rounded-lg font-medium"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm tracking-tighter">A</span>
                </div>
                <span className="brand-logo text-2xl tracking-tighter">ALON</span>
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                Model Context Protocol server for blockchain operations. Built with ethers.js and @solana/web3.js.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-sm text-gray-600 hover:text-black">Dashboard</Link>
                <Link href="/docs" className="block text-sm text-gray-600 hover:text-black">Documentation</Link>
                <Link href="/whitepaper" className="block text-sm text-gray-600 hover:text-black">Whitepaper</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <div className="space-y-2">
                <a href="https://github.com/anuragchvn-blip/mcp-chain" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-600 hover:text-black">GitHub</a>
                <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-600 hover:text-black">MCP Protocol</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-600">© 2025 <span className="brand-logo text-sm">ALON</span>. Built for the Model Context Protocol.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
