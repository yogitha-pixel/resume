export interface SampleResume {
  id: string;
  title: string;
  candidateName: string;
  email: string;
  targetRole: string;
  experienceLevel: string;
  summary: string;
  content: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'fullstack-engineer',
    title: 'Senior Full-Stack Engineer (React, Node, Cloud)',
    candidateName: 'Alex Morgan',
    email: 'alex.morgan.dev@example.com',
    targetRole: 'Senior Full-Stack Engineer',
    experienceLevel: 'Senior (5-8 yrs)',
    summary: 'Full-stack specialist with 6+ years designing scalable distributed systems and responsive web applications.',
    content: `ALEX MORGAN
Email: alex.morgan.dev@example.com | Phone: (415) 555-0192 | San Francisco, CA
LinkedIn: linkedin.com/in/alexmorgan-dev | GitHub: github.com/alexmorgan-dev

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 6+ years of experience engineering high-throughput distributed microservices and responsive web platforms. Spearheaded migration of legacy monolith to Node.js/TypeScript microservices, reducing p99 latency by 42%. Proven mastery of React, TypeScript, Next.js, Node.js, PostgreSQL, Docker, and AWS.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, Go (Intermediate)
- Frontend: React 18/19, Next.js, Tailwind CSS, Redux Toolkit, WebSockets, HTML5/CSS3
- Backend & Cloud: Node.js, Express, Fastify, PostgreSQL, Redis, Docker, Kubernetes, AWS (S3, ECS, Lambda)
- Tools & Practices: CI/CD (GitHub Actions), Jest, Playwright, Git, RESTful APIs, GraphQL, Microservices Architecture

PROFESSIONAL EXPERIENCE

Senior Software Engineer | CloudVenture Technologies | 2022 - Present
- Architected and deployed real-time collaboration canvas serving 140,000+ monthly active users, achieving 99.98% uptime.
- Optimized PostgreSQL database indexing and query execution plans, reducing p99 API response times from 340ms to 48ms.
- Mentored a cohort of 5 junior and mid-level software engineers through structured pair programming and code reviews.
- Designed automated CI/CD deployment pipelines using GitHub Actions and Docker, accelerating release frequency by 3x.

Software Engineer | FinEdge Platforms | 2019 - 2022
- Developed high-volume payment processing workflows handling $12M+ monthly transaction volume with zero loss events.
- Migrated legacy frontend state management to React Query and Zustand, reducing client bundle size by 38%.
- Integrated multi-tenant RBAC authentication service with JWT and session invalidation handling 50,000 concurrent tokens.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2015 - 2019
GPA: 3.82 / 4.00, Dean's Honors List
`,
  },
  {
    id: 'ai-ml-engineer',
    title: 'Machine Learning & AI Systems Engineer',
    candidateName: 'Dr. Priya Sharma',
    email: 'priya.sharma.ai@example.com',
    targetRole: 'Machine Learning Engineer',
    experienceLevel: 'Staff / Lead (8+ yrs)',
    summary: 'ML specialist with expertise in LLM fine-tuning, RAG pipelines, PyTorch, and low-latency inference serving.',
    content: `DR. PRIYA SHARMA
Email: priya.sharma.ai@example.com | Phone: (650) 555-4812 | Seattle, WA
LinkedIn: linkedin.com/in/priyasharma-ai | Google Scholar: scholar.google.com/citations?user=psharma

PROFESSIONAL SUMMARY
Principal Machine Learning Engineer with 8+ years developing generative AI architectures, large language model fine-tuning pipelines, and production retrieval-augmented generation (RAG) systems. Published 4 peer-reviewed conference papers (NeurIPS, ICML).

TECHNICAL SKILLS
- Machine Learning: PyTorch, TensorFlow, Hugging Face Transformers, vLLM, TensorRT-LLM, LangChain, LlamaIndex
- Data & Infra: Python, CUDA, Triton Inference Server, Ray, Spark, Milvus, Pinecone, Docker, Kubernetes, AWS SageMaker
- Methodologies: LoRA/QLoRA Fine-tuning, RLHF, Vector Search, Knowledge Distillation, Quantization (INT4/INT8)

PROFESSIONAL EXPERIENCE

Lead AI Engineer | CognitionLabs | 2021 - Present
- Directed production rollout of custom 7B/13B parameter fine-tuned domain models, achieving 28% higher factual accuracy over base LLMs.
- Built hybrid vector-lexical search retrieval pipeline serving 1.2M queries daily with sub-120ms median latency.
- Cut GPU compute inference costs by 54% through dynamic batching and INT8 quantization using TensorRT-LLM.

Senior Data Scientist | AlphaMetrics Inc. | 2017 - 2021
- Developed automated anomaly detection algorithms for high-frequency time series data, capturing 96.4% of failure precursors.
- Authored production ML training pipelines processing 4TB daily streaming records on Apache Spark and PyTorch.

EDUCATION
Ph.D. in Computer Science (Machine Learning) | University of Washington | 2013 - 2017
M.S. in Electrical Engineering | Stanford University | 2011 - 2013
`,
  },
  {
    id: 'product-manager',
    title: 'Senior Technical Product Manager (SaaS & Enterprise)',
    candidateName: 'Marcus Vance',
    email: 'marcus.vance.pm@example.com',
    targetRole: 'Technical Product Manager',
    experienceLevel: 'Senior (5-8 yrs)',
    summary: 'Product leader focused on developer platforms, API integrations, workflow automations, and ARR growth.',
    content: `MARCUS VANCE
Email: marcus.vance.pm@example.com | Phone: (206) 555-8931 | New York, NY
LinkedIn: linkedin.com/in/marcusvance-pm

PROFESSIONAL SUMMARY
Data-driven Senior Technical Product Manager with 7+ years guiding product lifecycles from discovery to scale. Proven track record driving $8.2M ARR expansion across developer APIs and workflow automation products. Expert in user telemetry, agile execution, and cross-functional leadership.

CORE COMPETENCIES
- Product Strategy: Product Roadmap, Market Sizing, Customer Journey Mapping, Go-To-Market (GTM), Pricing & Packaging
- Analytics & Tools: SQL, Amplitude, Mixpanel, Jira, Linear, Figma, Tableau, Postman, A/B Testing Frameworks
- Technical Acumen: RESTful APIs, Webhooks, n8n/Zapier integrations, Data Schemas, Cloud Microservices

PROFESSIONAL EXPERIENCE

Senior Technical Product Manager | AutomateFlow | 2022 - Present
- Led product strategy for workflow automation engine, expanding self-serve conversion rate from 3.2% to 6.8% in 9 months.
- Partnered with 18 enterprise customers to design webhook triggers and custom payload transformers, unlocking $3.4M in annual expansion contract value.
- Championed overhaul of developer documentation and interactive API playground, slashing time-to-first-webhook from 45m to 8m.

Product Manager | DataStream Analytics | 2018 - 2022
- Managed real-time dashboard product line, growing daily active users (DAU) by 135% through iterative usability testing and feature velocity.
- Orchestrated 34 bi-weekly sprint cycles with zero slipped tier-1 commitments across cross-functional squad of 11 engineers.

EDUCATION
Bachelor of Science in Industrial Engineering & Economics | Columbia University | 2014 - 2018
`,
  },
];
