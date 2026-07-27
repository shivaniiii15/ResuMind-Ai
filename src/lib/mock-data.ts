import type {
  AnalysisReport,
  JobMatchReport,
  CoverLetter,
  ResumeBuilderData,
  UserProfile,
  AdminUser,
  AdminAnalytics,
} from "@/types/resume";

export const SAMPLE_RESUMES: AnalysisReport[] = [
  {
    id: "rep-101",
    resumeId: "res-001",
    fileName: "Alex_Morgan_Senior_Frontend_Engineer.pdf",
    uploadedAt: "2026-07-20T14:32:00Z",
    atsScore: 88,
    resumeScore: 92,
    wordCount: 485,
    pageCount: 1,
    targetedRole: "Senior Frontend Engineer",
    parsedText: `Alex Morgan
San Francisco, CA | alex.morgan@email.com | (555) 019-2834 | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Senior Frontend Engineer with 6+ years of experience architecting high-performance React applications, optimizing web core vitals by 40%, and building scalable design systems using TypeScript and Tailwind CSS. Proven track record of leading teams of 5+ developers and implementing robust CI/CD pipelines.

TECHNICAL SKILLS
- Frontend: React 19, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Redux Toolkit, TanStack Query
- Testing & Tools: Jest, Cypress, Vite, Webpack, Git, Docker, Figma, Web Vitals, REST APIs, GraphQL
- Soft Skills: Technical Leadership, Cross-functional Collaboration, Agile/Scrum, Architecture Design

WORK EXPERIENCE
Senior Frontend Developer | TechPulse Solutions | San Francisco, CA | 2023 - Present
- Architected enterprise SaaS dashboard serving 250k+ active users, reducing initial load time by 45% through dynamic code splitting and image optimization.
- Spearheaded migration from legacy monolith to React + Vite SPA with TanStack Router, boosting developer velocity by 30%.
- Led cross-functional team of 6 engineers to build scalable UI component library adopted across 4 major product lines.

Frontend Engineer | CloudScale Inc | San Jose, CA | 2020 - 2023
- Built responsive analytics dashboard using React, TypeScript, and Recharts, processing over 1M events daily.
- Implemented client-side caching strategies using React Query, reducing API server load by 35%.
- Collaborated with UX designers to ensure WCAG 2.1 AA accessibility compliance across all user-facing interfaces.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2016 - 2020
`,
    skillsDetected: {
      technical: [
        "React",
        "TypeScript",
        "Next.js",
        "JavaScript",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
        "TanStack Query",
        "GraphQL",
        "REST APIs",
      ],
      soft: ["Technical Leadership", "Agile/Scrum", "Cross-functional Collaboration", "Architecture Design"],
      tools: ["Vite", "Docker", "Git", "Cypress", "Jest", "Figma", "Webpack"],
      languages: ["English (Native)", "Spanish (Conversational)"],
    },
    missingKeywords: [
      "Micro-frontends",
      "Server-Side Rendering (SSR)",
      "System Architecture Diagramming",
      "Performance Monitoring (Sentry/Datadog)",
      "A/B Testing",
    ],
    grammarSuggestions: [
      {
        id: "g-1",
        original: "Results-driven Senior Frontend Engineer with 6+ years of experience architecting high-performance React applications",
        suggestion: "Results-driven Senior Frontend Engineer with 6+ years of experience architecting high-performance React web applications",
        reason: "Adding 'web' provides clearer domain context for ATS keyword parsers.",
        type: "conciseness",
      },
      {
        id: "g-2",
        original: "boosting developer velocity by 30%",
        suggestion: "increasing developer output and release velocity by 30%",
        reason: "Action-oriented phrasing strengthens impact metrics for executive screeners.",
        type: "impact",
      },
    ],
    formattingSuggestions: [
      {
        id: "f-1",
        category: "ATS Alignment",
        issue: "Hyperlink format in GitHub link",
        recommendation: "Ensure full plain text URLs are included alongside hyperlinked text for legacy parser compatibility.",
        severity: "low",
      },
      {
        id: "f-2",
        category: "Structure",
        issue: "Bullet point count in second position",
        recommendation: "Add 1 more quantified metric bullet to your CloudScale Inc experience entry.",
        severity: "medium",
      },
    ],
    strengths: [
      "Strong quantifiable metrics in bullet points (45% load time reduction, 30% velocity boost, 250k+ users).",
      "Clear, modern tech stack alignment with current frontend engineering standards.",
      "Clean section hierarchy and standard ATS-friendly section headers.",
      "Well-structured contact information header.",
    ],
    weaknesses: [
      "Lacks mention of system monitoring tools (Sentry, Datadog) or telemetry.",
      "Could benefit from highlighting unit/integration test coverage percentages.",
      "Missing explicit mention of State Management patterns like Zustand or Redux.",
    ],
    summary:
      "Excellent technical resume with high ATS compatibility (88/100). Highlights impressive quantifiable achievements, leadership skills, and modern React ecosystem mastery.",
  },
  {
    id: "rep-102",
    resumeId: "res-002",
    fileName: "Alex_Morgan_FullStack_Developer.docx",
    uploadedAt: "2026-07-18T09:15:00Z",
    atsScore: 76,
    resumeScore: 81,
    wordCount: 420,
    pageCount: 1,
    targetedRole: "Full Stack Engineer",
    parsedText: `Alex Morgan - Full Stack Developer
Email: alex.morgan@email.com | Phone: 555-019-2834

Summary: Full Stack developer with experience in Node.js, Express, React, and MongoDB.

Skills: JavaScript, Node.js, Express, React, MongoDB, SQL, Git, HTML, CSS

Experience:
Full Stack Developer | TechPulse | 2023-Present
- Worked on backend Node.js microservices.
- Developed React UI components.
- Database optimization in MongoDB.

Junior Developer | CloudScale | 2021-2023
- Assisted in API creation.
- Bug fixing and support.
`,
    skillsDetected: {
      technical: ["Node.js", "Express", "React", "MongoDB", "SQL", "JavaScript", "HTML", "CSS"],
      soft: ["Teamwork", "Problem Solving"],
      tools: ["Git", "VS Code"],
      languages: ["English"],
    },
    missingKeywords: [
      "TypeScript",
      "RESTful API Design",
      "PostgreSQL / Prisma",
      "Docker / Kubernetes",
      "Unit Testing (Jest)",
      "CI/CD Pipelines",
      "Quantifiable Achievements",
    ],
    grammarSuggestions: [
      {
        id: "g-10",
        original: "Worked on backend Node.js microservices.",
        suggestion: "Engineered and deployed scalable Node.js microservices handling 50k+ daily API requests.",
        reason: "Replace weak verb 'Worked on' with strong action verb 'Engineered' and add metrics.",
        type: "impact",
      },
      {
        id: "g-11",
        original: "Assisted in API creation.",
        suggestion: "Collaborated in designing and documenting 15+ RESTful endpoints using Express.js and OpenAPI.",
        reason: "Quantify responsibilities and specify technology stack details.",
        type: "impact",
      },
    ],
    formattingSuggestions: [
      {
        id: "f-10",
        category: "Length",
        issue: "Resume is too brief",
        recommendation: "Expand experience bullet points from 2-3 to 4-5 detailed achievement bullets per position.",
        severity: "high",
      },
      {
        id: "f-11",
        category: "Layout",
        issue: "Missing LinkedIn and Location in Header",
        recommendation: "Include City, State and a vanity LinkedIn profile link in the header block.",
        severity: "medium",
      },
    ],
    strengths: [
      "Clear presentation of MERN stack core competencies.",
      "Concise single-page format.",
      "Clean section division.",
    ],
    weaknesses: [
      "Bullet points lack numerical achievements or business outcome metrics.",
      "Missing TypeScript, Docker, and modern CI/CD tools expected in Senior/Mid roles.",
      "Summary is overly simple and lacks a value proposition statement.",
    ],
    summary:
      "Solid entry-to-mid full stack resume (76/100 ATS score). Requires addition of impact metrics, TypeScript/DevOps keywords, and stronger action verbs to pass competitive ATS screening.",
  },
];

