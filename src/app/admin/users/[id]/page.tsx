"use client";

import { useState, useEffect, use, useMemo } from "react";
import { fetchAdminUserDetail, blockAdminUser, setAdminUserLimit, adminAddUserBalance } from "@/lib/api";
import { ArrowLeft, User, Phone, Mail, Building2, MapPin, Contact, Calendar, Wallet, Search, ShieldAlert, Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatIST } from "@/utils/dateFormatter";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<any>(null);
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
    fetchAdminUserDetail(resolvedParams.id)
      .then((data) => {
        // Parse mobile data if it's stringified JSON
        if (data?.mobile_data?.contacts && typeof data.mobile_data.contacts === 'string') {
          try {
            data.mobile_data.contacts = JSON.parse(data.mobile_data.contacts);
          } catch (e) {
            data.mobile_data.contacts = [];
          }
        }
        if (data?.mobile_data?.location && typeof data.mobile_data.location === 'string') {
          try {
            data.mobile_data.location = JSON.parse(data.mobile_data.location);
          } catch (e) {
            data.mobile_data.location = {};
          }
        }
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load user detail", err);
        toast.error("Failed to load user details: " + err.message);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  // Set initial limit when user loads
  useEffect(() => {
    if (user && limitInput === "") {
      setLimitInput(user.limit?.toString() || "0");
    }
  }, [user]);

  useEffect(() => {
    const loc = user?.mobile_data?.location;
    if (loc && loc.lat && loc.lng && !address) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch(err => console.error("Geocoding failed", err));
    }
  }, [user, address]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading user details...</div>;
  if (!user) return <div className="p-8 text-center text-red-600">User not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="p-2 rounded-lg bg-white border border-slate-300 shadow-sm hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User #{user.id}</h1>
          <p className="text-sm text-slate-500">Joined {formatIST(user.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Actions */}
        <div className="bg-red-50 p-6 rounded-xl space-y-4 md:col-span-2 border border-red-200 shadow-sm">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" /> Admin Management Actions
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
                    toast.error("Failed to block/unblock user: " + e.message);
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
                   className="bg-white border border-red-200 rounded-lg px-4 py-2 text-slate-900 flex-1 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                   placeholder="Enter new limit"
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
                       toast.success("User limit updated successfully.");
                     } catch(e: any) {
                       toast.error("Failed to update limit: " + e.message);
                     } finally {
                       setIsSavingLimit(false);
                     }
                   }}
                   className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                 >
                   {isSavingLimit && <Loader2 className="w-4 h-4 animate-spin" />}
                   Save Limit
                 </button>
               </div>
            </div>
          </div>

          {/* Add Money Section */}
          <div className="border-t border-red-200 pt-5 mt-2">
            <p className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Add Money to Wallet
            </p>
            <p className="text-xs text-red-700 mb-3">
              Use this after you have manually sent money to the user via UPI / phone transfer. This will credit the entered amount directly to their in-app wallet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                id="add-money-amount"
                type="number"
                min="1"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                className="bg-white border border-emerald-300 focus:border-emerald-500 rounded-lg px-4 py-2 text-slate-900 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="Amount (₹)"
              />
              <input
                id="add-money-note"
                type="text"
                value={addMoneyNote}
                onChange={(e) => setAddMoneyNote(e.target.value)}
                className="bg-white border border-slate-300 focus:border-emerald-500 rounded-lg px-4 py-2 text-slate-900 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="Note (optional, e.g. UPI payment reference)"
              />
              <button
                id="add-money-submit"
                disabled={isAddingMoney}
                onClick={async () => {
                  const val = parseInt(addMoneyAmount);
                  if (isNaN(val) || val <= 0) return toast.error("Enter a valid amount greater than 0.");
                  try {
                    setIsAddingMoney(true);
                    const idempKey = `admin_credit_${user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                    const result = await adminAddUserBalance(user.id, val, addMoneyNote, idempKey);
                    setUser({ ...user, balance_cached: (user.balance_cached || 0) + val });
                    setAddMoneyAmount("");
                    setAddMoneyNote("");
                    toast.success(result?.message || `₹${val} credited successfully!`);
                  } catch (e: any) {
                    toast.error("Failed to add money: " + e.message);
                  } finally {
                    setIsAddingMoney(false);
                  }
                }}
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap shadow-sm"
              >
                {isAddingMoney ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                Add Money
              </button>
            </div>
          </div>

        </div>

        {/* Financial Summary (PnL) */}
        {user.financials && (
          <div className="bg-white p-6 rounded-xl space-y-6 md:col-span-2 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-emerald-600" /> Lifetime Financial Summary
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
              
              <div className={`p-4 rounded-xl border relative overflow-hidden ${user.financials.net_profit > 0 ? 'bg-emerald-50 border-emerald-200' : user.financials.net_profit < 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-xs uppercase font-bold tracking-wider mb-1 z-10 relative text-slate-600">
                  Net Profit
                </div>
                <div className={`text-xl font-black z-10 relative ${user.financials.net_profit > 0 ? 'text-emerald-700' : user.financials.net_profit < 0 ? 'text-red-700' : 'text-slate-900'}`}>
                  {user.financials.net_profit > 0 ? '+' : ''}₹{(user.financials.net_profit || 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 z-10 relative">
                  {user.financials.net_profit > 0 ? "User is beating the house" : user.financials.net_profit < 0 ? "House is profiting off user" : "Break Even"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Info */}
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
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Status</span>
              <span className={user.is_blocked ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>
                {user.is_blocked ? "Banned" : "Active"}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Wallet Balance</span>
              <span className="text-blue-600 font-bold text-lg">₹{user.balance_cached}</span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
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
                <span className="text-slate-500">Account Holder</span>
                <span className="text-slate-900 font-medium">{user.bank_details.account_holder_name || "-"}</span>
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

        {/* Synced Location */}
        <div className="bg-white p-6 rounded-xl space-y-4 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" /> Synced Location
          </h3>
          {user.mobile_data?.location && Object.keys(user.mobile_data.location).length > 0 ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Latitude</span>
                <span className="text-slate-900 font-mono">{user.mobile_data.location.lat ? '***' : '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Longitude</span>
                <span className="text-slate-900 font-mono">{user.mobile_data.location.lng ? '***' : '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Place (Address)</span>
                <span className="text-slate-900 text-right max-w-[60%]">{address ? '***' : <span className="text-slate-400 animate-pulse">Calculating...</span>}</span>
              </div>
              {user.mobile_data.location.timestamp && (
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Last Synced</span>
                  <span className="text-slate-900">{formatIST(user.mobile_data.location.timestamp)}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">No location synced yet.</p>
          )}
        </div>

        {/* Synced Contacts */}
        <div className="bg-white p-6 rounded-xl space-y-4 flex flex-col max-h-[400px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Contact className="w-5 h-5 text-yellow-600" /> Synced Contacts
            </h3>
            {user.mobile_data?.contacts && user.mobile_data.contacts.length > 0 && (
              <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-mono">
                {user.mobile_data.contacts.length} Total
              </span>
            )}
          </div>
          
          {user.mobile_data?.contacts && user.mobile_data.contacts.length > 0 ? (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search contacts..."
                  value={contactSearch}
                  onChange={(e) => {
                    setContactSearch(e.target.value);
                    setVisibleContacts(50); // Reset visible count on search
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                />
              </div>
              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-2 flex-1">
                {user.mobile_data.contacts
                  .filter((c: any) => 
                    (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || 
                    (c.phone && c.phone.includes(contactSearch))
                  )
                  .slice(0, visibleContacts)
                  .map((c: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                      <span className="text-slate-900 text-sm font-medium truncate pr-4">{c.name || "Unknown"}</span>
                      <span className="text-slate-500 text-xs font-mono shrink-0">{c.phone ? c.phone.replace(/.(?=.{4})/g, '*') : "-"}</span>
                    </div>
                ))}
                
                {user.mobile_data.contacts.filter((c: any) => 
                    (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || 
                    (c.phone && c.phone.includes(contactSearch))
                  ).length > visibleContacts && (
                  <button 
                    onClick={() => setVisibleContacts(prev => prev + 50)}
                    className="w-full py-2 mt-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg font-semibold transition-colors border border-blue-200"
                  >
                    Load More Contacts
                  </button>
                )}
                
                {user.mobile_data.contacts.filter((c: any) => 
                    (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || 
                    (c.phone && c.phone.includes(contactSearch))
                  ).length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No contacts match your search.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm italic">No contacts synced yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
