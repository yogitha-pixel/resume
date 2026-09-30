import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  n8nUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, n8nUrl }) => {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="space-y-1">
            <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ResumePulse
            </span>
            <p className="text-xs text-neutral-400">
              AI Resume Analyzer connected to Yogitha's automated cloud n8n workflow.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <button
              onClick={() => onScrollToSection('overview')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => onScrollToSection('analyzer')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Resume Analyzer
            </button>
            <button
              onClick={() => onScrollToSection('diagnostics')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ATS Diagnostics
            </button>
            <button
              onClick={() => onScrollToSection('architecture')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              n8n Workflow
            </button>
            <button
              onClick={() => onScrollToSection('faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>Direct n8n Form</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} ResumePulse. All rights reserved.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Workflow: 0800a9ed-cb58-4880-beaa-d9a1152d2b0c</span>
            <span aria-hidden="true">·</span>
            <span>yogitha45.app.n8n.cloud</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
