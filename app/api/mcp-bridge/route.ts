import { NextRequest, NextResponse } from 'next/server';

/**
 * MCP Bridge API
 * Directly implements MCP tools without spawning a separate process
 * This works better in serverless environments like Vercel
 */

export async function POST(request: NextRequest) {
  try {
    const { tool, arguments: args } = await request.json();

    if (!tool || !args) {
      return NextResponse.json(
        { error: 'Missing tool or arguments' },
        { status: 400 }
      );
    }

    // Route to appropriate API endpoint
    let apiEndpoint = '';
    switch (tool) {
      case 'get_eth_balance':
        apiEndpoint = '/api/get-eth-balance';
        break;
      case 'get_sol_balance':
        apiEndpoint = '/api/get-sol-balance';
        break;
      case 'send_eth_transaction':
        apiEndpoint = '/api/send-eth-transaction';
        break;
      case 'send_sol_transaction':
        apiEndpoint = '/api/send-sol-transaction';
        break;
      case 'multi_chain_summary':
        // Handle multi-chain summary by calling multiple endpoints
        return await handleMultiChainSummary(args);
      default:
        return NextResponse.json(
          { error: `Unknown tool: ${tool}` },
          { status: 400 }
        );
    }

    // Call the appropriate API endpoint
    const baseUrl = request.nextUrl.origin;
    const response = await fetch(`${baseUrl}${apiEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    const result = await response.json();
    return NextResponse.json({ result });
  } catch (error) {
    console.error('MCP Bridge Error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Handle multi-chain summary by calling both ETH and SOL balance endpoints
 */
async function handleMultiChainSummary(args: { addresses: string[] }): Promise<NextResponse> {
  try {
    const { addresses } = args;
    
    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Invalid addresses array' },
        { status: 400 }
      );
    }

    const result = {
      ethereum: {} as Record<string, any>,
      solana: {} as Record<string, any>,
    };

    // Detect address types and fetch balances
    for (const address of addresses) {
      if (address.startsWith('0x')) {
        // Ethereum address
        try {
          const ethResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-eth-balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
          });
          const ethData = await ethResponse.json();
          result.ethereum[address] = ethData;
        } catch (error) {
          result.ethereum[address] = { error: String(error) };
        }
      } else {
        // Assume Solana address
        try {
          const solResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-sol-balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
          });
          const solData = await solResponse.json();
          result.solana[address] = solData;
        } catch (error) {
          result.solana[address] = { error: String(error) };
        }
      }
    }

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
