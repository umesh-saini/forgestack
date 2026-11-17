import React from 'react';
import { Bot, Check, FileCode, Shield, Sparkles } from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import { Badge } from '../common/Badge.js';

interface Props {
  aiGovernance: ProjectConfig['aiGovernance'];
  onChange: (ai: ProjectConfig['aiGovernance']) => void;
}

export const AiGovernance: React.FC<Props> = ({ aiGovernance, onChange }) => {
  const items: {
    key: keyof ProjectConfig['aiGovernance'];
    title: string;
    path: string;
    desc: string;
    bulletPoints: string[];
    active: boolean;
  }[] = [
    {
      key: 'rules',
      title: 'Cursor Engineering Reviewer Rules',
      path: '.cursor/rules/*.mdc',
      desc: 'Principal Engineer AI rules enforcing architecture boundaries and strict TypeScript.',
      bulletPoints: [
        'Zero direct database queries inside route controllers',
        'Refuse `any` or loose casting in TypeScript',
        'Strict error handling and defensive pooling',
      ],
      active: aiGovernance.rules,
    },
    {
      key: 'skills',
      title: 'Antigravity & Gemini Clean Code Skills',
      path: '.agents/skills/**/SKILL.md',
      desc: 'Reusable engineering guidelines for accessible UI design and clean modular services.',
      bulletPoints: [
        'Modern UI: WCAG AA, Radix primitives, Tailwind tokens',
        'Clean Coding: Service boundaries & repository decoupling',
        'Contracts: Automatic schema synchronization between FE & BE',
      ],
      active: aiGovernance.skills,
    },
    {
      key: 'openSpec',
      title: 'OpenSpec Governance Workflows',
      path: 'openspec/ & .agents/workflows/',
      desc: 'Strict design spec, delta spec sync, and behavioral verification for all future feature changes.',
      bulletPoints: [
        'Strict spec generation before code authoring',
        'Built-in opsx-propose, opsx-apply, and opsx-sync commands',
        'Architecture documentation stays 100% synchronized',
      ],
      active: aiGovernance.openSpec,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl ui-card-subtle flex items-center justify-between text-xs border">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="opacity-80">
            <strong>Day-One AI Alignment:</strong> Pre-configures Agent rules, prompt skills, and OpenSpec workflows directly inside the repository.
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.key}
            onClick={() =>
              onChange({
                ...aiGovernance,
                [item.key]: !item.active,
              })
            }
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
              item.active
                ? 'ui-active-ring'
                : 'ui-card opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-xs">{item.title}</h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono ui-card-subtle border opacity-80">
                    {item.path}
                  </span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed mb-2.5">
                  {item.desc}
                </p>
                <ul className="space-y-1">
                  {item.bulletPoints.map((bp, i) => (
                    <li
                      key={i}
                      className="text-[11px] font-mono opacity-60 flex items-center gap-1.5"
                    >
                      <span className="text-blue-500">›</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                  item.active
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'ui-card-subtle opacity-50'
                }`}
              >
                {item.active && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
