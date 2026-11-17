import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import { CodePatcher } from '../../utils/code-patcher.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const stateSlice: FeatureSlice = {
  id: 'fe-state',
  name: 'Frontend State Management (TanStack Query, Redux Toolkit, Zustand)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.frontend.framework !== 'react-vite' || config.frontend.state === 'none') {
      return;
    }

    const basePath =
      config.topology === 'monorepo' || config.topology === 'micro-frontend'
        ? 'apps/web'
        : config.topology === 'separate-folders'
        ? 'frontend'
        : '';
    const resolvePath = (p: string) => (basePath ? `${basePath}/${p}` : p);

    // 1. TanStack Query v5
    if (config.frontend.state === 'query') {
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolvePath('package.json'),
        content: {
          dependencies: {
            '@tanstack/react-query': DEPENDENCY_REGISTRY['@tanstack/react-query'],
            axios: DEPENDENCY_REGISTRY.axios,
          },
          devDependencies: {
            '@tanstack/react-query-devtools':
              DEPENDENCY_REGISTRY['@tanstack/react-query-devtools'],
          },
        },
      });

      // Axios client
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/lib/api-client.ts'),
        content: `import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
`,
      });

      // Query Provider
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/providers/query-provider.tsx'),
        content: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
`,
      });

      // Custom useCurrentUser hook
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/features/auth/api/use-user.ts'),
        content: `import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client.js';
${
  config.topology === 'monorepo'
    ? "import type { UserResponseDto } from '@repo/contracts';"
    : 'export interface UserResponseDto { id: string; email: string; name: string; }'
}

export const userQueryKey = ['auth', 'current-user'] as const;

export const useCurrentUser = () => {
  return useQuery<UserResponseDto>({
    queryKey: userQueryKey,
    queryFn: async () => {
      const response = await apiClient.get<UserResponseDto>('/auth/me');
      return response.data;
    },
  });
};
`,
      });

      // Patch main.tsx with QueryProvider
      vfs.applyAction({
        type: 'PATCH_AST',
        path: resolvePath('src/main.tsx'),
        patcher: (content) => {
          let patched = CodePatcher.addImports(content, [
            "import { QueryProvider } from './providers/query-provider.js';",
          ]);
          patched = CodePatcher.wrapProvider(
            patched,
            '<QueryProvider>',
            '</QueryProvider>'
          );
          return patched;
        },
      });
    }

    // 2. Redux Toolkit
    if (config.frontend.state === 'redux') {
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolvePath('package.json'),
        content: {
          dependencies: {
            '@reduxjs/toolkit': DEPENDENCY_REGISTRY['@reduxjs/toolkit'],
            'react-redux': DEPENDENCY_REGISTRY['react-redux'],
          },
          devDependencies: {
            '@types/react-redux': DEPENDENCY_REGISTRY['@types/react-redux'],
          },
        },
      });

      // Store configuration
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/store/index.ts'),
        content: `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`,
      });

      // Typed hooks
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/store/hooks.ts'),
        content: `import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index.js';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`,
      });

      // Auth Slice
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/store/slices/auth-slice.ts'),
        content: `import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
`,
      });

      // Patch main.tsx with Redux Provider
      vfs.applyAction({
        type: 'PATCH_AST',
        path: resolvePath('src/main.tsx'),
        patcher: (content) => {
          let patched = CodePatcher.addImports(content, [
            "import { Provider } from 'react-redux';",
            "import { store } from './store/index.js';",
          ]);
          patched = CodePatcher.wrapProvider(
            patched,
            '<Provider store={store}>',
            '</Provider>'
          );
          return patched;
        },
      });
    }

    // 3. Zustand
    if (config.frontend.state === 'zustand') {
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolvePath('package.json'),
        content: {
          dependencies: {
            zustand: DEPENDENCY_REGISTRY.zustand,
          },
        },
      });

      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/store/use-app-store.ts'),
        content: `import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

interface AppState {
  user: UserProfile | null;
  theme: 'dark' | 'light';
  setUser: (user: UserProfile | null) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      user: null,
      theme: 'dark',
      setUser: (user) => set({ user }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'AppStore' }
  )
);
`,
      });
    }
  },
};
