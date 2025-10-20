'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'ethereum' | 'solana'>('ethereum');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">⛓️</span>
              </div>
              <span className="text-white font-bold text-xl">ChainMind</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/whitepaper" className="text-gray-300 hover:text-white transition-colors">
                Whitepaper
              </Link>
              <Link href="/dashboard" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">Powered by Official MCP SDK</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Multi-Chain Blockchain
              </span>
              <br />
              <span className="text-white">Operations via AI</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              A production-ready Model Context Protocol (MCP) server enabling AI agents to interact with Ethereum and Solana blockchains using real libraries.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4 mb-16">
              <Link href="/dashboard" className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
                <span className="flex items-center gap-2">
                  Launch Dashboard
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link href="/docs" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all">
                Read Docs
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">5</div>
                <div className="text-gray-400 text-sm">MCP Tools</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">2</div>
                <div className="text-gray-400 text-sm">Blockchains</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-gray-400 text-sm">Real</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powered by Real Blockchain Libraries</h2>
            <p className="text-gray-400 text-lg">Not mocks, not simulations – real blockchain interactions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ethereum Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⟠</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Ethereum</h3>
                  <p className="text-blue-400 text-sm">ethers.js v6</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Real <code className="bg-white/10 px-2 py-0.5 rounded">JsonRpcProvider</code> connections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Get balances, send transactions, check gas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Conditional transaction execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Exact Wei amounts (no rounding)</span>
                </li>
              </ul>
            </div>

            {/* Solana Card */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">◎</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Solana</h3>
                  <p className="text-purple-400 text-sm">@solana/web3.js</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Real <code className="bg-white/10 px-2 py-0.5 rounded">Connection</code> to RPC nodes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Native SOL transfers and balance checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Transaction signing and confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Exact Lamport amounts (no approximations)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">5 Powerful MCP Tools</h2>
            <p className="text-gray-400 text-lg">All accessible via Model Context Protocol</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💰',
                title: 'get_eth_balance',
                description: 'Fetch Ethereum balance for any address',
                color: 'blue'
              },
              {
                icon: '💎',
                title: 'get_sol_balance',
                description: 'Fetch Solana balance for any address',
                color: 'purple'
              },
              {
                icon: '📤',
                title: 'send_eth_transaction',
                description: 'Send ETH with optional conditional execution',
                color: 'blue'
              },
              {
                icon: '🚀',
                title: 'send_sol_transaction',
                description: 'Send SOL with optional conditional execution',
                color: 'purple'
              },
              {
                icon: '🌐',
                title: 'multi_chain_summary',
                description: 'Get balances across multiple chains at once',
                color: 'green'
              }
            ].map((tool, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  <code className={`text-${tool.color}-400`}>{tool.title}</code>
                </h3>
                <p className="text-gray-400 text-sm">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple architecture, powerful results</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Web Dashboard</h3>
              <p className="text-gray-400">Beautiful UI for interacting with MCP tools via HTTP bridge</p>
            </div>

            <div className="text-4xl text-purple-400">→</div>

            <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔌</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. MCP Server</h3>
              <p className="text-gray-400">stdio transport server using official @modelcontextprotocol/sdk</p>
            </div>

            <div className="text-4xl text-purple-400">→</div>

            <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⛓️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Blockchain</h3>
              <p className="text-gray-400">Real RPC calls using ethers.js and @solana/web3.js</p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Use with Claude Desktop</h2>
            <p className="text-gray-400 text-lg">Add to your MCP configuration</p>
          </div>

          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`{
  "mcpServers": {
    "chainmind": {
      "command": "node",
      "args": ["/path/to/mcp-chain/dist/index.js"]
    }
  }
}`}
            </pre>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">Then ask Claude:</p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 max-w-2xl mx-auto">
              <p className="text-blue-400 italic">"Check the ETH balance for 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start using ChainMind to enable AI agents to interact with blockchains
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105">
              Launch Dashboard
            </Link>
            <Link href="/docs" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all">
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">⛓️</span>
                </div>
                <span className="text-white font-bold">ChainMind</span>
              </div>
              <p className="text-gray-400 text-sm">
                Production-ready MCP server for multi-chain blockchain operations
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/whitepaper" className="hover:text-white transition-colors">Whitepaper</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MCP Docs</a></li>
                <li><a href="https://docs.ethers.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ethers.js</a></li>
                <li><a href="https://solana.com/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Solana Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Tech Stack</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>@modelcontextprotocol/sdk</li>
                <li>ethers.js v6</li>
                <li>@solana/web3.js</li>
                <li>Next.js 14</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 ChainMind. Built with ❤️ using official MCP SDK.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
