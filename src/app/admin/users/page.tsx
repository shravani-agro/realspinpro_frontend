"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, ShieldCheck, ShieldAlert, Ban, Eye } from "lucide-react";
import { fetchAdminUsers } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import { formatIST } from "@/utils/dateFormatter";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-black/50 border border-white/10 text-sm focus:outline-none focus:border-neon-blue/50 text-white w-64" 
            />
          </div>
          <button onClick={() => toast.info("Advanced filters coming soon!")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading users...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Username / Mobile</th>
                  <th className="px-6 py-4">PIN</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Wallet Balance</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.filter(u => 
                  (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) || 
                  (u.mobile && u.mobile.includes(searchTerm)) || 
                  (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                ).map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono text-gray-500">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{user.username || "Anonymous"}</div>
                      <div className="text-xs text-gray-500">{user.mobile}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white tracking-widest">***</td>
                    <td className="px-6 py-4 text-gray-400">{user.email || "-"}</td>
                    <td className="px-6 py-4 font-mono text-neon-blue group-hover:drop-shadow-[0_0_5px_var(--color-neon-blue)] transition-all">₹{user.balance_cached}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${!user.is_blocked ? 'text-neon-emerald bg-neon-emerald/10' : 'text-red-500 bg-red-500/10'}`}>
                        {!user.is_blocked ? (
                          <>Active</>
                        ) : (
                          <><Ban className="w-3 h-3 mr-1.5" /> Banned</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatIST(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/users/${user.id}`} className="p-2 inline-block text-gray-500 hover:text-white transition-colors">
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">No users found</td>
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
