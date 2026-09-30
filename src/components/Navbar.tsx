import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Activity, Menu, X } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (id: string) => void;
  n8nUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToSection, n8nUrl }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', id: 'overview' },
    { name: 'Resume Analyzer', id: 'analyzer' },
    { name: 'ATS Diagnostics', id: 'diagnostics' },
    { name: 'n8n Architecture', id: 'architecture' },
    { name: 'FAQ', id: 'faq' },
  ];

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-neutral-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('overview')}
          className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors flex items-center gap-2 text-left"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span>ResumePulse</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={n8nUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>Direct n8n Form</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
          <button
            onClick={() => handleNavClick('analyzer')}
            className="px-4 py-2 text-xs font-medium text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            Analyze Resume
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left py-2 text-sm font-medium text-neutral-300 hover:text-white border-b border-neutral-900"
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="pt-3 flex flex-col gap-2">
            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-neutral-300 border border-neutral-800 rounded-lg bg-neutral-900"
            >
              <span>Open Direct n8n Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => handleNavClick('analyzer')}
              className="py-2.5 text-xs font-medium text-neutral-950 bg-emerald-400 rounded-lg text-center"
            >
              Start Resume Analysis
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
