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
        const [balResult, txsResult] = await Promise.allSettled([
          fetchGatewayBalance(),
          fetchAdminTransactions()
        ]);
        
        setGatewayBalance(balResult.status === 'fulfilled' ? (balResult.value?.balance || "₹0.00") : "Error");
        setTransactions(txsResult.status === 'fulfilled' ? (txsResult.value || []) : []);
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Wallet className="w-6 h-6 text-emerald-600" />
          Treasury & Wallets
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
          <p className="text-sm text-slate-500 mb-1">Withdrawal Gateway Liquidity</p>
          <h3 className="text-3xl font-black text-slate-900">{gatewayBalance}</h3>
        </div>
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm border-t-4 border-t-blue-500">
          <p className="text-sm text-slate-500 mb-1">Total Lifetime Deposits</p>
          <h3 className="text-3xl font-black text-blue-600">+₹{totalDeposits.toLocaleString()}</h3>
        </div>
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm border-t-4 border-t-fuchsia-500">
          <p className="text-sm text-slate-500 mb-1">Total Lifetime Withdrawals</p>
          <h3 className="text-3xl font-black text-fuchsia-600">-₹{totalWithdrawals.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Ledger Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">TXID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading ledger...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">{tx.id || tx.txn_id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{tx.user || tx.user_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tx.type === 'deposit' ? <ArrowDownRight className="w-4 h-4 text-emerald-600" /> : <ArrowUpRight className="w-4 h-4 text-fuchsia-600" />}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{tx.method || "UPI"}</td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        tx.status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                        tx.status === 'failed' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
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
