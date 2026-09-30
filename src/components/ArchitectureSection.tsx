import React, { useState } from 'react';
import {
  Server,
  Workflow,
  Cpu,
  Mail,
  FileText,
  Activity,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ArchitectureSectionProps {
  n8nUrl: string;
}

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({ n8nUrl }) => {
  const [pingStatus, setPingStatus] = useState<{
    tested: boolean;
    loading: boolean;
    latencyMs?: number;
    healthy?: boolean;
    error?: string;
  }>({
    tested: false,
    loading: false,
  });

  const handleTestHealth = async () => {
    setPingStatus({ tested: false, loading: true });
    const startTime = performance.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      setPingStatus({
        tested: true,
        loading: false,
        latencyMs: latency,
        healthy: data.status === 'healthy',
      });
    } catch (err: unknown) {
      setPingStatus({
        tested: true,
        loading: false,
        healthy: false,
        error: err instanceof Error ? err.message : 'Ping failed',
      });
    }
  };

  const steps = [
    {
      number: '01',
      title: 'n8n Form Trigger Node',
      desc: 'Listens for multipart/form-data payload with field-0 (name), field-1 (resume file binary), and field-2 (notification email).',
      icon: Workflow,
      status: 'Active Endpoint',
    },
    {
      number: '02',
      title: 'Document Extraction & Normalizer',
      desc: 'Decompresses PDF/DOCX byte stream into clean UTF-8 text, separating candidate contact metadata, job history, and education.',
      icon: FileText,
      status: 'Binary Stream Parse',
    },
    {
      number: '03',
      title: 'AI Critique & LLM Scorer',
      desc: 'Applies domain-specific prompt models to grade candidate impact bullets, seniority calibration, and grammar clarity.',
      icon: Cpu,
      status: 'Multi-Agent Audit',
    },
    {
      number: '04',
      title: 'Keyword & ATS Rule Engine',
      desc: 'Scans the parsed resume against 50+ applicant tracking system heuristics, generating quantitative metric & verb scores.',
      icon: Zap,
      status: 'Algorithmic Score',
    },
    {
      number: '05',
      title: 'Automated Email Dispatcher',
      desc: 'Renders the comprehensive diagnostic report and delivers the evaluation directly to the candidate email address.',
      icon: Mail,
      status: 'SMTP / Cloud Delivery',
    },
  ];

  return (
    <section id="architecture" className="py-16 lg:py-24 border-t border-neutral-800/80 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <span>Cloud Automation Pipeline</span>
              <span aria-hidden="true">·</span>
              <span>Architecture Transparency</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How the n8n Workflow Executes
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 mt-2 max-w-2xl">
              Inspect the 5 automated stages triggered the moment a resume is dispatched to
              Yogitha's cloud workflow endpoint.
            </p>
          </div>

          {/* Real-time Health Ping */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTestHealth}
              disabled={pingStatus.loading}
              className="px-4 py-2 text-xs font-medium text-neutral-200 hover:text-white border border-neutral-800 hover:border-neutral-700 bg-neutral-900 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              {pingStatus.loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{pingStatus.loading ? 'Pinging...' : 'Test Backend & n8n Ping'}</span>
            </button>
            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Live Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Ping status notification if tested */}
        {pingStatus.tested && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              pingStatus.healthy
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Backend Connector Healthy · Response Latency:{' '}
                <strong className="font-mono tabular-nums">{pingStatus.latencyMs}ms</strong>
              </span>
            </div>
            <span className="font-mono text-[11px] text-neutral-400">
              Endpoint: yogitha45.app.n8n.cloud
            </span>
          </div>
        )}

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      STAGE {st.number}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white">{st.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{st.desc}</p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80">
                  <span className="text-[11px] font-mono text-emerald-400">{st.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Info Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-white">
              Automated Cloud Pipeline: 0800a9ed-cb58-4880-beaa-d9a1152d2b0c
            </h4>
            <p className="text-xs text-neutral-400 max-w-2xl">
              This workflow executes independently on Yogitha's cloud n8n environment. Submissions are
              safely received, evaluated with custom language logic, and tracked through production
              execution logs.
            </p>
          </div>
          <a
            href={n8nUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 text-xs font-semibold text-white border border-neutral-700 hover:border-neutral-600 bg-neutral-800 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            <span>Open Direct n8n Form</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
