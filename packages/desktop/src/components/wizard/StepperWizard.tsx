import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FolderOpen,
  Layers,
  Rocket,
  Shield,
  Sparkles,
  Wrench,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import { Step1IdentityArchetype } from './Step1IdentityArchetype.js';
import { Step2StackEcosystem } from './Step2StackEcosystem.js';
import { Step3ToolingGovernance } from './Step3ToolingGovernance.js';
import { Step4ReviewScaffold } from './Step4ReviewScaffold.js';

interface Props {
  config: ProjectConfig;
  fileCount: number;
  isGenerating: boolean;
  isComplete: boolean;
  logs: string[];
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
  onBrowseFolder: () => void;
  onScaffold: () => void;
  onSaveAsTemplate: (name: string, description: string) => void;
  onOpenFolder: () => void;
  onOpenVsCode: () => void;
  onOpenAntigravity?: () => void;
  onBackToHome: () => void;
}

export const StepperWizard: React.FC<Props> = ({
  config,
  fileCount,
  isGenerating,
  isComplete,
  logs,
  onChange,
  onBrowseFolder,
  onScaffold,
  onSaveAsTemplate,
  onOpenFolder,
  onOpenVsCode,
  onOpenAntigravity,
  onBackToHome,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const steps = [
    { number: 1, title: 'Identity & Archetype', desc: 'Project name, path, & runtime' },
    { number: 2, title: 'Stack Ecosystem', desc: 'Framework, state, & database' },
    { number: 3, title: 'Tooling & Governance', desc: 'DevOps, utilities, & AI specs' },
    { number: 4, title: 'Review & Synthesize', desc: 'Save preset & scaffold' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stepper Navigation Header */}
      <div className="ui-panel rounded-2xl p-4 border space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Templates</span>
          </button>

          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            Step {currentStep} of 4: {steps[currentStep - 1].title}
          </span>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {steps.map((s) => {
            const isCompleted = s.number < currentStep;
            const isCurrent = s.number === currentStep;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setCurrentStep(s.number as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isCurrent
                    ? 'ui-active-ring shadow-sm'
                    : isCompleted
                    ? 'ui-card-subtle text-emerald-400 border-emerald-500/30'
                    : 'ui-panel opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'ui-card border'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.number}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs truncate">{s.title}</div>
                  <div className="text-[10px] opacity-60 truncate">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[460px]">
        {currentStep === 1 && (
          <Step1IdentityArchetype
            config={config}
            onChange={onChange}
            onBrowseFolder={onBrowseFolder}
          />
        )}
        {currentStep === 2 && (
          <Step2StackEcosystem config={config} onChange={onChange} />
        )}
        {currentStep === 3 && (
          <Step3ToolingGovernance config={config} onChange={onChange} />
        )}
        {currentStep === 4 && (
          <Step4ReviewScaffold
            config={config}
            fileCount={fileCount}
            isGenerating={isGenerating}
            isComplete={isComplete}
            logs={logs}
            onScaffold={onScaffold}
            onSaveAsTemplate={onSaveAsTemplate}
            onOpenFolder={onOpenFolder}
            onOpenVsCode={onOpenVsCode}
            onOpenAntigravity={onOpenAntigravity}
          />
        )}
      </div>

      {/* Stepper Footer Controls */}
      <div className="flex items-center justify-between border-t pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as any)}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded-xl ui-card-subtle border text-xs font-medium flex items-center gap-1.5 transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1) as any)}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/25 active:scale-95"
          >
            <span>Next: {steps[currentStep].title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onScaffold}
            disabled={isGenerating}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/30"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Scaffold Project ({fileCount} files)</span>
          </button>
        )}
      </div>
    </div>
  );
};
