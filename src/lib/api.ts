export const API_BASE_URL = "/api-proxy"; // Uses Next.js rewrites in next.config.ts to avoid mixed-content (HTTP) blocked error

// Global request timeout so a slow/unreachable backend never hangs the UI forever.
export const API_TIMEOUT_MS = 15000;

// Helper to get auth headers
export function getAdminHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...customHeaders };
  // Add CSRF protection header for state-changing endpoints
  headers['X-Requested-With'] = 'XMLHttpRequest';
  // Auth token is securely managed via HttpOnly cookies by the backend
  return headers;
}

// Wrapper around fetch that enforces a timeout and throws a friendly error on timeout.
async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Helper to safely parse and throw meaningful API errors for toast notifications
async function handleResponse(res: Response, defaultErrorMsg: string) {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    throw new Error("Unauthorized. Please log in again.");
  }

  const text = await res.text();
  if (!res.ok) {
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.error || errorData.message || defaultErrorMsg);
    } catch (e: any) {
      if (e.message && e.message !== 'Unexpected end of JSON input' && !e.message.includes('Unexpected token')) {
        throw new Error(e.message);
      }
      throw new Error(defaultErrorMsg);
    }
  }
  
  try {
    return text ? JSON.parse(text) : null;
  } catch (e: any) {
    console.error(`JSON Parse Error on response: ${text}`);
    throw e;
  }
}

export async function fetchAdminStats(timeframe: string = "24h") {
  const res = await apiFetch(`${API_BASE_URL}/admin/stats?timeframe=${timeframe}`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin stats");
}

export async function fetchAdminFeed() {
  const res = await apiFetch(`${API_BASE_URL}/admin/feed`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin feed");
}

export async function fetchAdminSettings() {
  const res = await apiFetch(`${API_BASE_URL}/admin/settings`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin settings");
}

export async function updateAdminSettings(settings: Record<string, any>) {
  const res = await apiFetch(`${API_BASE_URL}/admin/settings`, {
    method: 'PUT',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(settings),
  });
  return handleResponse(res, "Failed to update settings");
}

export async function fetchAdminUsers() {
  const res = await apiFetch(`${API_BASE_URL}/admin/users`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin users");
}

export async function fetchAdminUserDetail(id: string) {
  const res = await apiFetch(`${API_BASE_URL}/admin/users/${id}`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin user detail");
}

export async function fetchAdminUserTransactions(id: string) {
  const res = await apiFetch(`${API_BASE_URL}/admin/user/transactions?id=${id}`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin user transactions");
}

export async function fetchAdminUserBets(id: string) {
  const res = await apiFetch(`${API_BASE_URL}/admin/user/bets?id=${id}`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin user bets");
}

export async function deleteAdminUser(id: number) {
  const res = await apiFetch(`${API_BASE_URL}/admin/user/delete?id=${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  return handleResponse(res, "Failed to delete user");
}

export async function blockAdminUser(userId: number, isBlocked: boolean) {
  const res = await apiFetch(`${API_BASE_URL}/admin/user/block`, {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ user_id: userId, is_blocked: isBlocked }),
  });
  return handleResponse(res, "Failed to update block status");
}

export async function setAdminUserLimit(userId: number, limit: number) {
  const res = await apiFetch(`${API_BASE_URL}/admin/user/limit`, {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ user_id: userId, limit }),
  });
  return handleResponse(res, "Failed to set user limit");
}


export async function fetchAdminTransactions(startDate?: string, endDate?: string) {
  let url = `${API_BASE_URL}/admin/transactions`;
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (params.toString()) url += `?${params.toString()}`;
  
  const res = await apiFetch(url, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin transactions");
}

export async function updateAdminTransactionStatus(id: string, status: string) {
  const res = await apiFetch(`${API_BASE_URL}/admin/transactions/${id}`, {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res, "Failed to update transaction status");
}

export async function fetchGatewayBalance() {
  const res = await apiFetch(`${API_BASE_URL}/admin/gateway-balance`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch gateway balance");
}

export async function fetchAdminBets(startDate?: string, endDate?: string) {
  let url = `${API_BASE_URL}/admin/bets`;
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await apiFetch(url, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin bets");
}

export async function fetchAdminRounds() {
  const res = await apiFetch(`${API_BASE_URL}/admin/rounds`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch admin rounds");
}

export async function fetchAdminRoundDetails(id: number) {
  const res = await apiFetch(`${API_BASE_URL}/admin/rounds/${id}`, { 
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, `Failed to fetch details for round ${id}`);
}

export async function adminLogin(credentials: any) {
  const res = await apiFetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res, "Login failed");
}

export async function fetchAdminAuditLogs() {
  const res = await apiFetch(`${API_BASE_URL}/admin/audit-logs`, {
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch audit logs");
}

export async function updateAdminSupportChatStatus(userId: number, status: string) {
  const res = await apiFetch(`${API_BASE_URL}/admin/support/chats/status`, {
    method: 'PUT',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ user_id: userId, status }),
  });
  return handleResponse(res, "Failed to update chat status");
}

export async function deleteAdminSupportChat(userId: number) {
  const res = await apiFetch(`${API_BASE_URL}/admin/support/chats/delete?user_id=${userId}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  return handleResponse(res, "Failed to delete chat");
}

export async function fetchAdminSupportChats() {
  const res = await apiFetch(`${API_BASE_URL}/admin/support/chats`, {
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch support chats");
}

export async function fetchAdminSupportHistory(userId: number, page: number = 1) {
  const res = await apiFetch(`${API_BASE_URL}/admin/support/chats/messages?user_id=${userId}&page=${page}`, {
    credentials: 'include', cache: 'no-store',
    headers: getAdminHeaders()
  });
  return handleResponse(res, "Failed to fetch support chat history");
}

export async function sendAdminSupportMessage(userId: number, content: string) {
  const res = await apiFetch(`${API_BASE_URL}/admin/support/message`, {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ user_id: userId, content }),
  });
  return handleResponse(res, "Failed to send support message");
}

export async function uploadAdminSupportImage(userId: number, chatId: number, imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('chat_id', chatId.toString());

  const headers = getAdminHeaders();
  // Don't set Content-Type for FormData, the browser sets it automatically with boundary

  const res = await apiFetch(`${API_BASE_URL}/admin/support/image`, {
    method: 'POST',
    headers: headers,
    body: formData,
  });
  return handleResponse(res, "Failed to upload image");
}

export async function adminAddUserBalance(userId: number, amount: number, note: string, idempotencyKey: string) {
  const res = await apiFetch(`${API_BASE_URL}/admin/user/add-balance`, {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ user_id: userId, amount, note, idempotency_key: idempotencyKey }),
  });
  return handleResponse(res, "Failed to add balance");
}
