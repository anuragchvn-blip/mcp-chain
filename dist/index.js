#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const ethers_1 = require("ethers");
const web3_js_1 = require("@solana/web3.js");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config({ path: '.env.local' });
// Supabase client setup (optional)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey) : null;
// Blockchain RPC endpoints
const ETH_RPC_URL = process.env.ETH_RPC_URL || 'https://eth.llamarpc.com';
const SOL_RPC_URL = process.env.SOL_RPC_URL || 'https://api.mainnet-beta.solana.com';
// Initialize providers
const ethProvider = new ethers_1.ethers.JsonRpcProvider(ETH_RPC_URL);
const solConnection = new web3_js_1.Connection(SOL_RPC_URL, 'confirmed');
// Transaction logging helper
async function logTransaction(data) {
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
    }
    catch (error) {
        console.error('Failed to log transaction:', error);
    }
}
// Create MCP server
const server = new index_js_1.Server({
    name: 'mcp-chain',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Tool 1: Get Ethereum Balance
async function getEthBalance(address) {
    if (!ethers_1.ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
    }
    const balance = await ethProvider.getBalance(address);
    return {
        address,
        balance: ethers_1.ethers.formatEther(balance),
        balanceWei: balance.toString(),
        chain: 'ethereum',
    };
}
// Tool 2: Send Ethereum Transaction
async function sendEthTransaction(params) {
    const { privateKey, recipient, amount, minBalance } = params;
    if (!ethers_1.ethers.isAddress(recipient)) {
        throw new Error('Invalid recipient address');
    }
    const wallet = new ethers_1.ethers.Wallet(privateKey, ethProvider);
    // Check condition if minBalance is set
    if (minBalance !== undefined) {
        const balance = await ethProvider.getBalance(wallet.address);
        const balanceInEth = parseFloat(ethers_1.ethers.formatEther(balance));
        if (balanceInEth < minBalance) {
            return {
                success: false,
                message: `Condition not met: balance ${balanceInEth} ETH < minimum ${minBalance} ETH`,
            };
        }
    }
    const tx = await wallet.sendTransaction({
        to: recipient,
        value: ethers_1.ethers.parseEther(amount),
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
async function getSolBalance(address) {
    const publicKey = new web3_js_1.PublicKey(address);
    const balance = await solConnection.getBalance(publicKey);
    return {
        address,
        balance: (balance / web3_js_1.LAMPORTS_PER_SOL).toString(),
        balanceLamports: balance.toString(),
        chain: 'solana',
    };
}
// Tool 4: Send Solana Transaction
async function sendSolTransaction(params) {
    const { privateKey, recipient, amount, minBalance } = params;
    // Parse private key (expecting JSON array format)
    const secretKey = Uint8Array.from(JSON.parse(privateKey));
    const senderKeypair = web3_js_1.Keypair.fromSecretKey(secretKey);
    const recipientPubkey = new web3_js_1.PublicKey(recipient);
    // Check condition if minBalance is set
    if (minBalance !== undefined) {
        const balance = await solConnection.getBalance(senderKeypair.publicKey);
        const balanceInSol = balance / web3_js_1.LAMPORTS_PER_SOL;
        if (balanceInSol < minBalance) {
            return {
                success: false,
                message: `Condition not met: balance ${balanceInSol} SOL < minimum ${minBalance} SOL`,
            };
        }
    }
    const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPubkey,
        lamports: parseFloat(amount) * web3_js_1.LAMPORTS_PER_SOL,
    }));
    const signature = await (0, web3_js_1.sendAndConfirmTransaction)(solConnection, transaction, [
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
async function getMultiChainSummary(addresses) {
    const results = {
        ethereum: {},
        solana: {},
    };
    await Promise.allSettled(addresses.map(async (address) => {
        // Try Ethereum
        if (ethers_1.ethers.isAddress(address)) {
            try {
                const balance = await getEthBalance(address);
                results.ethereum[address] = balance;
            }
            catch (error) {
                results.ethereum[address] = { error: String(error) };
            }
        }
        // Try Solana
        try {
            const balance = await getSolBalance(address);
            results.solana[address] = balance;
        }
        catch (error) {
            results.solana[address] = { error: String(error) };
        }
    }));
    return results;
}
// Register tools with MCP server
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
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
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (!args) {
            throw new Error('No arguments provided');
        }
        switch (name) {
            case 'get_eth_balance': {
                const result = await getEthBalance(args.address);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }
            case 'send_eth_transaction': {
                const result = await sendEthTransaction(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }
            case 'get_sol_balance': {
                const result = await getSolBalance(args.address);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }
            case 'send_sol_transaction': {
                const result = await sendSolTransaction(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }
            case 'multi_chain_summary': {
                const result = await getMultiChainSummary(args.addresses);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
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
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('ChainMind MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map