"use client";

import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchGatewayBalance, fetchAdminTransactions } from "@/lib/api";

export default function WalletPage() {
  const [gatewayBalance, setGatewayBalance] = useState<string>("Loading...");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [balData, txs] = await Promise.all([
          fetchGatewayBalance(),
          fetchAdminTransactions()
        ]);
        setGatewayBalance(balData?.balance || "₹0.00");
        setTransactions(txs || []);
      } catch (err) {
        console.error("Error loading wallet data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const deposits = transactions.filter(tx => tx.type === 'deposit' && tx.status === 'success');
  const withdrawals = transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'success');
  
  const totalDeposits = deposits.reduce((sum, tx) => sum + parseFloat(tx.amount || "0"), 0);
  const totalWithdrawals = withdrawals.reduce((sum, tx) => sum + parseFloat(tx.amount || "0"), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Wallet className="w-6 h-6 text-neon-emerald drop-shadow-[0_0_8px_var(--color-neon-emerald)]" />
          Treasury & Wallets
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl glass-panel border-t border-neon-emerald/50">
          <p className="text-sm text-gray-400 mb-1">Gateway Liquidity (PayfromUPI)</p>
          <h3 className="text-3xl font-black text-white">{gatewayBalance}</h3>
        </div>
        <div className="p-6 rounded-xl glass-panel border-t border-neon-blue/50">
          <p className="text-sm text-gray-400 mb-1">Total Lifetime Deposits</p>
          <h3 className="text-3xl font-black text-white text-neon-blue">+₹{totalDeposits.toLocaleString()}</h3>
        </div>
        <div className="p-6 rounded-xl glass-panel border-t border-neon-magenta/50">
          <p className="text-sm text-gray-400 mb-1">Total Lifetime Withdrawals</p>
          <h3 className="text-3xl font-black text-white text-neon-magenta">-₹{totalWithdrawals.toLocaleString()}</h3>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Ledger Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400 min-w-[800px]">
            <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">TXID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading ledger...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500">{tx.id || tx.txn_id}</td>
                    <td className="px-6 py-4 font-medium text-white">{tx.user || tx.user_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tx.type === 'deposit' ? <ArrowDownRight className="w-4 h-4 text-neon-emerald" /> : <ArrowUpRight className="w-4 h-4 text-neon-magenta" />}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{tx.method || "UPI"}</td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${tx.type === 'deposit' ? 'text-neon-emerald' : 'text-neon-magenta'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        tx.status === 'success' ? 'bg-neon-emerald/20 text-neon-emerald' : 
                        tx.status === 'failed' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
