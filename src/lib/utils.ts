import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.ashaboutique.co.in";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export async function apiFetch<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: any;
    token?: string;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const token = options.token ?? (typeof window !== "undefined" ? (localStorage.getItem("admin_token") || undefined) : undefined);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export function buildUploadUrl(filename?: string | null): string | undefined {
  if (!filename) return undefined;
  return `${API_BASE_URL}/uploads/${filename}`;
}

export function buildCloudinaryImageUrl(
  publicId?: string | null,
  width: number = 600
): string | undefined {
  if (!publicId) return undefined;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width},c_fill/${publicId}`;
}

export async function apiFetchForm<T>(
  path: string,
  options: {
    method?: HttpMethod;
    formData: FormData;
    token?: string;
    headers?: Record<string, string>;
  }
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const token = options.token ?? (typeof window !== "undefined" ? (localStorage.getItem("admin_token") || undefined) : undefined);

  const headers: Record<string, string> = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: options.method || "POST",
    headers,
    body: options.formData,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}
