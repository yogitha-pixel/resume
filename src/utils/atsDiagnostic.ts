export interface DiagnosticResult {
  score: number;
  contactChecks: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    hasLocation: boolean;
  };
  sectionsFound: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
  };
  metricCount: number;
  actionVerbCount: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  wordCount: number;
  estimatedReadingTimeMinutes: number;
}

const ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'amplified', 'architected',
  'automated', 'built', 'championed', 'compiled', 'consolidated',
  'constructed', 'created', 'decreased', 'delivered', 'designed',
  'developed', 'directed', 'engineered', 'enhanced', 'established',
  'exceeded', 'executed', 'expanded', 'formulated', 'generated',
  'guided', 'implemented', 'improved', 'increased', 'initiated',
  'instituted', 'integrated', 'launched', 'led', 'leveraged',
  'maximized', 'mentored', 'migrated', 'modernized', 'negotiated',
  'orchestrated', 'overhauled', 'pioneered', 'produced', 'reduced',
  'resolved', 'restructured', 'revamped', 'scaled', 'slashed',
  'spearheaded', 'standardized', 'streamlined', 'strengthened', 'surpassed',
  'transformed', 'unified', 'upgraded', 'validated', 'yielded'
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  'Senior Full-Stack Engineer': [
    'TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker',
    'Kubernetes', 'AWS', 'GraphQL', 'REST API', 'CI/CD', 'Microservices',
    'Redis', 'State Management', 'System Design'
  ],
  'Machine Learning Engineer': [
    'Python', 'PyTorch', 'TensorFlow', 'LLMs', 'RAG', 'Transformers',
    'Fine-tuning', 'Vector Database', 'CUDA', 'AWS SageMaker', 'Kubernetes',
    'Docker', 'Model Evaluation', 'Inference Optimization', 'Ray'
  ],
  'Technical Product Manager': [
    'Product Roadmap', 'User Stories', 'KPIs', 'A/B Testing', 'Agile/Scrum',
    'SQL', 'Data Analytics', 'Cross-functional Leadership', 'API Integrations',
    'Go-to-market', 'Customer Discovery', 'Sprint Planning', 'Stakeholder Management'
  ],
  'Data Scientist': [
    'Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Statistics',
    'Data Visualization', 'Hypothesis Testing', 'Tableau', 'BigQuery',
    'Scikit-learn', 'Data Modeling', 'Feature Engineering'
  ],
  'DevOps & Cloud Engineer': [
    'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Linux',
    'Prometheus', 'Grafana', 'GitOps', 'Helm', 'Bash', 'Networking', 'Security'
  ],
  'Default': [
    'Leadership', 'Strategy', 'Project Management', 'Communication',
    'Problem Solving', 'Data Analysis', 'Cross-functional', 'Optimization',
    'Deliverables', 'Quality Assurance', 'Innovation', 'Collaboration'
  ]
};

export function analyzeResumeText(text: string, targetRole: string = 'Default'): DiagnosticResult {
  const clean = text.toLowerCase();
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Contact info verification
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com/i;
  const locationRegex = /\b(ca|ny|wa|tx|fl|remote|san francisco|seattle|new york|austin|chicago|london|berlin|toronto|boston)\b/i;

  const hasEmail = emailRegex.test(text);
  const hasPhone = phoneRegex.test(text);
  const hasLinkedIn = linkedinRegex.test(text);
  const hasLocation = locationRegex.test(text);

  // Section heading detection
  const hasSummary = /\b(summary|profile|about me|executive summary|objective)\b/i.test(text);
  const hasExperience = /\b(experience|employment|work history|professional background)\b/i.test(text);
  const hasEducation = /\b(education|academic|university|degree|bachelor|master|phd)\b/i.test(text);
  const hasSkills = /\b(skills|competencies|technologies|tools|proficiencies)\b/i.test(text);
  const hasProjects = /\b(projects|case studies|portfolio|open source)\b/i.test(text);

  // Metric detection (quantified impact)
  const metricRegex = /(\b\d+(\.\d+)?%|\$\d+([kmb])?|\b\d+[kmb]\+?|\b\d+x\b|\b\d{2,}\+?\s*(users|clients|customers|ms|seconds|hours|teams))/gi;
  const metricsFound = text.match(metricRegex) || [];
  const metricCount = metricsFound.length;

  // Action verb detection
  let actionVerbCount = 0;
  for (const verb of ACTION_VERBS) {
    const verbRegex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = text.match(verbRegex);
    if (matches) {
      actionVerbCount += matches.length;
    }
  }

  // Keyword Matching for Target Role
  const keywordsToCheck = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['Default'];
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of keywordsToCheck) {
    const kwRegex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (kwRegex.test(text)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  // Score Calculation (Base 100)
  let score = 40; // baseline

  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (hasLinkedIn) score += 4;
  if (hasLocation) score += 3;

  if (hasSummary) score += 5;
  if (hasExperience) score += 10;
  if (hasEducation) score += 6;
  if (hasSkills) score += 7;

  // Metrics impact points (up to 15 points)
  score += Math.min(metricCount * 3, 15);

  // Keyword density (up to 15 points)
  if (keywordsToCheck.length > 0) {
    const kwRatio = matchedKeywords.length / keywordsToCheck.length;
    score += Math.round(kwRatio * 15);
  }

  // Word count balance (ideal: 400 - 1000 words)
  if (wordCount >= 400 && wordCount <= 900) {
    score += 5;
  } else if (wordCount > 1500) {
    score -= 8; // Too long for standard 1-2 page scan
  } else if (wordCount < 200) {
    score -= 15; // Too sparse
  }

  // Clamp 10-98
  score = Math.max(15, Math.min(score, 98));

  // Actionable recommendations
  const recommendations: string[] = [];
  if (!hasEmail) recommendations.push('Add a clear, professional email address at the top header.');
  if (!hasPhone) recommendations.push('Include a contact telephone number for recruiter outreach.');
  if (!hasLinkedIn) recommendations.push('Add an active LinkedIn profile URL to boost ATS profile verification.');
  if (!hasSummary) recommendations.push('Add a concise 2-3 line Professional Summary targeting your focus role.');
  if (metricCount < 3) {
    recommendations.push('Strengthen bullet points with quantifiable metrics (e.g., "% saved", "$ ARR", or "latency reduction").');
  }
  if (actionVerbCount < 5) {
    recommendations.push('Lead your achievements with strong past-tense action verbs (e.g., "Architected", "Accelerated", "Spearheaded").');
  }
  if (missingKeywords.length > 0) {
    recommendations.push(`Incorporate key industry terms relevant to ${targetRole}: ${missingKeywords.slice(0, 4).join(', ')}.`);
  }
  if (wordCount > 1200) {
    recommendations.push('Consider trimming content to 1-2 pages (around 450-850 words) to optimize ATS parser readability.');
  }

  return {
    score,
    contactChecks: {
      hasEmail,
      hasPhone,
      hasLinkedIn,
      hasLocation,
    },
    sectionsFound: {
      summary: hasSummary,
      experience: hasExperience,
      education: hasEducation,
      skills: hasSkills,
      projects: hasProjects,
    },
    metricCount,
    actionVerbCount,
    matchedKeywords,
    missingKeywords,
    recommendations,
    wordCount,
    estimatedReadingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
  };
}
