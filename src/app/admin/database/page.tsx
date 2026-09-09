"use client";

import { useState, useEffect } from "react";
import { Database, Search, ArrowRight, Table2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TableData {
  table: string;
  columns: string[];
  rows: any[];
  limit: number;
  offset: number;
}

export default function DatabaseExplorer() {
  const router = useRouter();
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  
  const [loadingTables, setLoadingTables] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [offset, setOffset] = useState(0);
  const limit = 50;

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable, 0);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    setLoadingTables(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const res = await fetch("/api-proxy/admin/db/tables", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        setError("You do not have permission to view the database.");
        setLoadingTables(false);
        return;
      }
      const data = await res.json();
      if (data.tables) {
        setTables(data.tables);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch tables");
    } finally {
      setLoadingTables(false);
    }
  };

  const fetchTableData = async (tableName: string, newOffset: number) => {
    setLoadingData(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api-proxy/admin/db/tables/${tableName}?limit=${limit}&offset=${newOffset}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setTableData({
          ...data,
          rows: data.rows || []
        });
        setOffset(newOffset);
      }
    } catch (err) {
      setError("Failed to fetch table data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleNextPage = () => {
    if (selectedTable && tableData?.rows.length === limit) {
      fetchTableData(selectedTable, offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (selectedTable && offset >= limit) {
      fetchTableData(selectedTable, offset - limit);
    }
  };

  // Convert complex objects to string for rendering
  const renderCell = (value: any) => {
    if (value === null) return <span className="text-slate-400 italic">NULL</span>;
    if (typeof value === "boolean") return <span className={value ? "text-emerald-600" : "text-red-600"}>{value.toString()}</span>;
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" />
          Database Explorer
        </h1>
        <p className="text-slate-500 mt-2">Manage and view raw PostgreSQL data directly.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar for Tables */}
        <div className="w-full lg:w-64 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shrink-0 shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Table2 className="w-4 h-4" /> Tables
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
            {loadingTables ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : tables.length === 0 ? (
              <div className="text-center p-4 text-slate-500 text-sm">No tables found.</div>
            ) : (
              tables.map(table => (
                <button
                  key={table}
                  onClick={() => setSelectedTable(table)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                    selectedTable === table 
                      ? "bg-blue-50 text-blue-700 font-medium border border-blue-200" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  {table}
                  {selectedTable === table && <ArrowRight className="w-4 h-4" />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Data Grid */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden min-w-0 shadow-sm">
          {!selectedTable ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Database className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a table to view its data</p>
            </div>
          ) : loadingData ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : tableData ? (
            <>
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold text-slate-900 font-mono">{tableData.table}</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500">Rows {offset + 1} - {offset + tableData.rows.length}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrevPage}
                      disabled={offset === 0}
                      className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-30 transition-colors shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleNextPage}
                      disabled={tableData.rows.length < limit}
                      className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-30 transition-colors shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      {tableData.columns.map(col => (
                        <th key={col} className="p-3 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap bg-slate-50">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.length === 0 ? (
                      <tr>
                        <td colSpan={tableData.columns.length} className="p-8 text-center text-slate-500">
                          Table is empty
                        </td>
                      </tr>
                    ) : (
                      tableData.rows.map((row, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          {tableData.columns.map(col => (
                            <td key={col} className="p-3 text-sm text-slate-600 font-mono whitespace-nowrap max-w-xs truncate" title={String(row[col])}>
                              {renderCell(row[col])}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
