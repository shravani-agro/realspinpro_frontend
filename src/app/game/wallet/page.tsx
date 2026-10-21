"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Plus, Minus, RefreshCw, CloudOff } from "lucide-react";
import { toast } from "sonner";
import {
  gameGetBalance,
  gameGetTransactions,
  gameDeposit,
  gameVerifyDeposit,
  gameWithdraw,
  GAME_API,
} from "@/lib/game-api";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ── Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  // ── Withdraw Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawUpi, setWithdrawUpi] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [bal, txns] = await Promise.all([
        gameGetBalance(),
        gameGetTransactions(1000),
      ]);
      setBalance(bal);
      setTransactions(txns.filter((t: Transaction) => t.type === "deposit" || t.type === "withdrawal"));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Deposit (matches Flutter _deposit) ─────────────────────────────────
  const handleDeposit = async () => {
    const amount = parseInt(depositAmount);
    if (!amount || amount <= 0) return;
    setShowDepositModal(false);
    setIsActionLoading(true);
    try {
      const result = await gameDeposit(amount);
      const paymentSessionId = result.payment_session_id;
      const orderId = result.order_id;
      const env = result.environment;
      const ledgerId = result.ledger_id;

      if (result.gateway === "youpi" || result.upi_uri) {
        const checkoutUrl = result.checkout_url 
          ? (result.checkout_url.startsWith('http') ? result.checkout_url : `${GAME_API}${result.checkout_url}`)
          : `${GAME_API}/checkout?gateway=youpi&order_id=${orderId}&amount=${amount}&payee_vpa=${encodeURIComponent(result.payee_vpa || "")}&payee_name=${encodeURIComponent(result.payee_name || "")}&upi_uri=${encodeURIComponent(result.upi_uri || "")}`;
        window.open(checkoutUrl, "_blank");
        toast.info("Opened YouPI UPI payment. Verifying transfer...");
        startPolling(ledgerId);
      } else if (paymentSessionId && orderId) {
        const checkoutUrl = `${GAME_API}/checkout?payment_session_id=${paymentSessionId}&env=${env ?? "PRODUCTION"}`;
        window.open(checkoutUrl, "_blank");
        toast.info("Verifying payment...");
        startPolling(ledgerId);
      } else {
        toast.success(result.message || "Done");
        await loadData();
      }
    } catch (e: any) {
      toast.error(e.message || "Deposit failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  // ── Polling (matches Flutter _startPolling) ─────────────────────────────
  const startPolling = (ledgerId: number) => {
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts++;
      if (attempts > 20) { clearInterval(timer); return; }
      try {
        const result = await gameVerifyDeposit(ledgerId);
        if (result.status === "completed" || result.status === "success") {
          clearInterval(timer);
          toast.success("Deposit Successful!");
          await loadData();
        } else if (result.status === "failed" || result.status === "error" || result.status === "timeout") {
          clearInterval(timer);
          toast.error("Deposit failed or timed out");
          await loadData();
        }
      } catch {}
    }, 3000);
  };

  // ── Withdraw (matches Flutter _withdraw) ────────────────────────────────
  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0 || !withdrawUpi.trim()) {
      toast.error("Please fill all details");
      return;
    }
    setShowWithdrawModal(false);
    setIsActionLoading(true);
    try {
      const result = await gameWithdraw(amount, withdrawUpi.trim());
      toast.success(result.message || "Withdrawal requested!");
      await loadData();
    } catch (e: any) {
      toast.error(e.message || "Withdrawal failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  // ── Transaction Status Display (matches Flutter logic) ─────────────────
  const getStatusDisplay = (rawStatus: string) => {
    const s = rawStatus?.toUpperCase() || "";
    if (s === "SUCCESS" || s === "COMPLETED")
      return { label: "COMPLETED", color: "#00E676", bg: "rgba(0,230,118,0.1)" };
    if (s === "PENDING" || s === "PROCESSING" || s === "ACTIVE")
      return { label: "PENDING", color: "#FFA000", bg: "rgba(255,160,0,0.1)" };
    return { label: "FAILED", color: "#FF5252", bg: "rgba(255,82,82,0.1)" };
  };

  const getTransactionDisplay = (tx: Transaction) => {
    const status = getStatusDisplay(tx.status);
    let label = tx.type;
    let isPositive = true;

    if (tx.type === "deposit") {
      label = `Deposit${status.label === "PENDING" ? " (Processing)" : status.label === "FAILED" ? " (Failed)" : ""}`;
      isPositive = status.label === "COMPLETED";
    } else if (tx.type === "withdrawal") {
      label = `Withdrawal${status.label === "PENDING" ? " (Processing)" : status.label === "FAILED" ? " (Failed)" : ""}`;
      isPositive = false;
    } else if (tx.type === "win") {
      label = "Bet Won 🎉";
    } else if (tx.type === "bet") {
      label = "Bet Placed";
      isPositive = false;
    } else if (tx.type === "refund") {
      label = "Refund";
    }

    const amountColor =
      (tx.type === "deposit" || tx.type === "withdrawal") && status.label !== "COMPLETED"
        ? status.label === "FAILED" ? "#FF5252" : "#FFA000"
        : isPositive ? "#00E676" : "#FF5252";

    return { label, isPositive, amountColor, status };
  };

  const formatDate = (iso: string) => {
    if (!iso) return "---";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "black" }}>
      {/* Background - matches Flutter tpbackground.jpg */}
      <div className="fixed inset-0 z-0">
        <Image src="/tpbackground.jpg" alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* AppBar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 pt-8 pb-3 bg-transparent">
        <Link href="/game">
          <button className="p-2 rounded-full bg-white/5 border border-white/10">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </Link>
        <h1 className="text-white font-bold text-lg">My Wallet</h1>
        <button onClick={loadData} className="p-2 rounded-full bg-white/5 border border-white/10">
          <RefreshCw className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-28" style={{ paddingTop: 8 }}>

        {/* Balance Card (matches Flutter _buildBalanceCard: dark casino red gradient) */}
        <div className="w-full p-6 rounded-3xl border mb-6"
          style={{
            background: "linear-gradient(135deg, #8B0000, #4A0000)",
            borderColor: "rgba(255,215,0,0.6)",
            borderWidth: 1.5,
            boxShadow: "0 8px 24px rgba(255,0,0,0.3)",
          }}>
          <p className="text-white/70 font-bold text-xs mb-1.5">Main Balance</p>
          {isLoading ? (
            <div className="h-10 w-44 bg-white/10 rounded-lg animate-pulse mb-2" />
          ) : (
            <p className="text-white text-4xl font-black">₹{balance.toFixed(2)}</p>
          )}
          <p className="text-white/50 text-xs mt-2">Tap Deposit or Withdraw to manage funds</p>
        </div>

        {/* Action Grid (matches Flutter _buildActionGrid) */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowDepositModal(true)}
            disabled={isActionLoading}
            className="flex-1 py-5 rounded-2xl flex flex-col items-center gap-2 border transition-opacity"
            style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,215,0,0.3)" }}>
            <Plus className="text-[#FFD700]" size={28} />
            <span className="text-white text-sm font-semibold">Deposit</span>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={isActionLoading}
            className="flex-1 py-5 rounded-2xl flex flex-col items-center gap-2 border transition-opacity"
            style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,215,0,0.3)" }}>
            <Minus className="text-[#FFD700]" size={28} />
            <span className="text-white text-sm font-semibold">Withdraw</span>
          </button>
        </div>

        {/* Transaction History */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-white font-bold text-lg">Transaction History</p>
          <p className="text-white/40 text-xs">{transactions.length} records</p>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-black/40 border border-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {hasError && (
          <div className="w-full p-8 rounded-2xl border border-[#FF5252]/40 bg-black/40 flex flex-col items-center gap-3">
            <CloudOff className="text-[#FF5252]" size={44} />
            <p className="text-white/70 text-sm text-center">Could not load transactions</p>
            <button onClick={loadData} className="px-6 py-2 rounded-full border border-[#FFD700]/60 text-[#FFD700] text-xs font-bold">RETRY</button>
          </div>
        )}

        {!isLoading && !hasError && transactions.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <p className="text-base font-medium">No transactions yet</p>
          </div>
        )}

        {!isLoading && !hasError && transactions.map((tx) => {
          const { label, isPositive, amountColor, status } = getTransactionDisplay(tx);
          return (
            <div key={tx.id}
              className="flex items-center justify-between p-4 rounded-2xl border mb-2.5"
              style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                  style={{ background: "#0F0C16", borderColor: `${amountColor}4D` }}>
                  {isPositive ? <Plus size={20} color={amountColor} /> : <Minus size={20} color={amountColor} />}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{label}</p>
                  <p className="text-white/40 text-[11px]">{formatDate(tx.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-base" style={{ color: amountColor }}>
                  {isPositive ? "+" : ""}₹{Math.abs(tx.amount)}
                </p>
                {tx.status && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded mt-1 inline-block"
                    style={{ color: status.color, background: status.bg }}>
                    {status.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DEPOSIT MODAL (matches Flutter _showDepositDialog bottom sheet) */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDepositModal(false)} />
          <div className="relative w-full rounded-t-[28px] p-7 z-10"
            style={{ background: "#1B182B", borderTop: "1.5px solid rgba(255,215,0,0.3)" }}>
            <p className="text-white font-bold text-xl mb-4">Deposit Amount</p>
            <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-2 mb-5">
              <span className="text-white/50 text-2xl font-bold">₹</span>
              <input
                type="number"
                autoFocus
                placeholder="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="flex-1 bg-transparent text-white text-2xl font-bold outline-none placeholder-white/20"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDepositModal(false)}
                className="flex-1 py-3 text-white/50 font-medium">Cancel</button>
              <button onClick={handleDeposit}
                className="flex-1 py-4 rounded-xl font-bold text-white"
                style={{ background: "#FF5252", boxShadow: "0 8px 20px rgba(255,82,82,0.4)" }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL (matches Flutter WithdrawDialog) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowWithdrawModal(false)} />
          <div className="relative w-full rounded-t-[28px] p-7 z-10"
            style={{ background: "#1B182B", borderTop: "1.5px solid rgba(255,215,0,0.3)" }}>
            <p className="text-white font-bold text-xl mb-4">Withdraw Funds</p>
            <div className="space-y-3 mb-5">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-2">
                <span className="text-white/50 text-2xl font-bold">₹</span>
                <input
                  type="number"
                  placeholder="Amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="flex-1 bg-transparent text-white text-2xl font-bold outline-none placeholder-white/20"
                />
              </div>
              <input
                type="text"
                placeholder="Your UPI ID (e.g. name@upi)"
                value={withdrawUpi}
                onChange={(e) => setWithdrawUpi(e.target.value)}
                className="w-full bg-white/5 rounded-2xl p-4 text-white text-base outline-none placeholder-white/20"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 text-white/50 font-medium">Cancel</button>
              <button onClick={handleWithdraw}
                className="flex-1 py-4 rounded-xl font-bold text-white"
                style={{ background: "#8E2DE2", boxShadow: "0 8px 20px rgba(142,45,226,0.4)" }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
