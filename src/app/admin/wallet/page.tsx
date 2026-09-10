"use client";

import { ArrowUpRight, ArrowDownRight, Wallet, AlertTriangle, ShieldCheck, Activity, Landmark } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  fetchGatewayBalance, 
  fetchAdminTransactions, 
  fetchAdminStats, 
  fetchAdminUsers, 
  fetchAdminAuditLogs,
  adminAddUserBalance
} from "@/lib/api";
import { toast } from "sonner";
import { formatIST } from "@/utils/dateFormatter";

type Tab = 'overview' | 'deposits' | 'withdrawals' | 'pending' | 'failed' | 'reconciliation' | 'adjustments' | 'audit';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  const [gatewayBalance, setGatewayBalance] = useState<string>("Loading...");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [adjUserId, setAdjUserId] = useState<string>("");
  const [adjAmount, setAdjAmount] = useState<string>("");
  const [adjNote, setAdjNote] = useState<string>("");
  const [adjLoading, setAdjLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [balResult, txsResult, statsResult, usersResult, auditResult] = await Promise.allSettled([
          fetchGatewayBalance(),
          fetchAdminTransactions(),
          fetchAdminStats("lifetime"),
          fetchAdminUsers(),
          fetchAdminAuditLogs()
        ]);
        
        setGatewayBalance(balResult.status === 'fulfilled' ? (balResult.value?.balance || "₹0.00") : "Error");
        setTransactions(txsResult.status === 'fulfilled' ? (txsResult.value || []) : []);
        setStats(statsResult.status === 'fulfilled' ? statsResult.value : null);
        setUsers(usersResult.status === 'fulfilled' ? (usersResult.value || []) : []);
        
        if (auditResult.status === 'fulfilled' && auditResult.value) {
          const financialLogs = auditResult.value.filter((l: any) => 
            l.action.includes('Balance') || l.action.includes('Withdrawal')
          );
          setAuditLogs(financialLogs);
        }
        
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
  const pendingTxs = transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'pending');
  const failedTxs = transactions.filter(tx => tx.status === 'failed');

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjUserId || !adjAmount || !adjNote) {
      toast.error("Please fill all fields");
      return;
    }
    setAdjLoading(true);
    try {
      const idempotencyKey = `adj_${Date.now()}_${adjUserId}`;
      await adminAddUserBalance(parseInt(adjUserId), parseInt(adjAmount), adjNote, idempotencyKey);
      toast.success(`Successfully credited ₹${adjAmount} to user #${adjUserId}`);
      setAdjUserId("");
      setAdjAmount("");
      setAdjNote("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add balance");
    } finally {
      setAdjLoading(false);
    }
  };

  const renderTransactionsTable = (txs: any[], emptyMsg: string) => (
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
          {txs.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-500">{emptyMsg}</td>
            </tr>
          ) : (
            txs.map((tx) => (
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
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Wallet className="w-6 h-6 text-emerald-600" />
          Treasury & Wallets
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {(['overview', 'deposits', 'withdrawals', 'pending', 'failed', 'reconciliation', 'adjustments', 'audit'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 whitespace-nowrap text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab === 'pending' ? 'Pending Withdrawals' : 
               tab === 'failed' ? 'Failed Txs' :
               tab === 'adjustments' ? 'Balance Adjustments' :
               tab === 'audit' ? 'Financial Audit' :
               tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading wallet data...</div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden min-h-[400px]">
          
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 border-t-4 border-t-emerald-500">
                  <p className="text-sm text-slate-500 mb-1">Gateway Liquidity</p>
                  <h3 className="text-2xl font-black text-slate-900">{gatewayBalance}</h3>
                </div>
                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 border-t-4 border-t-blue-500">
                  <p className="text-sm text-slate-500 mb-1">Lifetime Deposits</p>
                  <h3 className="text-2xl font-black text-blue-600">+₹{stats?.total_deposit?.toLocaleString() || "0"}</h3>
                </div>
                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 border-t-4 border-t-fuchsia-500">
                  <p className="text-sm text-slate-500 mb-1">Lifetime Withdrawals</p>
                  <h3 className="text-2xl font-black text-fuchsia-600">-₹{stats?.total_withdraw?.toLocaleString() || "0"}</h3>
                </div>
                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 border-t-4 border-t-amber-500">
                  <p className="text-sm text-slate-500 mb-1">Total System User Balances</p>
                  <h3 className="text-2xl font-black text-amber-600">₹{stats?.total_wallet_balance?.toLocaleString() || "0"}</h3>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deposits' && renderTransactionsTable(deposits, "No deposits found.")}
          {activeTab === 'withdrawals' && renderTransactionsTable(withdrawals, "No successful withdrawals found.")}
          {activeTab === 'pending' && renderTransactionsTable(pendingTxs, "No pending withdrawals.")}
          {activeTab === 'failed' && renderTransactionsTable(failedTxs, "No failed transactions.")}

          {activeTab === 'reconciliation' && (
            <div className="p-8 max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Wallet Reconciliation Check
              </h2>
              <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total External Deposits (A)</span>
                  <span className="font-mono font-medium text-emerald-600">+ ₹{stats?.total_deposit || 0}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total External Withdrawals (B)</span>
                  <span className="font-mono font-medium text-fuchsia-600">- ₹{stats?.total_withdraw || 0}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Bets Placed (C)</span>
                  <span className="font-mono font-medium">- ₹{stats?.total_bets || 0}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Payouts Won (D)</span>
                  <span className="font-mono font-medium">+ ₹{stats?.total_payout || 0}</span>
                </div>
                <div className="border-t border-slate-300 my-2 pt-2 flex justify-between items-center font-bold text-slate-900">
                  <span>Calculated Expected Balances (A - B - C + D)</span>
                  <span className="font-mono">₹{((stats?.total_deposit || 0) - (stats?.total_withdraw || 0) - (stats?.total_bets || 0) + (stats?.total_payout || 0))}</span>
                </div>
                <div className="border-t-2 border-slate-300 mt-4 pt-4 flex justify-between items-center font-black text-lg text-slate-900">
                  <span>Actual User Wallet Balances in DB</span>
                  <span className="font-mono">₹{stats?.total_wallet_balance || 0}</span>
                </div>
              </div>
              
              {(((stats?.total_deposit || 0) - (stats?.total_withdraw || 0) - (stats?.total_bets || 0) + (stats?.total_payout || 0)) === (stats?.total_wallet_balance || 0)) ? (
                <div className="mt-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <h4 className="font-bold">System Balanced</h4>
                    <p className="text-sm opacity-90">Calculated expected balances perfectly match actual database balances.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <h4 className="font-bold">Discrepancy Detected</h4>
                    <p className="text-sm opacity-90">
                      Actual balances do not match expected balances. This can happen if admins manually adjusted balances (credited bonuses) without external deposits.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'adjustments' && (
            <div className="p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" />
                Manual Balance Adjustment
              </h2>
              <p className="text-sm text-slate-500 mb-8">Use this tool to credit user wallets directly. This should only be used if a user transferred money externally (e.g., via direct UPI to the admin) or for promotional bonuses.</p>
              
              <form onSubmit={handleAddBalance} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select User</label>
                  <select 
                    value={adjUserId}
                    onChange={(e) => setAdjUserId(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">-- Choose User --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>#{u.id} - {u.username || "Anonymous"} ({u.mobile})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Credit (₹)</label>
                  <input 
                    type="number"
                    min="1"
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Note (Required)</label>
                  <input 
                    type="text"
                    value={adjNote}
                    onChange={(e) => setAdjNote(e.target.value)}
                    placeholder="e.g. Received via PhonePe"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={adjLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {adjLoading ? "Processing..." : "Credit Balance"}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                  <tr>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Admin</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No financial audit logs found.</td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatIST(log.created_at)}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{log.admin_username}</td>
                        <td className="px-6 py-4 font-semibold text-blue-600">{log.action}</td>
                        <td className="px-6 py-4">
                          <pre className="text-xs text-slate-500 bg-slate-100 p-2 rounded max-w-md overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
