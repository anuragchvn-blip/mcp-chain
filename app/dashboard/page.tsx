'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">CM</span>
                  </div>
                  <span className="font-bold text-2xl tracking-tight">ChainMind</span>
                </div>
              </Link>
              <span className="text-gray-400 text-lg ml-4">/</span>
              <span className="text-gray-600 font-semibold text-lg">Dashboard</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 text-base font-medium">Docs</Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your blockchain operations across Ethereum and Solana</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Checker */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Check Balance</h2>
              <span className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600">MCP Server</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="label">
                  Wallet Address
                </label>
                <input
                  type="text"
                  className="input-field font-mono"
                  placeholder={isConnected ? `${address}` : 'Enter Ethereum or Solana address...'}
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
              <div className="grid grid-cols-2 gap-6">
                <div className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all">
                  <p className="text-base font-semibold text-gray-600 mb-2">Ethereum</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {ethBalance ? `${ethBalance}` : '—'}
                  </p>
                  <p className="text-sm font-medium text-gray-500">ETH</p>
                </div>

                <div className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all">
                  <p className="text-base font-semibold text-gray-600 mb-2">Solana</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {solBalance ? `${solBalance}` : '—'}
                  </p>
                  <p className="text-sm font-medium text-gray-500">SOL</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => fetchBalance('eth')}
                  disabled={loading || (!checkAddress && !address)}
                  className="flex-1 btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? 'Loading...' : 'Check ETH'}
                </button>

                <button
                  onClick={() => fetchBalance('sol')}
                  disabled={loading || (!checkAddress && !address)}
                  className="flex-1 btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? 'Loading...' : 'Check SOL'}
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="card lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">Activity</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-base text-gray-500">No activity yet</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-sm font-mono text-gray-700 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Transaction Sender */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-8">Send Transaction</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="label">Blockchain</label>
                <select
                  title="Select blockchain"
                  value={txChain}
                  onChange={(e) => setTxChain(e.target.value as 'eth' | 'sol')}
                  className="input-field font-semibold"
                >
                  <option value="eth">Ethereum</option>
                  <option value="sol">Solana</option>
                </select>
              </div>

              <div>
                <label className="label">Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x... or Solana address"
                  className="input-field font-mono"
                />
              </div>

              <div>
                <label className="label">Amount {txChain === 'eth' ? '(ETH)' : '(SOL)'}</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.01"
                  className="input-field text-lg font-semibold"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="label">Private Key (Required)</label>
                <input
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Your private key"
                  className="input-field font-mono"
                />
                <p className="text-sm text-gray-500 mt-2">⚠️ Never share your private key</p>
              </div>

              <div>
                <label className="label">Minimum Balance (Optional)</label>
                <input
                  type="text"
                  value={minBalance}
                  onChange={(e) => setMinBalance(e.target.value)}
                  placeholder="e.g., 1000000000000000000"
                  className="input-field font-mono"
                />
                <p className="text-sm text-gray-500 mt-2">Transaction only proceeds if sender has this balance</p>
              </div>

              <button
                onClick={() => sendTransaction()}
                disabled={loading || !recipient || !amount || !privateKey}
                className="w-full btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Sending...' : 'Send Transaction'}
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Chain Summary */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-8">Multi-Chain Summary</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="label">Addresses (comma-separated)</label>
                <textarea
                  value={summaryAddresses}
                  onChange={(e) => setSummaryAddresses(e.target.value)}
                  placeholder="0xabc..., 0xdef..., DYw8j... (mix of ETH and SOL addresses)"
                  className="input-field font-mono h-32 resize-none"
                />
              </div>
              <button
                onClick={() => getMultiChainSummary()}
                disabled={loading || !summaryAddresses}
                className="w-full btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Fetching...' : 'Get Summary'}
              </button>
            </div>

            <div>
              {summaryResult && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 h-full">
                  <h3 className="font-bold text-lg mb-4">Results</h3>
                  <pre className="text-sm font-mono overflow-x-auto text-gray-700 leading-relaxed">
                    {JSON.stringify(summaryResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
