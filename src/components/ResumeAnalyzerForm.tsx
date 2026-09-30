import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Shield,
  Send,
  Download,
  Info,
  Layers,
  BarChart3,
  X,
  FileCheck
} from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes';
import { analyzeResumeText, DiagnosticResult } from '../utils/atsDiagnostic';

interface ResumeAnalyzerFormProps {
  n8nUrl: string;
}

interface SubmissionResult {
  success: boolean;
  n8nStatus: number;
  message: string;
  details: {
    candidateName: string;
    email: string;
    fileName: string;
    fileSize: number;
    jobRole: string;
    submittedAt: string;
    n8nEndpoint: string;
  };
  rawResponse?: string;
}

export const ResumeAnalyzerForm: React.FC<ResumeAnalyzerFormProps> = ({ n8nUrl }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'inspector'>('form');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobRole, setJobRole] = useState('Senior Full-Stack Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Senior (5-8 yrs)');
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');

  // Diagnostic state
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState('');
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze text whenever resumeText or jobRole changes
  useEffect(() => {
    if (resumeText.trim().length > 30) {
      const result = analyzeResumeText(resumeText, jobRole);
      setDiagnostic(result);
    } else {
      setDiagnostic(null);
    }
  }, [resumeText, jobRole]);

  // Handle file selection
  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setSubmitError(null);

    // Read file text for pre-flight diagnosis
    if (
      selectedFile.type === 'text/plain' ||
      selectedFile.name.endsWith('.txt') ||
      selectedFile.name.endsWith('.md')
    ) {
      const text = await selectedFile.text();
      setResumeText(text);
    } else {
      // For PDF / binary files, generate diagnostic preview based on filename and metadata
      // (Actual extraction happens in the n8n cloud pipeline)
      const placeholderText = `Candidate Resume Document: ${selectedFile.name}\nSize: ${(selectedFile.size / 1024).toFixed(1)} KB\nCandidate Name: ${name || 'Provided Candidate'}\nEmail: ${email || 'candidate@example.com'}\nTarget Position: ${jobRole}\nProfessional Experience in modern software architecture, project delivery, team leadership, cross-functional execution, metrics optimization.`;
      setResumeText(placeholderText);
    }
  };

  // Handle sample resume selection
  const handleLoadSample = (sample: SampleResume) => {
    setName(sample.candidateName);
    setEmail(sample.email);
    setJobRole(sample.targetRole);
    setExperienceLevel(sample.experienceLevel);
    setResumeText(sample.content);

    // Create a mock File object
    const blob = new Blob([sample.content], { type: 'text/plain' });
    const sampleFile = new File([blob], `${sample.id}_resume.txt`, { type: 'text/plain' });
    setFile(sampleFile);
    setSubmitError(null);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError('Please enter your full name (required by n8n field-0).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid email address (required by n8n field-2).');
      return;
    }
    if (!file) {
      setSubmitError('Please upload a resume file or select a sample resume (required by n8n field-1).');
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress('Packaging payload with candidate metadata...');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('jobRole', jobRole);
      formData.append('experienceLevel', experienceLevel);
      formData.append('file', file);

      setSubmissionProgress('Transmitting multipart data to n8n Cloud webhook...');

      const response = await fetch('/api/submit-resume', {
        method: 'POST',
        body: formData,
      });

      setSubmissionProgress('Processing webhook execution confirmation...');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit resume to n8n workflow');
      }

      setSubmissionResult(data);
    } catch (err: unknown) {
      console.error('Submission failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Network error during submission';
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
      setSubmissionProgress('');
    }
  };

  // Reset form
  const handleReset = () => {
    setName('');
    setEmail('');
    setFile(null);
    setResumeText('');
    setDiagnostic(null);
    setSubmissionResult(null);
    setSubmitError(null);
  };

  // Download diagnostic summary
  const handleDownloadDiagnostic = () => {
    if (!diagnostic && !submissionResult) return;
    const summaryData = {
      app: 'ResumePulse AI',
      targetWebhook: n8nUrl,
      candidate: {
        name,
        email,
        jobRole,
        experienceLevel,
      },
      diagnosticScore: diagnostic?.score,
      sectionsDetected: diagnostic?.sectionsFound,
      quantifiedMetricsFound: diagnostic?.metricCount,
      actionVerbsIdentified: diagnostic?.actionVerbCount,
      matchedRoleKeywords: diagnostic?.matchedKeywords,
      missingRoleKeywords: diagnostic?.missingKeywords,
      recommendations: diagnostic?.recommendations,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_analysis_${name.replace(/\s+/g, '_').toLowerCase() || 'report'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="analyzer" className="py-16 lg:py-24 border-t border-neutral-800/80 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <span>Interactive Workflow Trigger</span>
              <span aria-hidden="true">·</span>
              <span>Direct n8n Endpoint</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Resume Analysis Engine
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 mt-2 max-w-2xl">
              Upload your resume for real-time ATS pre-diagnostics, then dispatch directly to
              Yogitha's cloud n8n execution pipeline for deep automated parsing.
            </p>
          </div>

          {/* Segmented Mode Control */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Interactive Form
            </button>
            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'inspector'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              n8n Webhook Inspector
            </button>
          </div>
        </div>

        {/* Mode A: Interactive Form & Pre-flight Diagnostics */}
        {activeTab === 'form' ? (
          <div>
            {/* Quick Sample Selector */}
            <div className="mb-8 p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Quick Test: Load Pre-Configured Candidate Resume
                </span>
                <span className="text-xs text-neutral-400">
                  Instant 1-click test with sample resumes
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_RESUMES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className="p-3 text-left border border-neutral-800 hover:border-emerald-500/50 rounded-lg bg-neutral-950/60 hover:bg-neutral-900 transition-colors group cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {sample.candidateName}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">{sample.title}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submission Result Success View */}
            {submissionResult ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-neutral-900/90 p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Resume Successfully Dispatched to n8n Cloud
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Workflow HTTP status: {submissionResult.n8nStatus} OK · Execution confirmed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadDiagnostic}
                      className="px-3.5 py-2 text-xs font-medium text-white border border-neutral-700 hover:border-neutral-600 bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Summary JSON</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-3.5 py-2 text-xs font-medium text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Submit Another</span>
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Candidate Name</span>
                    <span className="text-white font-medium text-sm mt-0.5 block truncate">
                      {submissionResult.details.candidateName}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Notification Email</span>
                    <span className="text-white font-medium text-sm mt-0.5 block truncate">
                      {submissionResult.details.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Uploaded File</span>
                    <span className="text-white font-medium text-sm mt-0.5 block truncate font-mono">
                      {submissionResult.details.fileName} ({(submissionResult.details.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Target Role</span>
                    <span className="text-emerald-400 font-medium text-sm mt-0.5 block truncate">
                      {submissionResult.details.jobRole}
                    </span>
                  </div>
                </div>

                {/* Diagnostic Score Card if available */}
                {diagnostic && (
                  <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Pre-Flight ATS Readiness Score</h4>
                        <p className="text-xs text-neutral-400">
                          Algorithmic evaluation based on formatting, action metrics, and role keywords
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
                          {diagnostic.score}
                        </span>
                        <span className="text-xs text-neutral-400"> / 100</span>
                      </div>
                    </div>

                    <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${diagnostic.score}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-neutral-300">Key Strengths Identified</p>
                        <ul className="text-xs text-neutral-400 space-y-1">
                          <li className="flex items-center gap-2 text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{diagnostic.metricCount} Quantified performance achievements detected</span>
                          </li>
                          <li className="flex items-center gap-2 text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{diagnostic.actionVerbCount} High-impact action verbs found</span>
                          </li>
                          <li className="flex items-center gap-2 text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Word count: {diagnostic.wordCount} words (~{diagnostic.estimatedReadingTimeMinutes} min read)</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-neutral-300">Actionable Recommendations</p>
                        <ul className="text-xs text-neutral-400 space-y-1">
                          {diagnostic.recommendations.slice(0, 3).map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-400 flex items-center justify-between">
                  <span>Target n8n Webhook: {submissionResult.details.n8nEndpoint}</span>
                  <a
                    href={n8nUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Inspect Raw Form</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              /* Two-Column Form and Live Diagnostic Preview */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Input Column */}
                <form
                  onSubmit={handleSubmit}
                  className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5"
                >
                  <div className="border-b border-neutral-800 pb-4">
                    <h3 className="text-lg font-bold text-white">Candidate & Resume Details</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Payload will be mapped to n8n parameters: field-0 (name), field-1 (resume), field-2 (email).
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-300" htmlFor="candidate-name">
                      Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      id="candidate-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-300" htmlFor="candidate-email">
                      Notification Email <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      id="candidate-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex.morgan@example.com"
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                    <p className="text-[11px] text-neutral-400">
                      n8n automated workflow sends the finalized critique report to this address.
                    </p>
                  </div>

                  {/* Role and Level Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-neutral-300" htmlFor="target-role">
                        Target Position
                      </label>
                      <select
                        id="target-role"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      >
                        <option value="Senior Full-Stack Engineer">Senior Full-Stack Engineer</option>
                        <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                        <option value="Technical Product Manager">Technical Product Manager</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                        <option value="Default">General Professional</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-neutral-300" htmlFor="experience-level">
                        Experience Level
                      </label>
                      <select
                        id="experience-level"
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      >
                        <option value="Junior (0-2 yrs)">Early Career (0-2 yrs)</option>
                        <option value="Mid Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                        <option value="Senior (5-8 yrs)">Senior Specialist (5-8 yrs)</option>
                        <option value="Staff / Lead (8+ yrs)">Staff / Lead / Executive (8+ yrs)</option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload Drag & Drop Zone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Upload Resume Document <span className="text-emerald-400">*</span>
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileChange(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : file
                          ? 'border-emerald-500/40 bg-neutral-950'
                          : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
                      }`}
                    >
                      {file ? (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                          <div className="flex items-center gap-3 truncate text-left">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-medium text-white truncate">{file.name}</p>
                              <p className="text-[11px] text-neutral-400 font-mono">
                                {(file.size / 1024).toFixed(1)} KB · Ready for submission
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                              setResumeText('');
                            }}
                            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 mx-auto flex items-center justify-center text-neutral-400">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-white">
                              Click to upload or drag & drop resume
                            </p>
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              Supported formats: PDF, DOCX, DOC, TXT (Max 15MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md ${
                        isSubmitting
                          ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                          : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{submissionProgress || 'Submitting to n8n Cloud...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Resume to n8n Cloud Pipeline</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Live Diagnostic Preview Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">Live ATS Pre-Diagnostic</h3>
                        <p className="text-xs text-neutral-400">Client-side heuristic audit</p>
                      </div>
                      {diagnostic && (
                        <div className="text-right">
                          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                            {diagnostic.score}
                          </span>
                          <span className="text-xs text-neutral-400">/100</span>
                        </div>
                      )}
                    </div>

                    {diagnostic ? (
                      <div className="space-y-4">
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-neutral-400">
                            <span>Compliance Index</span>
                            <span>{diagnostic.score >= 80 ? 'Strong' : diagnostic.score >= 60 ? 'Moderate' : 'Needs Optimization'}</span>
                          </div>
                          <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${diagnostic.score}%` }}
                            />
                          </div>
                        </div>

                        {/* Contact Checks */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                            Essential Contact Metadata
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${
                                  diagnostic.contactChecks.hasEmail ? 'text-emerald-400' : 'text-neutral-600'
                                }`}
                              />
                              <span className={diagnostic.contactChecks.hasEmail ? 'text-neutral-200' : 'text-neutral-400'}>
                                Email Detected
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${
                                  diagnostic.contactChecks.hasPhone ? 'text-emerald-400' : 'text-neutral-600'
                                }`}
                              />
                              <span className={diagnostic.contactChecks.hasPhone ? 'text-neutral-200' : 'text-neutral-400'}>
                                Phone Number
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${
                                  diagnostic.contactChecks.hasLinkedIn ? 'text-emerald-400' : 'text-neutral-600'
                                }`}
                              />
                              <span className={diagnostic.contactChecks.hasLinkedIn ? 'text-neutral-200' : 'text-neutral-400'}>
                                LinkedIn Profile
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${
                                  diagnostic.contactChecks.hasLocation ? 'text-emerald-400' : 'text-neutral-600'
                                }`}
                              />
                              <span className={diagnostic.contactChecks.hasLocation ? 'text-neutral-200' : 'text-neutral-400'}>
                                Location / City
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Numerical Metrics and Action Verbs */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                            <span className="text-[11px] text-neutral-400 block">Quantified Impact</span>
                            <span className="text-lg font-bold text-white font-mono tabular-nums mt-0.5 block">
                              {diagnostic.metricCount} <span className="text-xs font-normal text-neutral-400">metrics</span>
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                            <span className="text-[11px] text-neutral-400 block">Power Action Verbs</span>
                            <span className="text-lg font-bold text-white font-mono tabular-nums mt-0.5 block">
                              {diagnostic.actionVerbCount} <span className="text-xs font-normal text-neutral-400">verbs</span>
                            </span>
                          </div>
                        </div>

                        {/* Keyword Match Explorer */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold uppercase tracking-wider text-neutral-400">
                              Role Keywords ({jobRole})
                            </span>
                            <span className="text-emerald-400 font-mono">
                              {diagnostic.matchedKeywords.length} matched / {diagnostic.missingKeywords.length} missing
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {diagnostic.matchedKeywords.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {diagnostic.matchedKeywords.slice(0, 6).map((kw) => (
                                  <span
                                    key={kw}
                                    className="text-[11px] px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded font-mono"
                                  >
                                    ✓ {kw}
                                  </span>
                                ))}
                              </div>
                            )}

                            {diagnostic.missingKeywords.length > 0 && (
                              <div className="pt-1">
                                <span className="text-[11px] text-neutral-400 block mb-1">
                                  Consider adding:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {diagnostic.missingKeywords.slice(0, 5).map((kw) => (
                                    <span
                                      key={kw}
                                      className="text-[11px] px-2 py-0.5 bg-neutral-950 text-neutral-400 border border-neutral-800 rounded font-mono"
                                    >
                                      + {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Top Recommendation */}
                        {diagnostic.recommendations.length > 0 && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{diagnostic.recommendations[0]}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-12 px-4 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
                          <BarChart3 className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-neutral-400">
                          Upload a resume or select one of the quick test samples above to generate an instant ATS pre-flight diagnostic.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mode B: Direct n8n Webhook Inspector */
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">n8n Cloud Webhook Specification</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Technical breakdown of the underlying workflow trigger endpoint.
                </p>
              </div>
              <a
                href={n8nUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Launch Direct n8n Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">Endpoint Type</span>
                <p className="text-sm font-bold text-white font-mono">n8n Form Trigger</p>
                <p className="text-[11px] text-neutral-400">Accepts multipart/form-data</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">Webhook Method</span>
                <p className="text-sm font-bold text-emerald-400 font-mono">POST</p>
                <p className="text-[11px] text-neutral-400">Direct execution trigger</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">Workflow UUID</span>
                <p className="text-sm font-bold text-white font-mono">0800a9ed-cb58-4880</p>
                <p className="text-[11px] text-neutral-400">Hosted on yogitha45.app.n8n.cloud</p>
              </div>
            </div>

            {/* Field Schema Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Form Payload Schema Mapping
              </h4>
              <div className="overflow-x-auto border border-neutral-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">n8n Field ID</th>
                      <th className="py-2.5 px-4 font-medium">Field Label</th>
                      <th className="py-2.5 px-4 font-medium">Type</th>
                      <th className="py-2.5 px-4 font-medium">Validation</th>
                      <th className="py-2.5 px-4 font-medium">Applet Mapping</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono text-neutral-300">
                    <tr>
                      <td className="py-2.5 px-4 text-emerald-400">field-0</td>
                      <td className="py-2.5 px-4 font-sans">name</td>
                      <td className="py-2.5 px-4">text</td>
                      <td className="py-2.5 px-4 text-amber-400">Required</td>
                      <td className="py-2.5 px-4 font-sans">Candidate Full Name</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-emerald-400">field-1</td>
                      <td className="py-2.5 px-4 font-sans">upload resume</td>
                      <td className="py-2.5 px-4">file (binary)</td>
                      <td className="py-2.5 px-4 text-amber-400">Required</td>
                      <td className="py-2.5 px-4 font-sans">Resume Document (PDF/DOCX/TXT)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-emerald-400">field-2</td>
                      <td className="py-2.5 px-4 font-sans">email</td>
                      <td className="py-2.5 px-4">email</td>
                      <td className="py-2.5 px-4 text-amber-400">Required</td>
                      <td className="py-2.5 px-4 font-sans">Delivery Email</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Target URL string */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="text-xs text-neutral-400">Full Cloud URL:</span>
              <p className="text-xs font-mono text-neutral-300 break-all bg-neutral-900 p-2.5 rounded-lg border border-neutral-800/80">
                {n8nUrl}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
