import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const starterUtilitiesSlice: FeatureSlice = {
  id: 'starter-utilities',
  name: 'Production Frontend & Backend Utility Starter Packs',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const feBasePath =
      config.topology === 'monorepo' || config.topology === 'micro-frontend'
        ? 'apps/web'
        : config.topology === 'separate-folders'
        ? 'frontend'
        : config.topology === 'electron-desktop'
        ? 'src/renderer'
        : '';
    const resolveFePath = (p: string) => (feBasePath ? `${feBasePath}/${p}` : p);

    const beBasePath =
      config.topology === 'monorepo' || config.topology === 'micro-frontend'
        ? 'apps/api'
        : config.topology === 'separate-folders'
        ? 'backend'
        : config.topology === 'electron-desktop' || config.topology === 'nextjs-fullstack'
        ? 'server'
        : '';
    const resolveBePath = (p: string) => (beBasePath ? `${beBasePath}/${p}` : p);

    // 1. Frontend Helper Pack
    if (config.utilities?.frontendHelpers && config.frontend.framework !== 'none') {
      vfs.applyAction({
        type: 'CREATE',
        path: resolveFePath('src/lib/token-manager.ts'),
        content: `/**
 * Thread-safe client token manager with in-memory caching and persistent fallback.
 */
class TokenManager {
  private accessToken: string | null = null;
  private readonly REFRESH_KEY = 'fs_refresh_token';

  setTokens(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;
    if (refreshToken && typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_KEY, refreshToken);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_KEY);
  }

  clearTokens(): void {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.REFRESH_KEY);
    }
  }

  hasValidSession(): boolean {
    return Boolean(this.accessToken || this.getRefreshToken());
  }
}

export const tokenManager = new TokenManager();
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: resolveFePath('src/lib/axios-client.ts'),
        content: `import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { tokenManager } from './token-manager.js';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Auto-Refresh Queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = \`Bearer \${token}\`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        tokenManager.clearTokens();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        tokenManager.setTokens(data.accessToken, data.refreshToken);
        processQueue(null, data.accessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = \`Bearer \${data.accessToken}\`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr as Error, null);
        tokenManager.clearTokens();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: resolveFePath('src/lib/api-gateway.ts'),
        content: `import { apiClient } from './axios-client.js';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function requestGateway<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  payload?: unknown
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<T>({
      method,
      url,
      data: payload,
    });
    return { data: response.data, error: null, status: response.status };
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || 'An unexpected network error occurred';
    return { data: null, error: message, status: err.response?.status || 500 };
  }
}
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: resolveFePath('src/lib/index.ts'),
        content: `export * from './token-manager.js';
export * from './axios-client.js';
export * from './api-gateway.js';
`,
      });
    }

    // 2. Backend Helper Pack
    if (config.utilities?.backendHelpers && config.backend.framework !== 'none') {
      vfs.applyAction({
        type: 'CREATE',
        path: resolveBePath('src/utils/token-generator.ts'),
        content: `import crypto from 'node:crypto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

export class TokenService {
  private static readonly SECRET = process.env.JWT_SECRET || 'dev-insecure-jwt-secret-replace-in-prod';

  private static base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\\+/g, '-')
      .replace(/\\//g, '_');
  }

  private static base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  static generatePair(payload: TokenPayload): TokenPair {
    const header = this.base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);

    const accessPayload = this.base64UrlEncode(
      JSON.stringify({ ...payload, iat: now, exp: now + 900 }) // 15 mins
    );
    const accessSignature = crypto
      .createHmac('sha256', this.SECRET)
      .update(\`\${header}.\${accessPayload}\`)
      .digest('base64url');

    const accessToken = \`\${header}.\${accessPayload}.\${accessSignature}\`;
    const refreshToken = crypto.randomBytes(40).toString('hex');

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  static verifyToken<T = TokenPayload>(token: string): T {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token structure');
    }

    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', this.SECRET)
      .update(\`\${header}.\${payload}\`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      throw new Error('Invalid token signature');
    }

    const decoded = JSON.parse(this.base64UrlDecode(payload));
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      throw new Error('Token has expired');
    }

    return decoded as T;
  }
}
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: resolveBePath('src/utils/password-hasher.ts'),
        content: `import crypto from 'node:crypto';

export class PasswordHasher {
  private static readonly KEY_LENGTH = 64;

  static async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
        if (err) reject(err);
        resolve(\`\${salt}:\${derivedKey.toString('hex')}\`);
      });
    });
  }

  static async verify(password: string, storedHash: string): Promise<boolean> {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
        if (err) reject(err);
        const keyBuffer = Buffer.from(key, 'hex');
        resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
      });
    });
  }
}
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: resolveBePath('src/utils/api-response.ts'),
        content: `export interface ApiResponseEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    page?: number;
    limit?: number;
    total?: number;
  };
}

export class ApiResponse {
  static success<T>(data: T, meta?: Record<string, unknown>): ApiResponseEnvelope<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  static error(message: string, code = 'INTERNAL_ERROR', details?: unknown): ApiResponseEnvelope<never> {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: resolveBePath('src/utils/index.ts'),
        content: `export * from './token-generator.js';
export * from './password-hasher.js';
export * from './api-response.js';
`,
      });
    }
  },
};
