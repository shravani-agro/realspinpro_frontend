"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await adminLogin({ username, password });
      toast.success("Login successful");
      router.push("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "block w-full pl-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-400 transition-all bg-slate-50 focus:bg-white outline-none";

  return (
    <div
      className="relative z-10 flex min-h-screen w-full flex-col font-sans"
      style={{ minHeight: "100dvh" }}
    >
      {/* Background Decor (pinned to viewport so short screens never clip content) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-12%] left-[-8%] h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute bottom-[-12%] right-[-8%] h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      {/* m-auto + no items-center => perfect two-axis centering that scrolls gracefully when tall */}
      <div className="relative z-10 m-auto flex w-full max-w-md flex-col px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/40 rounded-2xl blur-xl" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-blue-100">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold tracking-widest uppercase text-blue-700">
            <KeyRound className="w-3 h-3" />
            Secure Admin Access
          </div>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            Sign in to access the RealSpinPro management dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white px-6 sm:px-8 py-8 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-100">
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username */}
            <div>
              <label
                htmlFor="login-username"
                className="block text-sm font-semibold text-slate-700"
              >
                Username
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`${inputClasses} pr-3`}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <span className="text-xs text-slate-400">
                  Min. 8 characters
                </span>
              </div>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClasses} pr-11`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <span className="text-sm text-slate-400">
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-60 shadow-md shadow-blue-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Divider + support note */}
          <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            Trouble signing in? Contact support.
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Homepage
          </button>
          <p className="text-[11px] text-slate-400 text-center">
            Protected area. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
