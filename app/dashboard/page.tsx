'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [checkAddress, setCheckAddress] = useState('');
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Transaction form state
  const [txChain, setTxChain] = useState<'eth' | 'sol'>('eth');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [minBalance, setMinBalance] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  // Multi-chain summary state
  const [summaryAddresses, setSummaryAddresses] = useState('');
  const [summaryResult, setSummaryResult] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));
  };

  // Use MCP server through bridge API
  const fetchBalance = async (chain: 'eth' | 'sol') => {
    const targetAddress = checkAddress || address;
    if (!targetAddress) {
      addLog('❌ Please enter an address or connect wallet');
      return;
    }

    setLoading(true);
    addLog(`🔍 Calling MCP server to fetch ${chain.toUpperCase()} balance for ${targetAddress}...`);
    
    try {
      const response = await fetch('/api/mcp-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: chain === 'eth' ? 'get_eth_balance' : 'get_sol_balance',
          arguments: { address: targetAddress }
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        addLog(`❌ MCP Error: ${data.error}`);
        return;
      }

      if (chain === 'eth') {
        setEthBalance(data.result.balance);
        addLog(`✅ MCP Response: ${data.result.balance} ETH (${data.result.balanceWei} Wei)`);
      } else {
        setSolBalance(data.result.balance);
        addLog(`✅ MCP Response: ${data.result.balance} SOL (${data.result.balanceLamports} Lamports)`);
      }
    } catch (error) {
      addLog(`❌ Failed to call MCP server: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async () => {
    if (!recipient || !amount || !privateKey) {
      addLog('❌ Please fill in recipient, amount, and private key');
      return;
    }

    setLoading(true);
    addLog(`📤 Calling MCP server to send ${amount} ${txChain.toUpperCase()} to ${recipient}...`);
    
    try {
      const response = await fetch('/api/mcp-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: txChain === 'eth' ? 'send_eth_transaction' : 'send_sol_transaction',
          arguments: {
            privateKey,
            recipient,
            amount,
            ...(minBalance && { minBalance: parseFloat(minBalance) })
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        addLog(`❌ MCP Error: ${data.error}`);
        return;
      }

      if (data.result.success) {
        const txHash = data.result.txHash || data.result.signature;
        addLog(`✅ Transaction sent! Hash: ${txHash}`);
        addLog(`   From: ${data.result.sender}`);
        addLog(`   To: ${recipient}`);
        addLog(`   Amount: ${amount} ${txChain.toUpperCase()}`);
      } else {
        addLog(`⚠️ ${data.result.message}`);
      }
    } catch (error) {
      addLog(`❌ Failed to send transaction: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getMultiChainSummary = async () => {
    if (!summaryAddresses.trim()) {
      addLog('❌ Please enter addresses (comma-separated)');
      return;
    }

    const addresses = summaryAddresses.split(',').map(a => a.trim()).filter(a => a);
    
    setLoading(true);
    addLog(`🔄 Calling MCP server for multi-chain summary of ${addresses.length} addresses...`);
    
    try {
      const response = await fetch('/api/mcp-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'multi_chain_summary',
          arguments: { addresses }
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        addLog(`❌ MCP Error: ${data.error}`);
        return;
      }

      setSummaryResult(data.result);
      addLog(`✅ Multi-chain summary retrieved!`);
      addLog(`   Ethereum addresses: ${Object.keys(data.result.ethereum).length}`);
      addLog(`   Solana addresses: ${Object.keys(data.result.solana).length}`);
    } catch (error) {
      addLog(`❌ Failed to get summary: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            ⛓️ ChainMind MCP Dashboard
          </h1>
          <p className="text-lg text-gray-700">
            Real blockchain operations powered by <span className="font-mono bg-blue-200 px-2 py-1 rounded">@modelcontextprotocol/sdk</span>
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ ethers.js v6</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ @solana/web3.js</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ MCP Bridge API</span>
          </div>
          <div className="mt-6">
            <WalletConnect />
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Address Input & Balance Check */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>💰</span> Balance Checker
              <span className="text-sm font-normal text-gray-500 ml-2">(via MCP Server)</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address to Check
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                  placeholder={isConnected ? `${address} (your wallet)` : 'Enter any ETH or SOL address...'}
                  value={checkAddress}
                  onChange={(e) => setCheckAddress(e.target.value)}
                />
                {isConnected && !checkAddress && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use your connected wallet address
                  </p>
                )}
              </div>

              {/* Balance Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <p className="text-sm text-gray-600 mb-1">Ethereum</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {ethBalance ? `${ethBalance}` : '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ETH</p>
                </div>

                <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                  <p className="text-sm text-gray-600 mb-1">Solana</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {solBalance ? `${solBalance}` : '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">SOL</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => fetchBalance('eth')}
                  disabled={loading || (!checkAddress && !address)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? '⏳ Loading...' : '🔍 Check ETH via MCP'}
                </button>
                <button
                  onClick={() => fetchBalance('sol')}
                  disabled={loading || (!checkAddress && !address)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? '⏳ Loading...' : '🔍 Check SOL via MCP'}
                </button>
              </div>
            </div>
          </div>

          {/* MCP Server Info */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">🔌 MCP Server Status</h2>
            <div className="space-y-3">
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-800">✓ Server Active</p>
                <p className="text-xs text-green-700 mt-1">Running on stdio transport</p>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">Available Tools:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• get_eth_balance</li>
                  <li>• get_sol_balance</li>
                  <li>• send_eth_transaction</li>
                  <li>• send_sol_transaction</li>
                  <li>• multi_chain_summary</li>
                </ul>
              </div>

              <div className="text-xs text-gray-500">
                <p className="font-semibold mb-1">How it works:</p>
                <p>Frontend → API Bridge → MCP Server → Blockchain RPC → Real Balance</p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-3 bg-gray-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <span>📊</span> MCP Activity Log
            </h2>
            <div className="bg-black rounded-lg p-4 font-mono text-sm h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">Waiting for MCP calls...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="mb-1 text-green-400">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Send Transaction Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📤</span> Send Transaction
              <span className="text-sm font-normal text-gray-500 ml-2">(via MCP Server)</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chain</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={txChain}
                  onChange={(e) => setTxChain(e.target.value as 'eth' | 'sol')}
                >
                  <option value="eth">Ethereum</option>
                  <option value="sol">Solana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                  placeholder={txChain === 'eth' ? '0x...' : 'Solana address'}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.001"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Balance (Optional - Conditional Execution)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Only send if balance > this amount"
                  value={minBalance}
                  onChange={(e) => setMinBalance(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Private Key</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                  placeholder={txChain === 'eth' ? '0x... (hex)' : '[1,2,3,...] (JSON array)'}
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Demo only! Never use real private keys in production web apps.
                </p>
              </div>

              <button
                onClick={sendTransaction}
                disabled={loading || !recipient || !amount || !privateKey}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? '⏳ Sending...' : '📤 Send via MCP Server'}
              </button>
            </div>
          </div>

          {/* Multi-Chain Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🌐</span> Multi-Chain Summary
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Addresses (comma-separated)
                </label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-xs"
                  placeholder="0x..., solana_address, 0x..."
                  rows={4}
                  value={summaryAddresses}
                  onChange={(e) => setSummaryAddresses(e.target.value)}
                />
              </div>

              <button
                onClick={getMultiChainSummary}
                disabled={loading || !summaryAddresses.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? '⏳ Fetching...' : '🔄 Get Summary via MCP'}
              </button>

              {summaryResult && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-sm font-semibold mb-2">Results:</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {JSON.stringify(summaryResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600">
          <p className="font-semibold">Powered by Official MCP SDK</p>
          <p className="mt-1">
            This dashboard calls the real MCP server which uses{' '}
            <code className="bg-gray-200 px-2 py-0.5 rounded">ethers.js</code> and{' '}
            <code className="bg-gray-200 px-2 py-0.5 rounded">@solana/web3.js</code>
          </p>
        </footer>
      </div>
    </div>
  );
}
