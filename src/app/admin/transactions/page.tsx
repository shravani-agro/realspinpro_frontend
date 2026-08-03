"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, Filter, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { updateAdminTransactionStatus, fetchAdminTransactions } from "@/lib/api";
import { toast } from "sonner";
import { formatIST } from "@/utils/dateFormatter";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = () => {
    setLoading(true);
    fetchAdminTransactions(startDate, endDate)
      .then((data) => {
        setTransactions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load transactions", err);
        toast.error("Failed to load transactions: " + err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setProcessingId(id);
      await updateAdminTransactionStatus(id.toString(), status);
      // Optimistic update
      setTransactions((prev) => 
        prev.map(tx => tx.id === id ? { ...tx, status } : tx)
      );
      toast.success(`Transaction ${status === 'success' ? 'approved' : 'rejected'} successfully.`);
    } catch (err: any) {
      console.error("Failed to update status", err);
      toast.error("Error updating transaction status: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredTx = transactions.filter(tx => {
    const username = tx.username || "Anonymous";
    const matchesSearch = username.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.toString().includes(searchTerm);
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-gray-400">Manage user deposits and withdrawal requests.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadData} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex items-center gap-2 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search TX ID or User..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "deposit", "withdrawal"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                typeFilter === type 
                  ? "bg-white/10 text-white border border-white/20" 
                  : "bg-transparent text-gray-400 border border-transparent hover:bg-white/5"
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col gap-1 text-sm text-gray-400">
          <label>Start Date</label>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-blue/50"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm text-gray-400">
          <label>End Date</label>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-blue/50"
          />
        </div>
        <div className="flex items-end pb-1">
          <button 
            onClick={() => { setStartDate(""); setEndDate(""); }}
            className="text-red-400 hover:text-red-300 px-2 py-1 text-sm"
          >
            Clear Dates
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          {loading && transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Loading transactions...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-4 text-sm font-semibold text-gray-400">Type</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">TX ID</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">User</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Amount</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      {tx.type === "deposit" ? (
                        <div className="flex items-center gap-2 text-neon-emerald">
                          <div className="w-8 h-8 rounded-full bg-neon-emerald/10 flex items-center justify-center">
                            <ArrowDownLeft className="w-4 h-4" />
                          </div>
                          <span className="font-semibold capitalize">Deposit</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-neon-purple">
                            <div className="w-8 h-8 rounded-full bg-neon-purple/10 flex items-center justify-center">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                            <span className="font-semibold capitalize">Withdrawal</span>
                          </div>
                          {tx.type === "withdrawal" && tx.upi_id && (
                            <div className="mt-2 text-xs text-neon-purple/70 font-mono bg-neon-purple/5 px-2 py-1 rounded">
                              UPI: {tx.upi_id}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-400">#{tx.id}</td>
                    <td className="p-4 font-medium text-white">{tx.username || "Anonymous"}</td>
                    <td className="p-4 font-bold text-white">₹{Math.abs(tx.amount)}</td>
                    <td className="p-4">
                      {tx.status === "success" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-emerald/10 text-neon-emerald text-xs font-bold border border-neon-emerald/20"><CheckCircle className="w-3 h-3" /> Success</span>}
                      {tx.status === "failed" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20"><XCircle className="w-3 h-3" /> Failed</span>}
                      {tx.status === "pending" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20"><RefreshCw className="w-3 h-3 animate-spin" /> Pending</span>}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {formatIST(tx.created_at)}
                    </td>
                    <td className="p-4 text-right">
                      {tx.status === "pending" ? (
                        tx.type === "withdrawal" ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              disabled={processingId === tx.id}
                              onClick={() => handleUpdateStatus(tx.id, "success")}
                              className="p-2 bg-neon-emerald/10 hover:bg-neon-emerald/20 text-neon-emerald rounded-lg transition-colors border border-neon-emerald/20 disabled:opacity-50"
                              title="Approve & Send via PayfromUPI"
                            >
                              {processingId === tx.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button 
                              disabled={processingId === tx.id}
                              onClick={() => handleUpdateStatus(tx.id, "failed")}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20 disabled:opacity-50"
                              title="Reject & Refund"
                            >
                              {processingId === tx.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <span className="text-xs text-gray-500 italic mr-2">Auto-verifying via PayfromUPI</span>
                            <button 
                              disabled={processingId === tx.id}
                              onClick={() => handleUpdateStatus(tx.id, "failed")}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20 disabled:opacity-50"
                              title="Cancel Deposit"
                            >
                              {processingId === tx.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-600 text-sm italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredTx.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
