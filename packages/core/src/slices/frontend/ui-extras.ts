import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import { CodePatcher } from '../../utils/code-patcher.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const uiExtrasSlice: FeatureSlice = {
  id: 'fe-ui-extras',
  name: 'Frontend Feedback & UI Extras (Toast, Icons, Forms)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (
      config.frontend.framework !== 'react-vite' ||
      config.topology === 'electron-desktop' ||
      config.topology === 'tauri-desktop' ||
      config.topology === 'micro-frontend' ||
      config.topology === 'nextjs-fullstack'
    ) {
      return;
    }

    const basePath =
      config.topology === 'monorepo' ||
      config.topology === 'ai-agent-rag'
        ? 'apps/web'
        : config.topology === 'separate-folders'
        ? 'frontend'
        : '';
    const resolvePath = (p: string) => (basePath ? `${basePath}/${p}` : p);

    const dependenciesToAdd: Record<string, string> = {};

    // 1. Toast Choice
    const toastChoice = config.frontend.toast || (config.frontend.uiExtras.toast ? 'sonner' : 'none');
    if (toastChoice === 'sonner') {
      dependenciesToAdd.sonner = DEPENDENCY_REGISTRY.sonner;
    } else if (toastChoice === 'toastify') {
      dependenciesToAdd['react-toastify'] = DEPENDENCY_REGISTRY['react-toastify'];
    } else if (toastChoice === 'hot-toast') {
      dependenciesToAdd['react-hot-toast'] = DEPENDENCY_REGISTRY['react-hot-toast'];
    }

    // 2. Icon Choice
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

    // 3. Form Choice
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

    // 1. Toast Provider Component
    if (config.frontend.uiExtras.toast && toastChoice !== 'none') {
      let toastProviderContent = '';
      if (toastChoice === 'toastify') {
        toastProviderContent = `import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
    </>
  );
};
`;
      } else if (toastChoice === 'hot-toast') {
        toastProviderContent = `import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
};
`;
      } else {
        // default: sonner
        toastProviderContent = `import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
};
`;
      }

      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/providers/toast-provider.tsx'),
        content: toastProviderContent,
      });

      // Patch main.tsx with ToastProvider if present
      if (vfs.hasFile(resolvePath('src/main.tsx'))) {
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
    }

    // 2. Icon integration helper
    if (config.frontend.uiExtras.icons && iconsChoice !== 'none') {
      let iconContent = '';
      if (iconsChoice === 'tabler') {
        iconContent = `import React from 'react';
import * as Icons from '@tabler/icons-react';

export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  stroke?: number | string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, stroke = 2, ...props }) => {
  const TablerIcon = Icons[name] as React.ComponentType<any>;
  if (!TablerIcon) {
    return null;
  }
  return <TablerIcon size={size} stroke={stroke} {...props} />;
};
`;
      } else if (iconsChoice === 'phosphor') {
        iconContent = `import React from 'react';
import * as Icons from '@phosphor-icons/react';

export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, weight = 'regular', ...props }) => {
  const PhosphorIcon = Icons[name] as React.ComponentType<any>;
  if (!PhosphorIcon) {
    return null;
  }
  return <PhosphorIcon size={size} weight={weight} {...props} />;
};
`;
      } else if (iconsChoice === 'react-icons') {
        iconContent = `import React from 'react';
import * as Icons from 'react-icons/fi';

export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, ...props }) => {
  const ReactIconComponent = Icons[name] as React.ComponentType<any>;
  if (!ReactIconComponent) {
    return null;
  }
  return <ReactIconComponent size={size} {...props} />;
};
`;
      } else {
        // default: lucide
        iconContent = `import React from 'react';
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
`;
      }

      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/components/ui/icon.tsx'),
        content: iconContent,
      });
    }

    // 3. Form Component
    if (config.frontend.uiExtras.forms && formChoice !== 'none') {
      let formContent = '';

      const toastImport =
        toastChoice === 'toastify'
          ? "import { toast } from 'react-toastify';"
          : toastChoice === 'hot-toast'
          ? "import toast from 'react-hot-toast';"
          : toastChoice === 'sonner'
          ? "import { toast } from 'sonner';"
          : '';

      if (formChoice === 'formik-yup') {
        formContent = `import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
${toastImport}

const validationSchema = Yup.object({
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export const LoginForm: React.FC = () => {
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      ${toastChoice === 'none' ? "alert(`Welcome back, ${values.email}!`);" : "toast.success(`Welcome back, ${values.email}!`);"}
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-sm mx-auto text-left">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
          placeholder="developer@example.com"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
          placeholder="••••••••"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
      >
        {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};
`;
      } else if (formChoice === 'tanstack-form') {
        formContent = `import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
${toastImport}

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginForm: React.FC = () => {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      ${toastChoice === 'none' ? "alert(`Welcome back, ${value.email}!`);" : "toast.success(`Welcome back, ${value.email}!`);"}
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 max-w-sm mx-auto text-left"
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const res = formSchema.shape.email.safeParse(value);
            return res.success ? undefined : res.error.errors[0]?.message;
          },
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="developer@example.com"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            const res = formSchema.shape.password.safeParse(value);
            return res.success ? undefined : res.error.errors[0]?.message;
          },
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="••••••••"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
};
`;
      } else {
        // default: rhf-zod
        formContent = `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
${toastImport}

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
    ${toastChoice === 'none' ? "alert(`Welcome back, ${data.email}!`);" : "toast.success(`Welcome back, ${data.email}!`);"}
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
`;
      }

      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/components/forms/login-form.tsx'),
        content: formContent,
      });
    }
  },
};
