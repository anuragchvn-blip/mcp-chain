'use client';

import Link from 'next/link';

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="font-semibold text-xl">ChainMind</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                Docs
              </Link>
              <Link href="/whitepaper" className="text-gray-900 font-medium text-sm">
                Whitepaper
              </Link>
              <Link href="/dashboard" className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white">
          <div className="prose prose-lg max-w-none">
            <div className="text-center mb-16 pb-8 border-b border-gray-200">
              <h1 className="text-6xl font-bold text-gray-900 mb-6">ChainMind</h1>
              <p className="text-2xl text-gray-600 font-medium">Multi-Chain Blockchain Operations via Model Context Protocol</p>
              <p className="text-sm text-gray-500 mt-6">Version 1.0 | October 2025</p>
            </div>

            <div className="space-y-12 text-gray-700 text-lg leading-relaxed">
              {/* Abstract */}
              <section>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Abstract</h2>
                <p className="text-gray-700">
                  ChainMind is a production-ready Model Context Protocol (MCP) server that enables AI agents to interact with Ethereum and Solana blockchains. Unlike mock implementations or API wrappers, ChainMind uses real blockchain libraries (ethers.js v6 and @solana/web3.js) to perform actual on-chain operations, providing AI agents with the capability to check balances, send transactions, and aggregate multi-chain data with conditional execution logic.
                </p>
              </section>

              {/* Introduction */}
              <section>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">1. Introduction</h2>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">1.1 Background</h3>
                <p className="text-gray-700">
                  The Model Context Protocol (MCP), developed by Anthropic, provides a standardized way for AI assistants to interact with external tools and data sources. However, blockchain interactions present unique challenges due to the complexity of cryptographic operations, transaction signing, and RPC communication.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">1.2 Problem Statement</h3>
                <p className="text-gray-700">
                  Existing blockchain tools for AI agents typically fall into three categories:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-6 text-gray-700">
                  <li>Mock implementations that return fake data</li>
                  <li>API wrappers that abstract away blockchain complexity</li>
                  <li>Complex setups requiring significant configuration</li>
                </ul>
                <p className="mt-4 text-gray-700">
                  None of these provide a true MCP-compliant interface with real blockchain interactions suitable for production use.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">1.3 Solution</h3>
                <p className="text-gray-700">
                  ChainMind addresses these limitations by providing:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-6 text-gray-700">
                  <li>Official MCP SDK integration (@modelcontextprotocol/sdk)</li>
                  <li>Real blockchain library usage (ethers.js, @solana/web3.js)</li>
                  <li>Production-ready architecture with web dashboard</li>
                  <li>Conditional transaction execution capabilities</li>
                  <li>Multi-chain balance aggregation</li>
                </ul>
              </section>              {/* Architecture */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">2. Architecture</h2>

                <h3 className="text-xl font-semibold text-white mb-2">2.1 System Components</h3>
                
                <div className="bg-gray-900 p-6 rounded-lg my-4">
                  <pre className="text-green-400 font-mono text-sm">
{`┌─────────────┐      HTTP POST      ┌──────────────┐     JSON-RPC      ┌──────────────┐
│   Browser   │ ──────────────────> │  MCP Bridge  │ ──────────────> │  MCP Server  │
│ (Dashboard) │     /api/mcp-bridge │  API Route   │   stdio/pipes   │  (stdio)     │
└─────────────┘                     └──────────────┘                  └──────────────┘
                                            │                                 │
                                            │                                 │
                                            v                                 v
                                    Spawns child                       Uses real:
                                    process                            • ethers.js
                                                                      • @solana/web3.js`}
                  </pre>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.2 MCP Server Layer</h3>
                <p>
                  The core MCP server is built using the official @modelcontextprotocol/sdk and communicates via stdio transport. This makes it compatible with Claude Desktop and any other MCP-compliant client.
                </p>
                <p className="mt-4">
                  Key characteristics:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>JSON-RPC 2.0 protocol over stdin/stdout</li>
                  <li>5 registered tools for blockchain operations</li>
                  <li>Direct integration with blockchain libraries</li>
                  <li>Environment-based configuration</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.3 Bridge API Layer</h3>
                <p>
                  The bridge API (/api/mcp-bridge) solves a fundamental incompatibility: MCP servers use stdio transport while browsers require HTTP. The bridge:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Receives HTTP POST requests from the dashboard</li>
                  <li>Spawns the MCP server as a child process</li>
                  <li>Sends JSON-RPC requests via stdin</li>
                  <li>Reads JSON-RPC responses from stdout</li>
                  <li>Returns formatted results to the browser</li>
                </ol>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.4 Web Dashboard</h3>
                <p>
                  Built with Next.js 14, the dashboard provides:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Wallet connection via RainbowKit</li>
                  <li>Balance checking for Ethereum and Solana</li>
                  <li>Transaction sending with conditional logic</li>
                  <li>Multi-chain summary views</li>
                  <li>Real-time activity logging</li>
                </ul>
              </section>

              {/* Tools */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">3. MCP Tools</h2>

                <h3 className="text-xl font-semibold text-white mb-2">3.1 get_eth_balance</h3>
                <p>
                  Retrieves the Ethereum balance for a given address using ethers.JsonRpcProvider.getBalance().
                </p>
                <div className="bg-gray-900 p-4 rounded-lg my-4">
                  <pre className="text-green-400 font-mono text-sm">
{`const balance = await ethProvider.getBalance(address);
return {
  balance: ethers.formatEther(balance),  // Human-readable
  balanceWei: balance.toString()          // Exact amount
};`}
                  </pre>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">3.2 get_sol_balance</h3>
                <p>
                  Retrieves the Solana balance using @solana/web3.js Connection.getBalance().
                </p>
                <div className="bg-gray-900 p-4 rounded-lg my-4">
                  <pre className="text-green-400 font-mono text-sm">
{`const publicKey = new PublicKey(address);
const balance = await solConnection.getBalance(publicKey);
return {
  balance: (balance / LAMPORTS_PER_SOL).toString(),
  balanceLamports: balance.toString()
};`}
                  </pre>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">3.3 send_eth_transaction</h3>
                <p>
                  Sends Ethereum transactions with optional conditional execution. If minBalance is specified, the transaction only executes if the sender's balance exceeds the threshold.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">3.4 send_sol_transaction</h3>
                <p>
                  Sends Solana transactions with the same conditional logic capabilities as Ethereum.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">3.5 multi_chain_summary</h3>
                <p>
                  Aggregates balance information across both Ethereum and Solana for multiple addresses in a single call, reducing latency and improving efficiency for portfolio tracking.
                </p>
              </section>

              {/* Technical Implementation */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">4. Technical Implementation</h2>

                <h3 className="text-xl font-semibold text-white mb-2">4.1 Blockchain Libraries</h3>
                <p><strong>Ethereum: ethers.js v6</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>Industry-standard Ethereum library</li>
                  <li>Full TypeScript support</li>
                  <li>Comprehensive transaction handling</li>
                  <li>Built-in ENS resolution</li>
                </ul>

                <p><strong>Solana: @solana/web3.js</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Official Solana JavaScript SDK</li>
                  <li>Transaction building and signing</li>
                  <li>RPC communication</li>
                  <li>Account management</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">4.2 Data Integrity</h3>
                <p>
                  All balance queries return exact amounts in the smallest unit (Wei for Ethereum, Lamports for Solana) alongside human-readable formats. This ensures:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>No precision loss from floating-point arithmetic</li>
                  <li>Verifiable on-chain accuracy</li>
                  <li>Compatibility with smart contract interactions</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">4.3 Security Considerations</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Private keys never exposed in browser environments</li>
                  <li>Transaction signing occurs in backend/MCP server</li>
                  <li>Environment variable-based configuration</li>
                  <li>Optional Supabase logging for audit trails</li>
                </ul>
              </section>

              {/* Use Cases */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">5. Use Cases</h2>

                <h3 className="text-xl font-semibold text-white mb-2">5.1 AI-Powered Portfolio Management</h3>
                <p>
                  AI agents can use ChainMind to monitor wallet balances across multiple chains, alerting users to significant changes or executing rebalancing strategies.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">5.2 Conditional Automated Payments</h3>
                <p>
                  The minBalance parameter enables sophisticated automation: "Pay the contractor 1 ETH, but only if I have at least 10 ETH in my wallet." This prevents accidental treasury depletion.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">5.3 Cross-Chain Analytics</h3>
                <p>
                  The multi_chain_summary tool provides instant portfolio snapshots across Ethereum and Solana, useful for tax reporting, net worth tracking, and investment analysis.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">5.4 AI Agent Blockchain Interactions</h3>
                <p>
                  Claude Desktop users can ask natural language questions like "What's Vitalik's ETH balance?" and receive real, up-to-date blockchain data.
                </p>
              </section>

              {/* Future Work */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">6. Future Enhancements</h2>

                <h3 className="text-xl font-semibold text-white mb-2">6.1 Additional Chains</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Polygon support</li>
                  <li>Arbitrum and Optimism</li>
                  <li>Avalanche integration</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.2 Advanced Features</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>ERC-20 and SPL token support</li>
                  <li>NFT balance checking</li>
                  <li>DeFi protocol interactions</li>
                  <li>Gas optimization strategies</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.3 Enhanced Security</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hardware wallet integration</li>
                  <li>Multi-signature support</li>
                  <li>Transaction simulation before execution</li>
                </ul>
              </section>

              {/* Conclusion */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">7. Conclusion</h2>
                <p>
                  ChainMind demonstrates that AI agents can interact with blockchains using real, production-ready tools rather than mocks or simplified APIs. By combining the Model Context Protocol with established blockchain libraries, we enable a new class of AI-powered blockchain applications.
                </p>
                <p className="mt-4">
                  The system is open-source, extensible, and ready for production deployment. Whether used through Claude Desktop or the web dashboard, ChainMind provides reliable, verifiable blockchain data to AI agents and users alike.
                </p>
              </section>

              {/* References */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">8. References</h2>
                <ul className="space-y-2">
                  <li>[1] Anthropic. Model Context Protocol. <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://modelcontextprotocol.io</a></li>
                  <li>[2] ethers.js Documentation. <a href="https://docs.ethers.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://docs.ethers.org</a></li>
                  <li>[3] Solana Web3.js Documentation. <a href="https://solana-labs.github.io/solana-web3.js" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://solana-labs.github.io/solana-web3.js</a></li>
                  <li>[4] Next.js Documentation. <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://nextjs.org/docs</a></li>
                </ul>
              </section>

              {/* Appendix */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Appendix A: Installation</h2>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <pre className="text-green-400 font-mono text-sm">
{`# Clone repository
git clone https://github.com/yourusername/mcp-chain.git
cd mcp-chain

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your RPC endpoints

# Build MCP server
npm run build:server

# Run web dashboard
npm run dev:web`}
                  </pre>
                </div>
              </section>

              <section className="mt-12 pt-8 border-t border-white/10">
                <p className="text-center text-gray-400">
                  <strong>ChainMind v1.0</strong> | Built with ❤️ using official MCP SDK, ethers.js, and @solana/web3.js
                </p>
                <div className="text-center mt-4">
                  <Link href="/dashboard" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                    Try ChainMind Now →
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
