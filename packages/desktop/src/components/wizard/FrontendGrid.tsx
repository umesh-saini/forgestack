import React from 'react';
import { Check, Database, Flame, Layers, Palette, Sparkles, ToggleLeft, ToggleRight, Zap } from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import { Badge } from '../common/Badge.js';

interface Props {
  frontend: ProjectConfig['frontend'];
  onChange: (fe: ProjectConfig['frontend']) => void;
}

export const FrontendGrid: React.FC<Props> = ({ frontend, onChange }) => {
  const stateOptions: {
    id: ProjectConfig['frontend']['state'];
    name: string;
    tag: string;
    desc: string;
    recommended?: boolean;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'query',
      name: 'TanStack Query v5',
      tag: 'Server Cache & Fetching',
      desc: 'Automatic cache invalidation, Axios client, QueryClientProvider, and Devtools.',
      recommended: true,
      icon: <Database className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'redux',
      name: 'Redux Toolkit',
      tag: 'Predictable Global State',
      desc: 'Centralized store, auth slices, typed hooks (useAppDispatch, useAppSelector).',
      icon: <Layers className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'zustand',
      name: 'Zustand',
      tag: 'Minimal Atomic Store',
      desc: 'Zero-boilerplate micro-store with localStorage persistence middleware.',
      icon: <Zap className="w-4 h-4 text-cyan-500" />,
    },
    {
      id: 'none',
      name: 'Standard React',
      tag: 'Built-in Hooks',
      desc: 'Standard useState, useReducer, and React Context without external state libraries.',
      icon: <Flame className="w-4 h-4 opacity-50" />,
    },
  ];

  const uiExtras: {
    key: 'toast' | 'icons' | 'forms';
    name: string;
    pkg: string;
    desc: string;
    active: boolean;
  }[] = [
    {
      key: 'toast',
      name: 'Sonner Toasters',
      pkg: 'sonner@2.0.8',
      desc: 'Modern non-intrusive toast notifications pre-mounted at application root.',
      active: frontend.uiExtras.toast,
    },
    {
      key: 'icons',
      name: 'Lucide Icons',
      pkg: 'lucide-react@0.475.0',
      desc: 'High-performance tree-shakeable SVG icon collection.',
      active: frontend.uiExtras.icons,
    },
    {
      key: 'forms',
      name: 'Form Architecture',
      pkg: 'react-hook-form + zod',
      desc: 'Type-safe form state and automated Zod validation resolvers.',
      active: frontend.uiExtras.forms,
    },
  ];

  return (
    <div className="space-y-4">
      {/* State Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
            State Management & Data Architecture
          </label>
          <span className="text-[11px] font-mono opacity-50">Select 1 option</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {stateOptions.map((item) => {
            const isSelected = frontend.state === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onChange({ ...frontend, state: item.id })}
                className={`group p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'ui-active-ring'
                    : 'ui-card hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg ui-card-subtle border">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs flex items-center gap-1.5">
                        {item.name}
                        {item.recommended && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded ui-card-subtle text-blue-500 font-mono">
                            Recommended
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-blue-500 font-mono">{item.tag}</p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'ui-card-subtle opacity-50'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[11px] opacity-70 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* UI Extras */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
            UI Primitives & Design System
          </label>
          <span className="text-[11px] font-mono text-cyan-500">
            Tailwind CSS v4 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {uiExtras.map((item) => (
            <div
              key={item.key}
              onClick={() =>
                onChange({
                  ...frontend,
                  uiExtras: {
                    ...frontend.uiExtras,
                    [item.key]: !item.active,
                  },
                })
              }
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                item.active
                  ? 'ui-active-ring'
                  : 'ui-card opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs">
                  {item.name}
                </span>
                <span className="text-cyan-500 font-mono text-[10px]">
                  {item.active ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[10px] opacity-50 font-mono mb-1">{item.pkg}</p>
              <p className="text-[11px] opacity-70 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
