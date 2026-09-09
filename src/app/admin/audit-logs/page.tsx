"use client";

import { useEffect, useState } from "react";
import { fetchAdminAuditLogs } from "@/lib/api";
import { Loader2, ClipboardList, Clock, User, Info } from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchAdminAuditLogs();
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            Audit Logs
          </h1>
          <p className="text-slate-500 mt-1">Detailed history of admin actions</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="font-medium text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" />
            Recent Activity
          </h2>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">
            Top 100
          </span>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">
            {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{log.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-slate-900">{log.admin_username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-[10px] font-mono text-slate-600 bg-slate-100 p-2 rounded-lg max-w-xs overflow-x-auto border border-slate-200">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.created_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
