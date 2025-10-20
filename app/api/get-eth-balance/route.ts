import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const ETH_RPC_URL = process.env.ETH_RPC_URL || 'https://eth.llamarpc.com';
const ethProvider = new ethers.JsonRpcProvider(ETH_RPC_URL);

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    if (!ethers.isAddress(address)) {
      return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 });
    }

    const balance = await ethProvider.getBalance(address);
    
    return NextResponse.json({
      address,
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString(),
      chain: 'ethereum',
    });
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance', details: String(error) },
      { status: 500 }
    );
  }
}
