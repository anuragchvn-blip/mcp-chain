#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ethers } from 'ethers';
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase client setup (optional)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Blockchain RPC endpoints
const ETH_RPC_URL = process.env.ETH_RPC_URL || 'https://eth.llamarpc.com';
const SOL_RPC_URL = process.env.SOL_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Initialize providers
const ethProvider = new ethers.JsonRpcProvider(ETH_RPC_URL);
const solConnection = new Connection(SOL_RPC_URL, 'confirmed');

// Transaction logging helper
async function logTransaction(data: {
  blockchain: 'eth' | 'sol';
  tx_hash: string;
  sender: string;
  recipient: string;
  amount: string;
}) {
  if (!supabase) {
    console.error('Supabase not configured, skipping transaction log');
    return;
  }

  try {
    await supabase.from('transactions').insert([
      {
        blockchain: data.blockchain,
        tx_hash: data.tx_hash,
        sender: data.sender,
        recipient: data.recipient,
        amount: data.amount,
        timestamp: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error('Failed to log transaction:', error);
  }
}

// Create MCP server
const server = new Server(
  {
    name: 'mcp-chain',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool 1: Get Ethereum Balance
async function getEthBalance(address: string) {
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }
  const balance = await ethProvider.getBalance(address);
  return {
    address,
    balance: ethers.formatEther(balance),
    balanceWei: balance.toString(),
    chain: 'ethereum',
  };
}

// Tool 2: Send Ethereum Transaction
async function sendEthTransaction(params: {
  privateKey: string;
  recipient: string;
  amount: string;
  minBalance?: number;
}) {
  const { privateKey, recipient, amount, minBalance } = params;

  if (!ethers.isAddress(recipient)) {
    throw new Error('Invalid recipient address');
  }

  const wallet = new ethers.Wallet(privateKey, ethProvider);

  // Check condition if minBalance is set
  if (minBalance !== undefined) {
    const balance = await ethProvider.getBalance(wallet.address);
    const balanceInEth = parseFloat(ethers.formatEther(balance));
    if (balanceInEth < minBalance) {
      return {
        success: false,
        message: `Condition not met: balance ${balanceInEth} ETH < minimum ${minBalance} ETH`,
      };
    }
  }

  const tx = await wallet.sendTransaction({
    to: recipient,
    value: ethers.parseEther(amount),
  });

  await tx.wait();

  // Log transaction
  await logTransaction({
    blockchain: 'eth',
    tx_hash: tx.hash,
    sender: wallet.address,
    recipient,
    amount,
  });

  return {
    success: true,
    txHash: tx.hash,
    sender: wallet.address,
    recipient,
    amount,
    chain: 'ethereum',
  };
}

// Tool 3: Get Solana Balance
async function getSolBalance(address: string) {
  const publicKey = new PublicKey(address);
  const balance = await solConnection.getBalance(publicKey);
  return {
    address,
    balance: (balance / LAMPORTS_PER_SOL).toString(),
    balanceLamports: balance.toString(),
    chain: 'solana',
  };
}

// Tool 4: Send Solana Transaction
async function sendSolTransaction(params: {
  privateKey: string;
  recipient: string;
  amount: string;
  minBalance?: number;
}) {
  const { privateKey, recipient, amount, minBalance } = params;

  // Parse private key (expecting JSON array format)
  const secretKey = Uint8Array.from(JSON.parse(privateKey));
  const senderKeypair = Keypair.fromSecretKey(secretKey);
  const recipientPubkey = new PublicKey(recipient);

  // Check condition if minBalance is set
  if (minBalance !== undefined) {
    const balance = await solConnection.getBalance(senderKeypair.publicKey);
    const balanceInSol = balance / LAMPORTS_PER_SOL;
    if (balanceInSol < minBalance) {
      return {
        success: false,
        message: `Condition not met: balance ${balanceInSol} SOL < minimum ${minBalance} SOL`,
      };
    }
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: recipientPubkey,
      lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(solConnection, transaction, [
    senderKeypair,
  ]);

  // Log transaction
  await logTransaction({
    blockchain: 'sol',
    tx_hash: signature,
    sender: senderKeypair.publicKey.toString(),
    recipient,
    amount,
  });

  return {
    success: true,
    signature,
    sender: senderKeypair.publicKey.toString(),
    recipient,
    amount,
    chain: 'solana',
  };
}

// Tool 5: Multi-Chain Summary
async function getMultiChainSummary(addresses: string[]) {
  const results: any = {
    ethereum: {},
    solana: {},
  };

  await Promise.allSettled(
    addresses.map(async (address) => {
      // Try Ethereum
      if (ethers.isAddress(address)) {
        try {
          const balance = await getEthBalance(address);
          results.ethereum[address] = balance;
        } catch (error) {
          results.ethereum[address] = { error: String(error) };
        }
      }

      // Try Solana
      try {
        const balance = await getSolBalance(address);
        results.solana[address] = balance;
      } catch (error) {
        results.solana[address] = { error: String(error) };
      }
    })
  );

  return results;
}

// Register tools with MCP server
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_eth_balance',
        description: 'Get Ethereum balance for a given address',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Ethereum address (0x...)',
            },
          },
          required: ['address'],
        },
      },
      {
        name: 'send_eth_transaction',
        description: 'Send ETH transaction with optional conditional execution',
        inputSchema: {
          type: 'object',
          properties: {
            privateKey: {
              type: 'string',
              description: 'Private key of sender (hex format)',
            },
            recipient: {
              type: 'string',
              description: 'Recipient Ethereum address',
            },
            amount: {
              type: 'string',
              description: 'Amount in ETH to send',
            },
            minBalance: {
              type: 'number',
              description: 'Optional: minimum balance required before sending',
            },
          },
          required: ['privateKey', 'recipient', 'amount'],
        },
      },
      {
        name: 'get_sol_balance',
        description: 'Get Solana balance for a given address',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Solana public key address',
            },
          },
          required: ['address'],
        },
      },
      {
        name: 'send_sol_transaction',
        description: 'Send SOL transaction with optional conditional execution',
        inputSchema: {
          type: 'object',
          properties: {
            privateKey: {
              type: 'string',
              description: 'Private key as JSON array string [1,2,3,...]',
            },
            recipient: {
              type: 'string',
              description: 'Recipient Solana address',
            },
            amount: {
              type: 'string',
              description: 'Amount in SOL to send',
            },
            minBalance: {
              type: 'number',
              description: 'Optional: minimum balance required before sending',
            },
          },
          required: ['privateKey', 'recipient', 'amount'],
        },
      },
      {
        name: 'multi_chain_summary',
        description: 'Get balances across Ethereum and Solana for multiple addresses',
        inputSchema: {
          type: 'object',
          properties: {
            addresses: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of blockchain addresses (ETH and/or SOL)',
            },
          },
          required: ['addresses'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (!args) {
      throw new Error('No arguments provided');
    }

    switch (name) {
      case 'get_eth_balance': {
        const result = await getEthBalance(args.address as string);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'send_eth_transaction': {
        const result = await sendEthTransaction(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'get_sol_balance': {
        const result = await getSolBalance(args.address as string);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'send_sol_transaction': {
        const result = await sendSolTransaction(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'multi_chain_summary': {
        const result = await getMultiChainSummary(args.addresses as string[]);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: String(error) }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ChainMind MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
