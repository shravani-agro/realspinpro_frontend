// Game API - mirrors Flutter's ApiService exactly
// Connects to: api.shravaniagro.store

export const GAME_API = "https://api.shravaniagro.store";
export const GAME_WS = "wss://api.shravaniagro.store/ws/spinwheel";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function getStoredUser(): Record<string, any> | null {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("user");
  if (!u) return null;
  try { return JSON.parse(u); } catch { return null; }
}

export function saveSession(data: Record<string, any>) {
  const token = data.token || data.access_token;
  if (token) {
    localStorage.setItem("token", token);
    const user = data.user || { mobile: data.mobile, id: data.id, name: data.name };
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

async function parseResponse(res: Response) {
  if (res.status === 401) throw new Error("unauthorized");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "An error occurred");
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function gameLogin(mobile: string, password: string) {
  const res = await fetch(`${GAME_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password }),
  });
  const data = await parseResponse(res);
  saveSession(data);
  return data;
}

export async function gameRegister(name: string, mobile: string, password: string) {
  const res = await fetch(`${GAME_API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mobile, password }),
  });
  const data = await parseResponse(res);
  saveSession(data);
  return data;
}

export async function gameGetProfile() {
  const res = await fetch(`${GAME_API}/auth/me`, { headers: authHeaders() });
  return parseResponse(res);
}

export async function gameUpdateProfile(username: string) {
  const res = await fetch(`${GAME_API}/auth/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ username }),
  });
  return parseResponse(res);
}

export async function gameChangePassword(oldPassword: string, newPassword: string) {
  const res = await fetch(`${GAME_API}/auth/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  return parseResponse(res);
}

// ── Balance & Transactions ────────────────────────────────────────────────────
export async function gameGetBalance(): Promise<number> {
  const res = await fetch(`${GAME_API}/balance`, { headers: authHeaders() });
  const data = await parseResponse(res);
  return data.balance ?? 0;
}

export async function gameGetTransactions(limit = 1000) {
  const res = await fetch(`${GAME_API}/transactions?limit=${limit}`, { headers: authHeaders() });
  const data = await parseResponse(res);
  return Array.isArray(data) ? data : [];
}

// ── Deposit / Withdraw ────────────────────────────────────────────────────────
export async function gameDeposit(amount: number) {
  const key = `dep_${Date.now()}`;
  const res = await fetch(`${GAME_API}/deposit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ amount, idempotency_key: key }),
  });
  return parseResponse(res);
}

export async function gameVerifyDeposit(id: number) {
  const res = await fetch(`${GAME_API}/deposit/verify/${id}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function gameWithdraw(amount: number, upiId: string) {
  const key = `wdw_${Date.now()}`;
  const res = await fetch(`${GAME_API}/withdraw`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ amount, upi_id: upiId, idempotency_key: key }),
  });
  return parseResponse(res);
}

// ── SpinWheel ─────────────────────────────────────────────────────────────────
export async function gameGetCurrentRound() {
  const res = await fetch(`${GAME_API}/spinwheel/round/active`, { headers: authHeaders() });
  return parseResponse(res);
}

export async function gameGetSpinWheelHistory(limit = 10) {
  const res = await fetch(`${GAME_API}/spinwheel/history?limit=${limit}`, { headers: authHeaders() });
  const data = await parseResponse(res);
  if (!Array.isArray(data)) return [];
  return data
    .map((r: any) => {
      const number = r.winning_number;
      if (number == null) return null;
      return { number: Number(number), multiplier: r.multiplier ?? 1 };
    })
    .filter(Boolean) as { number: number; multiplier: number }[];
}

export async function gamePlaceBulkBets(
  roundId: number,
  bets: Record<number, number[]>,
  totalAmount: number
) {
  const user = getStoredUser();
  const userId = user?.id;
  const formattedBets: { number: number; amount: number }[] = [];
  for (const [num, amounts] of Object.entries(bets)) {
    for (const amt of amounts) {
      formattedBets.push({ number: Number(num), amount: amt });
    }
  }
  const res = await fetch(`${GAME_API}/spinwheel/bet/bulk`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      round_id: roundId,
      bets: formattedBets,
      total_amount: totalAmount,
      client_type: "spinwheel",
      idempotency_key: `bulkbet_${roundId}_${userId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    }),
  });
  return parseResponse(res);
}

export async function gameGetUserBetsHistory(limit = 50) {
  const res = await fetch(`${GAME_API}/spinwheel/bets/history?limit=${limit}`, { headers: authHeaders() });
  const data = await parseResponse(res);
  return Array.isArray(data) ? data : [];
}

// ── Support ────────────────────────────────────────────────────────────────────
export async function gameGetSupportInfo() {
  const res = await fetch(`${GAME_API}/support-info`, { headers: authHeaders() });
  return parseResponse(res);
}
