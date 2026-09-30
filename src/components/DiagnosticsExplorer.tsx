import React, { useState } from 'react';
import {
  CheckCircle2,
  FileCheck2,
  Cpu,
  Layers,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const DiagnosticsExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'keywords' | 'verbs'>('checklist');
  const [selectedRole, setSelectedRole] = useState<'fullstack' | 'ml' | 'product' | 'devops'>('fullstack');

  const atsRules = [
    {
      title: 'Standard Single-Column Layout',
      desc: 'Most ATS parsers read left-to-right, top-to-bottom. Multi-column tables or text boxes frequently scramble work chronology.',
      importance: 'Critical',
    },
    {
      title: 'Standard Section Headings',
      desc: 'Use universal naming conventions like "Work Experience", "Education", and "Skills" instead of creative variants like "Where I have been".',
      importance: 'Critical',
    },
    {
      title: 'Machine-Readable PDF / DOCX',
      desc: 'Ensure your PDF contains real selectable vector text rather than a scanned raster image or canvas flatten.',
      importance: 'Critical',
    },
    {
      title: 'Metrics in Bullet Points',
      desc: 'ATS and recruiter screeners look for quantified achievements: percentage efficiency, revenue generated, or latency dropped.',
      importance: 'High',
    },
    {
      title: 'Avoid Header & Footer Contact Placement',
      desc: 'Some older ATS platforms discard content within document headers or footers, causing lost phone numbers and emails.',
      importance: 'High',
    },
    {
      title: 'Explicit Skill Taxonomy',
      desc: 'List both full phrases and standard acronyms (e.g. "Continuous Integration / Continuous Delivery (CI/CD)").',
      importance: 'Medium',
    },
  ];

  const roleKeywordPacks = {
    fullstack: {
      name: 'Full-Stack Software Engineering',
      keywords: [
        'TypeScript', 'React 18/19', 'Next.js', 'Node.js', 'PostgreSQL',
        'Redis', 'Docker', 'GraphQL', 'RESTful APIs', 'Microservices',
        'State Management', 'Jest/Playwright', 'CI/CD Pipelines', 'AWS / Cloud'
      ],
      description: 'Key competencies demanded for modern web platform development and distributed systems.'
    },
    ml: {
      name: 'Machine Learning & AI Engineering',
      keywords: [
        'PyTorch', 'TensorFlow', 'LLMs', 'RAG Pipelines', 'Transformers',
        'Vector Databases', 'Fine-tuning (LoRA)', 'CUDA', 'Ray / Distributed ML',
        'vLLM / TensorRT', 'LangChain', 'SageMaker', 'Model Evaluation'
      ],
      description: 'Core stacks for productionizing Generative AI, embeddings, and deep learning architectures.'
    },
    product: {
      name: 'Technical Product Management',
      keywords: [
        'Product Roadmap', 'User Telemetry', 'A/B Experimentation', 'API Strategy',
        'Agile/Scrum', 'SQL Analytics', 'GTM Strategy', 'User Persona Research',
        'PRD Documentation', 'Linear / Jira', 'Amplitude / Mixpanel', 'ARR Growth'
      ],
      description: 'Strategic frameworks and analytics toolsets for scaling enterprise and SaaS products.'
    },
    devops: {
      name: 'Cloud Infrastructure & Platform Engineering',
      keywords: [
        'Kubernetes', 'Terraform (IaC)', 'Docker', 'AWS ECS/EKS', 'CI/CD Automation',
        'Prometheus / Grafana', 'GitOps / ArgoCD', 'Linux Internals', 'Helm Charts',
        'Zero Trust Security', 'Site Reliability (SRE)', 'Network Mesh'
      ],
      description: 'Essential platform tools for 99.99% uptime, container orchestration, and automated delivery.'
    }
  };

  const actionVerbCategories = [
    {
      category: 'Architecture & Engineering',
      verbs: ['Architected', 'Constructed', 'Engineered', 'Overhauled', 'Modernized', 'Pioneered', 'Migrated', 'Automated'],
    },
    {
      category: 'Quantifiable Growth & Scaling',
      verbs: ['Accelerated', 'Amplified', 'Expanded', 'Exceeded', 'Generated', 'Maximized', 'Multiplied', 'Surpassed'],
    },
    {
      category: 'Efficiency & Cost Reduction',
      verbs: ['Consolidated', 'Decreased', 'Eliminated', 'Optimized', 'Reduced', 'Restructured', 'Slashed', 'Streamlined'],
    },
    {
      category: 'Leadership & Execution',
      verbs: ['Championed', 'Directed', 'Guided', 'Instituted', 'Led', 'Mentored', 'Orchestrated', 'Spearheaded'],
    },
  ];

  return (
    <section id="diagnostics" className="py-16 lg:py-24 border-t border-neutral-800/80 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <span>Optimization Knowledge Base</span>
              <span aria-hidden="true">·</span>
              <span>ATS Benchmark Standards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Resume Diagnostic Guidelines
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 mt-2 max-w-2xl">
              Understand the scoring heuristics used by enterprise ATS filters and algorithmic screening
              models before your resume reaches recruiter eyes.
            </p>
          </div>

          {/* Segmented Controls */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ATS Checklist
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'keywords'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Role Keywords
            </button>
            <button
              onClick={() => setActiveTab('verbs')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'verbs'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Power Verbs
            </button>
          </div>
        </div>

        {/* Tab 1: ATS Checklist */}
        {activeTab === 'checklist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atsRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-400">0{idx + 1}.</span>
                    <span
                      className={`text-[11px] font-mono ${
                        rule.importance === 'Critical'
                          ? 'text-red-400'
                          : rule.importance === 'High'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {rule.importance} Priority
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{rule.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{rule.desc}</p>
                </div>

                <div className="pt-3 border-t border-neutral-800/60 flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified in n8n parser rulebook</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Role Keyword Benchmark */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            {/* Role Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(roleKeywordPacks) as Array<keyof typeof roleKeywordPacks>).map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedRole(k)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    selectedRole === k
                      ? 'bg-neutral-800 border-neutral-700 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {roleKeywordPacks[k].name}
                </button>
              ))}
            </div>

            {/* Keyword Grid Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {roleKeywordPacks[selectedRole].name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {roleKeywordPacks[selectedRole].description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                {roleKeywordPacks[selectedRole].keywords.map((kw, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/90 text-xs font-mono text-neutral-200 flex items-center justify-between"
                  >
                    <span>{kw}</span>
                    <span className="text-[10px] text-emerald-400/80 font-sans">High Weight</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Power Verbs */}
        {activeTab === 'verbs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionVerbCategories.map((group, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="text-sm font-bold text-white">{group.category}</h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    {group.verbs.length} Verbs
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.verbs.map((verb, vi) => (
                    <span
                      key={vi}
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
