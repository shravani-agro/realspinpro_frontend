"use client";

import { useState, useEffect, use } from "react";
import { 
  fetchAdminUserDetail, 
  blockAdminUser, 
  setAdminUserLimit, 
  adminAddUserBalance,
  fetchAdminUserTransactions,
  fetchAdminUserBets
} from "@/lib/api";
import { 
  ArrowLeft, User, Building2, MapPin, Contact, Wallet, 
  Search, ShieldAlert, Loader2, PlusCircle, Activity,
  ArrowUpRight, ArrowDownRight, Dices, LogIn
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatIST } from "@/utils/dateFormatter";

type Tab = 'profile' | 'risk' | 'wallet' | 'bets' | 'login';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [walletSubTab, setWalletSubTab] = useState<'all' | 'deposits' | 'withdrawals' | 'adjustments' | 'failed'>('all');
  
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // For Contacts
  const [contactSearch, setContactSearch] = useState("");
  const [visibleContacts, setVisibleContacts] = useState(50);
  
  // Admin Action States
  const [limitInput, setLimitInput] = useState<string>("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSavingLimit, setIsSavingLimit] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // Add Money States
  const [addMoneyAmount, setAddMoneyAmount] = useState<string>("");
  const [addMoneyNote, setAddMoneyNote] = useState<string>("");
  const [isAddingMoney, setIsAddingMoney] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, txRes, betRes] = await Promise.allSettled([
          fetchAdminUserDetail(resolvedParams.id),
          fetchAdminUserTransactions(resolvedParams.id),
          fetchAdminUserBets(resolvedParams.id)
        ]);

        if (userRes.status === 'fulfilled') {
          const data = userRes.value;
          if (data?.mobile_data?.contacts && typeof data.mobile_data.contacts === 'string') {
            try { data.mobile_data.contacts = JSON.parse(data.mobile_data.contacts); } catch (e) { data.mobile_data.contacts = []; }
          }
          if (data?.mobile_data?.location && typeof data.mobile_data.location === 'string') {
            try { data.mobile_data.location = JSON.parse(data.mobile_data.location); } catch (e) { data.mobile_data.location = {}; }
          }
          setUser(data);
          if (limitInput === "") setLimitInput(data.limit?.toString() || "0");
        }

        if (txRes.status === 'fulfilled') {
          setTransactions(txRes.value || []);
        }
        
        if (betRes.status === 'fulfilled') {
          setBets(betRes.value || []);
        }

      } catch (err: any) {
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [resolvedParams.id]);

  useEffect(() => {
    const loc = user?.mobile_data?.location;
    if (loc && loc.lat && loc.lng && !address) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) setAddress(data.display_name);
        })
        .catch(err => console.error("Geocoding failed", err));
    }
  }, [user, address]);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (!user) return <div className="p-8 text-center text-red-600">User not found</div>;

  const renderProfileTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl space-y-4 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Basic Information
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Username</span>
            <span className="text-slate-900 font-medium">{user.username || "Not set"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Mobile</span>
            <span className="text-slate-900 font-medium">{user.mobile ? user.mobile.replace(/.(?=.{4})/g, '*') : "-"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Email</span>
            <span className="text-slate-900 font-medium">{user.email || "Not set"}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-slate-500">Wallet Balance</span>
            <span className="text-blue-600 font-bold text-lg">₹{user.balance_cached}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl space-y-4 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-600" /> Bank Details
        </h3>
        {user.bank_details ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Bank Name</span>
              <span className="text-slate-900 font-medium">{user.bank_details.bank_name || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Account No.</span>
              <span className="text-slate-900 font-mono">{user.bank_details.account_number ? user.bank_details.account_number.replace(/.(?=.{4})/g, '*') : "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">IFSC</span>
              <span className="text-slate-900 font-mono">{user.bank_details.ifsc_code || "-"}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">UPI ID</span>
              <span className="text-slate-900 font-mono">{user.bank_details.upi_id ? user.bank_details.upi_id.replace(/^.(.*)@/, (m: string, p1: string) => m[0] + '*'.repeat(p1.length) + '@') : "-"}</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic">No bank details added by user.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl space-y-4 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" /> Synced Location
        </h3>
        {user.mobile_data?.location && Object.keys(user.mobile_data.location).length > 0 ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Latitude/Longitude</span>
              <span className="text-slate-900 font-mono">*** / ***</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Place (Address)</span>
              <span className="text-slate-900 text-right max-w-[60%]">{address ? address : <span className="text-slate-400 animate-pulse">Calculating...</span>}</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic">No location synced yet.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl space-y-4 flex flex-col max-h-[400px] border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Contact className="w-5 h-5 text-yellow-600" /> Synced Contacts
          </h3>
        </div>
        {user.mobile_data?.contacts && user.mobile_data.contacts.length > 0 ? (
          <>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search contacts..."
                value={contactSearch}
                onChange={(e) => { setContactSearch(e.target.value); setVisibleContacts(50); }}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900"
              />
            </div>
            <div className="overflow-y-auto custom-scrollbar pr-2 space-y-2 flex-1">
              {user.mobile_data.contacts
                .filter((c: any) => (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || (c.phone && c.phone.includes(contactSearch)))
                .slice(0, visibleContacts)
                .map((c: any, idx: number) => (
                  <div key={idx} className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-900 text-sm truncate pr-4">{c.name || "Unknown"}</span>
                    <span className="text-slate-500 text-xs font-mono shrink-0">{c.phone ? c.phone.replace(/.(?=.{4})/g, '*') : "-"}</span>
                  </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm italic">No contacts synced yet.</p>
        )}
      </div>
    </div>
  );

  const renderRiskTab = () => (
    <div className="space-y-6">
      {/* Financial Summary (PnL) */}
      {user.financials && (
        <div className="bg-white p-6 rounded-xl space-y-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" /> Lifetime Risk Profile & PnL
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Deposits</div>
              <div className="text-lg font-black text-emerald-600">₹{(user.financials.total_deposits || 0).toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Withdrawals</div>
              <div className="text-lg font-black text-purple-600">₹{(user.financials.total_withdrawals || 0).toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Lifetime Bets</div>
              <div className="text-lg font-black text-blue-600">₹{(user.financials.lifetime_bets || 0).toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Lifetime Wins</div>
              <div className="text-lg font-black text-emerald-600">₹{(user.financials.lifetime_payouts || 0).toLocaleString()}</div>
            </div>
            <div className={`p-4 rounded-xl border relative overflow-hidden ${user.financials.net_profit > 0 ? 'bg-red-50 border-red-200' : user.financials.net_profit < 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xs uppercase font-bold tracking-wider mb-1 z-10 relative text-slate-600">
                House Profit
              </div>
              <div className={`text-xl font-black z-10 relative ${user.financials.net_profit > 0 ? 'text-red-700' : user.financials.net_profit < 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                {user.financials.net_profit < 0 ? '+' : ''}₹{((user.financials.net_profit || 0) * -1).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 z-10 relative">
                {user.financials.net_profit > 0 ? "⚠️ High Risk: User is beating the house" : user.financials.net_profit < 0 ? "House is profiting off user" : "Break Even"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Actions */}
      <div className="bg-red-50 p-6 rounded-xl space-y-4 border border-red-200 shadow-sm">
        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" /> Account Controls
        </h3>
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex-1">
            <p className="text-sm text-red-700 mb-2">Block or unblock this user account immediately.</p>
            <button 
              disabled={isBlocking}
              onClick={async () => {
                try {
                  setIsBlocking(true);
                  const newStatus = !user.is_blocked;
                  await blockAdminUser(user.id, newStatus);
                  setUser({ ...user, is_blocked: newStatus });
                  toast.success(`User successfully ${newStatus ? 'blocked' : 'unblocked'}.`);
                } catch(e: any) {
                  toast.error("Failed to block/unblock user");
                } finally {
                  setIsBlocking(false);
                }
              }}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 ${user.is_blocked ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' : 'bg-white hover:bg-red-100 hover:text-red-700 text-red-600 border border-red-200'} disabled:opacity-50`}
            >
              {isBlocking && <Loader2 className="w-4 h-4 animate-spin" />}
              {user.is_blocked ? "ACCOUNT BLOCKED (Click to Unblock)" : "BLOCK ACCOUNT"}
            </button>
          </div>
          <div className="flex-1 w-full sm:w-auto">
             <p className="text-sm text-red-700 mb-2">Update User Custom Limit</p>
             <div className="flex gap-2">
               <input 
                 type="number" 
                 value={limitInput}
                 onChange={(e) => setLimitInput(e.target.value)}
                 className="bg-white border border-red-200 rounded-lg px-4 py-2 text-slate-900 flex-1 focus:outline-none"
               />
               <button 
                 disabled={isSavingLimit}
                 onClick={async () => {
                   const val = parseInt(limitInput);
                   if (isNaN(val) || val < 0) return toast.error("Enter a valid positive limit.");
                   try {
                     setIsSavingLimit(true);
                     await setAdminUserLimit(user.id, val);
                     setUser({ ...user, limit: val });
                     toast.success("User limit updated");
                   } catch(e: any) {
                     toast.error("Failed to update limit");
                   } finally {
                     setIsSavingLimit(false);
                   }
                 }}
                 className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
               >
                 {isSavingLimit ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
               </button>
             </div>
          </div>
        </div>

        {/* Add Money Section */}
        <div className="border-t border-red-200 pt-5 mt-2">
          <p className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add Money to Wallet
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="number"
              min="1"
              value={addMoneyAmount}
              onChange={(e) => setAddMoneyAmount(e.target.value)}
              className="bg-white border border-emerald-300 rounded-lg px-4 py-2 text-slate-900 w-full sm:w-40"
              placeholder="Amount (₹)"
            />
            <input
              type="text"
              value={addMoneyNote}
              onChange={(e) => setAddMoneyNote(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 flex-1"
              placeholder="Note (e.g. UPI reference)"
            />
            <button
              disabled={isAddingMoney}
              onClick={async () => {
                const val = parseInt(addMoneyAmount);
                if (isNaN(val) || val <= 0) return toast.error("Enter valid amount");
                try {
                  setIsAddingMoney(true);
                  const idempKey = `admin_credit_${user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                  await adminAddUserBalance(user.id, val, addMoneyNote, idempKey);
                  setUser({ ...user, balance_cached: (user.balance_cached || 0) + val });
                  setAddMoneyAmount(""); setAddMoneyNote("");
                  toast.success(`₹${val} credited successfully!`);
                  // Refresh TXs
                  const txRes = await fetchAdminUserTransactions(resolvedParams.id);
                  setTransactions(txRes || []);
                } catch (e: any) {
                  toast.error("Failed to add money");
                } finally {
                  setIsAddingMoney(false);
                }
              }}
              className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              {isAddingMoney ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Money"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWalletTab = () => {
    let filteredTxs = transactions;
    if (walletSubTab === 'deposits') filteredTxs = transactions.filter(t => t.type === 'deposit');
    if (walletSubTab === 'withdrawals') filteredTxs = transactions.filter(t => t.type === 'withdrawal');
    if (walletSubTab === 'adjustments') filteredTxs = transactions.filter(t => t.type === 'admin_credit');
    if (walletSubTab === 'failed') filteredTxs = transactions.filter(t => t.status === 'failed');

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {['all', 'deposits', 'withdrawals', 'adjustments', 'failed'].map(sub => (
            <button
              key={sub}
              onClick={() => setWalletSubTab(sub as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${walletSubTab === sub ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </button>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">TXID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTxs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-500">No transactions found</td></tr>
                ) : filteredTxs.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{tx.id}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-700' :
                        tx.type === 'admin_credit' ? 'bg-blue-50 text-blue-700' :
                        'bg-purple-50 text-purple-700'
                      }`}>
                        {tx.type === 'deposit' && <ArrowDownRight className="w-3.5 h-3.5" />}
                        {tx.type === 'withdrawal' && <ArrowUpRight className="w-3.5 h-3.5" />}
                        {tx.type === 'admin_credit' && <PlusCircle className="w-3.5 h-3.5" />}
                        {tx.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{tx.amount}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.upi_id || '-'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">{formatIST(tx.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                        tx.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderBetsTab = () => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
            <tr>
              <th className="px-6 py-4">Bet ID</th>
              <th className="px-6 py-4">Game</th>
              <th className="px-6 py-4">Bet Amount</th>
              <th className="px-6 py-4">Multiplier</th>
              <th className="px-6 py-4 text-right">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bets.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-slate-500">No bets found</td></tr>
            ) : bets.map((bet: any, idx: number) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{bet.id}</td>
                <td className="px-6 py-4 font-medium text-slate-700 capitalize">{bet.game}</td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{bet.amount}</td>
                <td className="px-6 py-4 font-mono text-slate-700">{bet.multiplier}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    bet.status === 'won' ? 'bg-emerald-100 text-emerald-700' :
                    bet.status === 'lost' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {bet.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">{formatIST(bet.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLoginTab = () => (
    <div className="bg-slate-50 border border-slate-200 border-dashed p-12 rounded-xl flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <LogIn className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Login History Coming Soon</h3>
      <p className="text-slate-500 max-w-md">
        Session and login device tracking is slated for a future update. This will track IPs and device fingerprints to prevent multi-accounting.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/users" className="p-2 rounded-lg bg-white border border-slate-300 shadow-sm hover:bg-slate-50 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User #{user.id}</h1>
          <p className="text-sm text-slate-500">Joined {formatIST(user.created_at)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-slate-200">
        {[
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'risk', label: 'Account Status & Risk', icon: ShieldAlert },
          { id: 'wallet', label: 'Wallet & Transactions', icon: Wallet },
          { id: 'bets', label: 'Betting History', icon: Dices },
          { id: 'login', label: 'Sessions & Logins', icon: LogIn }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white text-blue-700 border border-slate-200 border-b-white translate-y-[1px]"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'risk' && renderRiskTab()}
        {activeTab === 'wallet' && renderWalletTab()}
        {activeTab === 'bets' && renderBetsTab()}
        {activeTab === 'login' && renderLoginTab()}
      </div>
    </div>
  );
}
