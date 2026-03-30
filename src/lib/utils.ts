import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ------------------------------
   Class Utility
--------------------------------*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ------------------------------
   API Base
--------------------------------*/
export const API_BASE_URL =
  "https://ashaboutique-backend-1-2.onrender.com";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/* ------------------------------
   JSON API Helper
--------------------------------*/
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

  // Prefer explicit token, otherwise fall back to admin_token in localStorage
  const token = options.token ?? (typeof window !== 'undefined' ? (localStorage.getItem('admin_token') || undefined) : undefined);

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

/* ------------------------------
   Local Upload URL (if not Cloudinary)
--------------------------------*/
export function buildUploadUrl(
  filename?: string | null
): string | undefined {
  if (!filename) return undefined;
  return `${API_BASE_URL}/uploads/${filename}`;
}

/* ------------------------------
   🔥 Cloudinary Optimized Image URL
--------------------------------*/
export function buildCollectionImageUrl(
  folder: string,
  filename?: string | null,
  width: number = 600
): string | undefined {
  if (!filename) return undefined;

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width},c_fill/${folder}/${filename}`;
}

/* ------------------------------
   🔥 Cloudinary Image URL from public_id
   - Works when backend stores only `public_id`
--------------------------------*/
export function buildCloudinaryImageUrl(
  publicId?: string | null,
  width: number = 600
): string | undefined {
  if (!publicId) return undefined;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  // `publicId` usually already contains folder path (e.g. asha_boutique/saree/xxxx)
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width},c_fill/${publicId}`;
}

/* ------------------------------
   If backend already returns FULL Cloudinary URL
--------------------------------*/
export function optimizeCloudinaryUrl(
  url?: string | null,
  width: number = 600
): string | undefined {
  if (!url) return undefined;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_fill/`
  );
}

/* ------------------------------
   Multipart/FormData Helper
--------------------------------*/
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

  // Prefer explicit token, otherwise fall back to admin_token in localStorage
  const token = options.token ?? (typeof window !== 'undefined' ? (localStorage.getItem('admin_token') || undefined) : undefined);

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