export const SAMPLE_JOB_MATCHES: JobMatchReport[] = [
  {
    id: "jm-201",
    resumeId: "res-001",
    jobTitle: "Senior React Developer",
    companyName: "Stripe",
    jobDescription: `Stripe is looking for a Senior React Developer to join our Dashboard Core Infrastructure team.
Requirements:
- 5+ years of experience with React, TypeScript, and modern state management.
- Expertise in performance optimization, Web Vitals, and accessibility (WCAG).
- Experience with GraphQL, TanStack Query, and automated testing (Jest, Cypress).
- Track record of building and maintaining scalable Design Systems.
- Experience with CI/CD and Micro-frontends is a huge plus.`,
    matchPercentage: 86,
    matchingSkills: ["React", "TypeScript", "Tailwind CSS", "TanStack Query", "GraphQL", "Jest", "Cypress", "Web Vitals", "Vite"],
    missingSkills: ["Micro-frontends", "Design System Documentation", "Stripe API Integration"],
    matchedKeywords: ["React 19", "TypeScript", "Tailwind CSS", "WCAG 2.1 AA", "Vite", "Cypress", "Jest"],
    missingKeywords: ["Micro-frontends", "Stripe Elements", "Telemetry"],
    improvementSuggestions: [
      "Highlight micro-frontend component architecture or module federation experience if applicable.",
      "Add explicit mention of WCAG compliance testing tools like Axe-core or Lighthouse audit scores.",
      "Tailor summary to mention experience with fintech/payment workflow security requirements.",
    ],
    tailoredSummary:
      "Senior Frontend Engineer with 6+ years of specialized experience building high-speed React & TypeScript dashboards. Expert in web performance tuning, design systems, and automated testing with a proven track record of reducing load times by 45%. Highly aligned with Stripe's Dashboard Infrastructure focus.",
    createdAt: "2026-07-21T10:00:00Z",
  },
];

