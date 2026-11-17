import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import { CodePatcher, SLOTS } from '../../utils/code-patcher.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const uiExtrasSlice: FeatureSlice = {
  id: 'fe-ui-extras',
  name: 'Frontend Feedback & UI Extras (Sonner, Lucide, RHF + Zod)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.frontend.framework !== 'react-vite') {
      return;
    }

    const basePath =
      config.topology === 'monorepo' || config.topology === 'micro-frontend'
        ? 'apps/web'
        : config.topology === 'separate-folders'
        ? 'frontend'
        : '';
    const resolvePath = (p: string) => (basePath ? `${basePath}/${p}` : p);

    const dependenciesToAdd: Record<string, string> = {};

    // Toast libraries
    const toastChoice = config.frontend.toast || (config.frontend.uiExtras.toast ? 'sonner' : 'none');
    if (toastChoice === 'sonner') {
      dependenciesToAdd.sonner = DEPENDENCY_REGISTRY.sonner;
    } else if (toastChoice === 'toastify') {
      dependenciesToAdd['react-toastify'] = DEPENDENCY_REGISTRY['react-toastify'];
    } else if (toastChoice === 'hot-toast') {
      dependenciesToAdd['react-hot-toast'] = DEPENDENCY_REGISTRY['react-hot-toast'];
    }

    // Icon libraries
    const iconsChoice = config.frontend.icons || (config.frontend.uiExtras.icons ? 'lucide' : 'none');
    if (iconsChoice === 'lucide') {
      dependenciesToAdd['lucide-react'] = DEPENDENCY_REGISTRY['lucide-react'];
    } else if (iconsChoice === 'tabler') {
      dependenciesToAdd['@tabler/icons-react'] = DEPENDENCY_REGISTRY['@tabler/icons-react'];
    } else if (iconsChoice === 'react-icons') {
      dependenciesToAdd['react-icons'] = DEPENDENCY_REGISTRY['react-icons'];
    } else if (iconsChoice === 'phosphor') {
      dependenciesToAdd['@phosphor-icons/react'] = DEPENDENCY_REGISTRY['@phosphor-icons/react'];
    }

    // Form libraries
    const formChoice = config.frontend.forms || (config.frontend.uiExtras.forms ? 'rhf-zod' : 'none');
    if (formChoice === 'rhf-zod') {
      dependenciesToAdd['react-hook-form'] = DEPENDENCY_REGISTRY['react-hook-form'];
      dependenciesToAdd['@hookform/resolvers'] = DEPENDENCY_REGISTRY['@hookform/resolvers'];
      dependenciesToAdd.zod = DEPENDENCY_REGISTRY.zod;
    } else if (formChoice === 'tanstack-form') {
      dependenciesToAdd['@tanstack/react-form'] = DEPENDENCY_REGISTRY['@tanstack/react-form'];
      dependenciesToAdd.zod = DEPENDENCY_REGISTRY.zod;
    } else if (formChoice === 'formik-yup') {
      dependenciesToAdd.formik = DEPENDENCY_REGISTRY.formik;
      dependenciesToAdd.yup = DEPENDENCY_REGISTRY.yup;
    }

    if (Object.keys(dependenciesToAdd).length > 0) {
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolvePath('package.json'),
        content: { dependencies: dependenciesToAdd },
      });
    }

    // 1. Sonner Toast Provider
    if (config.frontend.uiExtras.toast) {
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/providers/toast-provider.tsx'),
        content: `import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
};
`,
      });

      // Patch main.tsx with ToastProvider
      vfs.applyAction({
        type: 'PATCH_AST',
        path: resolvePath('src/main.tsx'),
        patcher: (content) => {
          let patched = CodePatcher.addImports(content, [
            "import { ToastProvider } from './providers/toast-provider.js';",
          ]);
          patched = CodePatcher.wrapProvider(
            patched,
            '<ToastProvider>',
            '</ToastProvider>'
          );
          return patched;
        },
      });
    }

    // 2. Lucide Icon integration helper
    if (config.frontend.uiExtras.icons) {
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/components/ui/icon.tsx'),
        content: `import React from 'react';
import * as Icons from 'lucide-react';

export type IconName = keyof typeof Icons;

export interface IconProps extends Icons.LucideProps {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = Icons[name] as React.ComponentType<Icons.LucideProps>;
  if (!LucideIcon) {
    return null;
  }
  return <LucideIcon {...props} />;
};
`,
      });
    }

    // 3. React Hook Form + Zod Form Example
    if (config.frontend.uiExtras.forms) {
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/components/forms/login-form.tsx'),
        content: `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    toast.success(\`Welcome back, \${data.email}!\`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto text-left">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
          placeholder="developer@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};
`,
      });
    }
  },
};
