import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SOL_RPC_URL = process.env.SOL_RPC_URL || 'https://api.mainnet-beta.solana.com';
const solConnection = new Connection(SOL_RPC_URL, 'confirmed');

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const publicKey = new PublicKey(address);
    const balance = await solConnection.getBalance(publicKey);
    
    return NextResponse.json({
      address,
      balance: (balance / LAMPORTS_PER_SOL).toString(),
      balanceLamports: balance.toString(),
      chain: 'solana',
    });
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance', details: String(error) },
      { status: 500 }
    );
  }
}
