import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Server } from 'lucide-react';
import heroImage from '../assets/images/hero_resume_analyzer_1790761127239.jpg';

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onExplorePipeline: () => void;
  n8nUrl: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAnalysis,
  onExplorePipeline,
  n8nUrl,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="overview" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition & Action */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quiet metadata line without pills */}
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live n8n Cloud Integration
              </span>
              <span aria-hidden="true">·</span>
              <span>Workflow ID: 0800a9ed</span>
              <span aria-hidden="true">·</span>
              <span>Yogitha Cloud Instance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
              AI Resume Analyzer powered by automated n8n workflows.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              Audit your resume against 50+ modern ATS screening rules, identify critical missing
              role keywords, and initiate deep algorithmic critique directly via Yogitha's automated
              n8n cloud execution pipeline.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartAnalysis}
                className="px-6 py-3.5 text-sm font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
              >
                <span>Upload Resume & Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExplorePipeline}
                className="px-5 py-3.5 text-sm font-medium text-neutral-200 hover:text-white border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Server className="w-4 h-4 text-neutral-400" />
                <span>Inspect n8n Pipeline</span>
              </button>
            </div>

            {/* Adjacent Quantitative Proof & Value Points */}
            <div className="pt-6 border-t border-neutral-900 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold text-white font-mono tabular-nums">50+</p>
                <p className="text-xs text-neutral-400 mt-0.5">ATS Filters Verified</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">&lt; 3s</p>
                <p className="text-xs text-neutral-400 mt-0.5">Instant Heuristic Scan</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-2xl font-bold text-white font-mono tabular-nums">100%</p>
                <p className="text-xs text-neutral-400 mt-0.5">Automated n8n Webhook</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/70 shadow-2xl shadow-black/60 group">
              {!imageError ? (
                <img
                  src={heroImage}
                  alt="ResumePulse executive workstation with automated career analytics"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-auto aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full aspect-[16/10] bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400 font-mono">AUTOMATED PIPELINE</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Resume Intelligence Engine</h3>
                    <p className="text-xs text-neutral-400">Connected to Yogitha's n8n cloud form</p>
                  </div>
                </div>
              )}

              {/* Scrim Overlay Card with live details */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent">
                <div className="bg-neutral-900/90 border border-neutral-800/90 backdrop-blur-md rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      Active Workflow Hook
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px]">200 OK Available</span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate font-mono">
                    https://yogitha45.app.n8n.cloud/form/...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
