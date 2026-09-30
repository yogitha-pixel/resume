import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ResumeAnalyzerForm } from './components/ResumeAnalyzerForm';
import { DiagnosticsExplorer } from './components/DiagnosticsExplorer';
import { ArchitectureSection } from './components/ArchitectureSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

const N8N_URL = 'https://yogitha45.app.n8n.cloud/form/0800a9ed-cb58-4880-beaa-d9a1152d2b0c';

export default function App() {
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950">
      <Navbar onScrollToSection={handleScrollToSection} n8nUrl={N8N_URL} />

      <main className="flex-grow">
        <HeroSection
          onStartAnalysis={() => handleScrollToSection('analyzer')}
          onExplorePipeline={() => handleScrollToSection('architecture')}
          n8nUrl={N8N_URL}
        />

        <ResumeAnalyzerForm n8nUrl={N8N_URL} />

        <DiagnosticsExplorer />

        <ArchitectureSection n8nUrl={N8N_URL} />

        <FAQSection />
      </main>

      <Footer onScrollToSection={handleScrollToSection} n8nUrl={N8N_URL} />
    </div>
  );
}
