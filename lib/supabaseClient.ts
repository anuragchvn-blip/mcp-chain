import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function logTransaction(data: {
  blockchain: 'eth' | 'sol';
  tx_hash: string;
  sender: string;
  recipient: string;
  amount: string;
}) {
  if (!supabase) {
    console.log('Supabase not configured, skipping transaction log');
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
