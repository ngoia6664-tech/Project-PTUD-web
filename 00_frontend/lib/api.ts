/**
 * Helper gọi API dùng chung cho frontend KMA Overall.
 * - Base URL đọc từ NEXT_PUBLIC_API_URL (mặc định http://localhost:4000/api).
 * - Tự động gắn header Authorization: Bearer <token> từ localStorage (khóa "token").
 * - Tự động đọc thông báo lỗi từ data.message ?? data.loi.
 * - Gặp HTTP 401: xóa token trong localStorage và chuyển hướng về /login (trừ khi redirectOn401=false).
 * - Tuyệt đối không console.log mật khẩu, token hay dữ liệu bảng điểm.
 */

export const AUTH_TOKEN_KEY = "token";

const DEFAULT_API_BASE = "http://localhost:4000/api";

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE;
  return raw.replace(/\/+$/, "");
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Không tự gắn Authorization header (ví dụ login/register) */
  skipAuth?: boolean;
  /** Tự chuyển hướng sang /login khi gặp 401 (mặc định true) */
  redirectOn401?: boolean;
}

function extractErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const msg = record.message ?? record.loi;
    if (typeof msg === "string" && msg.trim() !== "") {
      return msg.trim();
    }
  }
  if (status === 401) {
    return "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.";
  }
  if (status === 403) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }
  if (status >= 500) {
    return "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";
  }
  return "Yêu cầu không thành công. Vui lòng kiểm tra lại dữ liệu.";
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    body,
    headers: customHeaders,
    skipAuth = false,
    redirectOn401 = true,
    ...rest
  } = options;

  const headers = new Headers(customHeaders);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let serializedBody: BodyInit | undefined;
  if (body !== undefined) {
    if (
      typeof body === "string" ||
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof Blob
    ) {
      serializedBody = body;
    } else {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      serializedBody = JSON.stringify(body);
    }
  }

  if (!skipAuth) {
    const token = getAuthToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${normalizedPath}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers,
      body: serializedBody,
    });
  } catch {
    throw new ApiError(
      "Không thể kết nối tới máy chủ. Vui lòng kiểm tra backend đang chạy ở cổng 4000.",
      0,
      null,
    );
  }

  let data: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } catch {
      data = null;
    }
  }

  if (response.status === 401) {
    clearAuthToken();
    if (
      redirectOn401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.location.replace("/login");
    }
  }

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(data, response.status),
      response.status,
      data,
    );
  }

  return data as T;
}
