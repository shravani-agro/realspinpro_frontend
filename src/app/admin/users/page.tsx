"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, ShieldCheck, ShieldAlert, Ban, Eye, EyeOff, Trash2 } from "lucide-react";
import { fetchAdminUsers, deleteAdminUser } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import { formatIST } from "@/utils/dateFormatter";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePins, setVisiblePins] = useState<Record<number, boolean>>({});

  const togglePin = (id: number) => {
    setVisiblePins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user? This will permanently delete their account, bets, and wallet ledger.")) return;
    try {
      await deleteAdminUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchAdminUsers()
      .then((data) => {
        setUsers(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
        toast.error("Failed to load users: " + err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 shadow-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-900 w-64" 
            />
          </div>
          <button onClick={() => toast.info("Advanced filters coming soon!")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 shadow-sm text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading users...</div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Username / Mobile</th>
                  <th className="px-6 py-4">PIN</th>
                  <th className="px-6 py-4">Wallet Balance</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.filter(u => 
                  (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) || 
                  (u.mobile && u.mobile.includes(searchTerm))
                ).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-slate-500">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{user.username || "Anonymous"}</div>
                      <div className="text-xs text-slate-500">{user.mobile}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-700 tracking-widest">
                          {visiblePins[user.id] ? user.pin : "***"}
                        </span>
                        <button onClick={() => togglePin(user.id)} className="text-slate-400 hover:text-slate-600">
                          {visiblePins[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-blue-600 font-medium">₹{user.balance_cached}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${!user.is_blocked ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                        {!user.is_blocked ? (
                          <>Active</>
                        ) : (
                          <><Ban className="w-3 h-3 mr-1.5" /> Banned</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatIST(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/users/${user.id}`} className="p-2 inline-block text-slate-400 hover:text-blue-600 transition-colors" title="View Details">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDelete(user.id)} className="p-2 inline-block text-slate-400 hover:text-red-600 transition-colors" title="Delete User">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">No users found</td>
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