export const SAMPLE_COVER_LETTERS: CoverLetter[] = [
  {
    id: "cl-301",
    companyName: "Stripe",
    jobTitle: "Senior React Developer",
    tone: "Professional",
    content: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior React Developer position at Stripe. With over six years of hands-on experience building mission-critical React applications, engineering scalable design systems, and optimizing core web vitals, I am eager to contribute to Stripe's Dashboard Infrastructure team.

At TechPulse Solutions, I led the architecture of an enterprise SaaS platform serving 250,000+ active users. By implementing modern React patterns, code-splitting strategies, and TanStack Query client-side caching, my team reduced load times by 45% and decreased backend server load by 35%. Additionally, I spearheaded our component library migration, which significantly improved developer velocity across four product divisions.

Stripe's commitment to developer productivity and world-class financial infrastructure deeply resonates with my passion for high-performance frontend architecture. I bring deep technical fluency in React 19, TypeScript, and automated testing (Jest, Cypress), combined with a commitment to accessibility standards (WCAG 2.1 AA).

Thank you for your time and consideration. I welcome the opportunity to discuss how my technical expertise and passion for frontend engineering align with Stripe's vision.

Sincerely,
Alex Morgan`,
    createdAt: "2026-07-21T11:20:00Z",
  },
];

export const INITIAL_BUILDER_DATA: ResumeBuilderData = {
  id: "bld-001",
  title: "Alex Morgan - Master Engineering Resume",
  updatedAt: "2026-07-21T12:00:00Z",
  personalInfo: {
    fullName: "Alex Morgan",
    headline: "Senior Frontend & Full Stack Engineer",
    email: "alex.morgan@email.com",
    phone: "(555) 019-2834",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/alexmorgan",
    github: "https://github.com/alexmorgan",
    portfolio: "https://alexmorgan.dev",
  },
  summary:
    "Results-driven Senior Frontend Engineer with 6+ years of experience architecting high-performance React applications, optimizing web core vitals by 40%, and building scalable design systems using TypeScript and Tailwind CSS.",
  experience: [
    {
      id: "exp-1",
      company: "TechPulse Solutions",
      role: "Senior Frontend Developer",
      location: "San Francisco, CA",
      startDate: "2023-01",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected enterprise SaaS dashboard serving 250k+ active users, reducing initial page load time by 45%.",
        "Spearheaded migration from legacy monolith to React 19 + Vite SPA with TanStack Router, boosting team velocity by 30%.",
        "Led cross-functional team of 6 engineers to build scalable UI component library adopted across 4 major product lines.",
      ],
    },
    {
      id: "exp-2",
      company: "CloudScale Inc",
      role: "Frontend Engineer",
      location: "San Jose, CA",
      startDate: "2020-06",
      endDate: "2022-12",
      current: false,
      bullets: [
        "Built responsive analytics dashboard using React, TypeScript, and Recharts, processing over 1M events daily.",
        "Implemented client-side caching strategies using React Query, reducing API server load by 35%.",
        "Collaborated with UX designers to ensure WCAG 2.1 AA accessibility compliance across all user-facing interfaces.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.85 / 4.0",
    },
  ],
  skills: [
    {
      category: "Frontend Core",
      items: ["React 19", "TypeScript", "Next.js", "JavaScript (ES6+)", "Tailwind CSS", "HTML5/CSS3"],
    },
    {
      category: "State & Data",
      items: ["TanStack Query", "Redux Toolkit", "GraphQL", "REST APIs", "Zustand"],
    },
    {
      category: "Testing & DevOps",
      items: ["Jest", "Cypress", "Vite", "Docker", "Git", "Webpack", "CI/CD"],
    },
  ],
  projects: [
    {
      id: "prj-1",
      title: "ResuMind AI Platform",
      description: "AI-powered resume evaluation engine and ATS optimization toolkit built with React, Vite, and AI NLP models.",
      techStack: ["React 19", "TypeScript", "Tailwind CSS", "Gemini API"],
      link: "https://github.com/alexmorgan/resumind-ai",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2024",
    },
  ],
};

export const SAMPLE_USER_PROFILE: UserProfile = {
  id: "usr-001",
  name: "Alex Morgan",
  email: "alex.morgan@email.com",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  targetRole: "Senior Frontend Engineer",
  targetIndustry: "Software & Technology",
  createdAt: "2026-01-15T00:00:00Z",
};

export const SAMPLE_ADMIN_USERS: AdminUser[] = [
  { id: "u-1", name: "Alex Morgan", email: "alex.morgan@email.com", role: "admin", status: "active", resumesCount: 14, avgScore: 85, lastActive: "Just now", joinedAt: "2026-01-15" },
  { id: "u-2", name: "Sarah Jenkins", email: "sarah.j@techcorp.com", role: "user", status: "active", resumesCount: 6, avgScore: 91, lastActive: "2 hours ago", joinedAt: "2026-02-01" },
  { id: "u-3", name: "David Chen", email: "dchen@innovate.io", role: "user", status: "active", resumesCount: 3, avgScore: 78, lastActive: "1 day ago", joinedAt: "2026-03-10" },
  { id: "u-4", name: "Emily Watson", email: "emily.w@designlabs.co", role: "user", status: "active", resumesCount: 9, avgScore: 87, lastActive: "3 days ago", joinedAt: "2026-03-22" },
  { id: "u-5", name: "Marcus Brody", email: "mbrody@financehub.com", role: "user", status: "suspended", resumesCount: 1, avgScore: 62, lastActive: "15 days ago", joinedAt: "2026-04-05" },
];

export const SAMPLE_ADMIN_ANALYTICS: AdminAnalytics = {
  totalUsers: 1428,
  totalResumesParsed: 6842,
  averageATSScore: 82.4,
  activeUsersToday: 312,
  missingSkillsRank: [
    { skill: "TypeScript", count: 1840 },
    { skill: "Docker / Kubernetes", count: 1620 },
    { skill: "Unit Testing (Jest/Playwright)", count: 1450 },
    { skill: "GraphQL", count: 1210 },
    { skill: "CI/CD Deployment", count: 980 },
    { skill: "System Architecture", count: 870 },
  ],
  dailyAnalyses: [
    { date: "Mon", count: 180, avgScore: 81 },
    { date: "Tue", count: 240, avgScore: 83 },
    { date: "Wed", count: 290, avgScore: 80 },
    { date: "Thu", count: 320, avgScore: 84 },
    { date: "Fri", count: 410, avgScore: 82 },
    { date: "Sat", count: 210, avgScore: 85 },
    { date: "Sun", count: 260, avgScore: 83 },
  ],
};

// Storage helper helpers
const STORAGE_KEYS = {
  REPORTS: "resumind_reports",
  JOB_MATCHES: "resumind_job_matches",
  COVER_LETTERS: "resumind_cover_letters",
  BUILDER: "resumind_builder_data",
  PROFILE: "resumind_profile",
};

export function getSavedReports(): AnalysisReport[] {
  if (typeof window === "undefined") return SAMPLE_RESUMES;
  const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SAMPLE_RESUMES));
    return SAMPLE_RESUMES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SAMPLE_RESUMES;
  }
}

export function saveReport(report: AnalysisReport): AnalysisReport[] {
  const current = getSavedReports();
  const filtered = current.filter((r) => r.id !== report.id);
  const updated = [report, ...filtered];
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  return updated;
}

export function deleteReport(id: string): AnalysisReport[] {
  const current = getSavedReports();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  return updated;
}

export function getSavedJobMatches(): JobMatchReport[] {
  if (typeof window === "undefined") return SAMPLE_JOB_MATCHES;
  const stored = localStorage.getItem(STORAGE_KEYS.JOB_MATCHES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.JOB_MATCHES, JSON.stringify(SAMPLE_JOB_MATCHES));
    return SAMPLE_JOB_MATCHES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SAMPLE_JOB_MATCHES;
  }
}

export function saveJobMatch(match: JobMatchReport): JobMatchReport[] {
  const current = getSavedJobMatches();
  const updated = [match, ...current.filter((m) => m.id !== match.id)];
  localStorage.setItem(STORAGE_KEYS.JOB_MATCHES, JSON.stringify(updated));
  return updated;
}

export function getSavedCoverLetters(): CoverLetter[] {
  if (typeof window === "undefined") return SAMPLE_COVER_LETTERS;
  const stored = localStorage.getItem(STORAGE_KEYS.COVER_LETTERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.COVER_LETTERS, JSON.stringify(SAMPLE_COVER_LETTERS));
    return SAMPLE_COVER_LETTERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SAMPLE_COVER_LETTERS;
  }
}

export function saveCoverLetter(cl: CoverLetter): CoverLetter[] {
  const current = getSavedCoverLetters();
  const updated = [cl, ...current.filter((item) => item.id !== cl.id)];
  localStorage.setItem(STORAGE_KEYS.COVER_LETTERS, JSON.stringify(updated));
  return updated;
}

export function getBuilderData(): ResumeBuilderData {
  if (typeof window === "undefined") return INITIAL_BUILDER_DATA;
  const stored = localStorage.getItem(STORAGE_KEYS.BUILDER);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.BUILDER, JSON.stringify(INITIAL_BUILDER_DATA));
    return INITIAL_BUILDER_DATA;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_BUILDER_DATA;
  }
}

export function saveBuilderData(data: ResumeBuilderData): void {
  localStorage.setItem(STORAGE_KEYS.BUILDER, JSON.stringify(data));
}
