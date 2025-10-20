import { NextRequest, NextResponse } from 'next/server';
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { logTransaction } from '@/lib/supabaseClient';

const SOL_RPC_URL = process.env.SOL_RPC_URL || 'https://api.mainnet-beta.solana.com';
const solConnection = new Connection(SOL_RPC_URL, 'confirmed');

export async function POST(request: NextRequest) {
  try {
    const { privateKey, recipient, amount, minBalance } = await request.json();

    if (!privateKey || !recipient || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse private key (expecting JSON array format)
    const secretKey = Uint8Array.from(JSON.parse(privateKey));
    const senderKeypair = Keypair.fromSecretKey(secretKey);
    const recipientPubkey = new PublicKey(recipient);

    // Check condition if minBalance is set
    if (minBalance !== undefined) {
      const balance = await solConnection.getBalance(senderKeypair.publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      if (balanceInSol < minBalance) {
        return NextResponse.json({
          success: false,
          message: `Condition not met: balance ${balanceInSol} SOL < minimum ${minBalance} SOL`,
        });
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

    return NextResponse.json({
      success: true,
      signature,
      sender: senderKeypair.publicKey.toString(),
      recipient,
      amount,
      chain: 'solana',
    });
  } catch (error) {
    console.error('Error sending SOL transaction:', error);
    return NextResponse.json(
      { error: 'Failed to send transaction', details: String(error) },
      { status: 500 }
    );
  }
}
