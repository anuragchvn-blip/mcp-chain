import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { logTransaction } from '@/lib/supabaseClient';

const ETH_RPC_URL = process.env.ETH_RPC_URL || 'https://eth.llamarpc.com';
const ethProvider = new ethers.JsonRpcProvider(ETH_RPC_URL);

export async function POST(request: NextRequest) {
  try {
    const { privateKey, recipient, amount, minBalance } = await request.json();

    if (!privateKey || !recipient || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!ethers.isAddress(recipient)) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    }

    const wallet = new ethers.Wallet(privateKey, ethProvider);

    // Check condition if minBalance is set
    if (minBalance !== undefined) {
      const balance = await ethProvider.getBalance(wallet.address);
      const balanceInEth = parseFloat(ethers.formatEther(balance));
      if (balanceInEth < minBalance) {
        return NextResponse.json({
          success: false,
          message: `Condition not met: balance ${balanceInEth} ETH < minimum ${minBalance} ETH`,
        });
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

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      sender: wallet.address,
      recipient,
      amount,
      chain: 'ethereum',
    });
  } catch (error) {
    console.error('Error sending ETH transaction:', error);
    return NextResponse.json(
      { error: 'Failed to send transaction', details: String(error) },
      { status: 500 }
    );
  }
}
