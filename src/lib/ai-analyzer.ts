import type {
  AnalysisReport,
  JobMatchReport,
  CoverLetter,
  SkillsCategory,
  GrammarSuggestion,
  FormattingSuggestion,
} from "@/types/resume";

// Known skill dictionaries for high-precision extraction
const TECH_SKILLS_DB = [
  "React", "React 19", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express", "Python",
  "Java", "C++", "C#", "Go", "Rust", "HTML5", "CSS3", "Tailwind CSS", "Sass", "Bootstrap",
  "Redux", "Zustand", "TanStack Query", "GraphQL", "REST API", "RESTful", "MongoDB", "PostgreSQL",
  "MySQL", "Redis", "Supabase", "Firebase", "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes",
  "Vite", "Webpack", "Babel", "Jest", "Cypress", "Playwright", "Git", "GitHub", "CI/CD", "Linux",
  "Microservices", "System Architecture", "Web Vitals", "WCAG", "Accessibility"
];

const SOFT_SKILLS_DB = [
  "Leadership", "Project Management", "Technical Leadership", "Agile", "Scrum",
  "Communication", "Problem Solving", "Cross-functional Collaboration", "Mentorship",
  "Critical Thinking", "Adaptability", "Time Management", "Conflict Resolution"
];

const TOOLS_DB = [
  "Figma", "Jira", "Postman", "VS Code", "Datadog", "Sentry", "Mixpanel", "Google Analytics",
  "Slack", "Notion", "Linear", "Amplitude", "Lighthouse"
];

const ACTION_VERBS = [
  "Architected", "Engineered", "Developed", "Spearheaded", "Led", "Implemented", "Optimized",
  "Increased", "Reduced", "Accelerated", "Built", "Designed", "Created", "Launched", "Expanded",
  "Transformed", "Pioneered", "Orchestrated", "Generated"
];

const WEAK_VERBS = [
  "Worked on", "Assisted in", "Helped with", "Responsible for", "Handled", "Tried to", "Made"
];

/**
 * Main AI Analysis Engine for Resumes
 */
export async function analyzeResumeText(
  text: string,
  fileName: string = "Resume.pdf",
  targetRole?: string
): Promise<AnalysisReport> {
  // Simulate intelligent processing delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const pageCount = Math.max(1, Math.ceil(wordCount / 450));
  const lowerText = text.toLowerCase();

  // 1. Detect Skills
  const detectedTech = TECH_SKILLS_DB.filter((skill) =>
    new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i").test(text)
  );
  const detectedSoft = SOFT_SKILLS_DB.filter((skill) =>
    new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i").test(text)
  );
  const detectedTools = TOOLS_DB.filter((tool) =>
    new RegExp(`\\b${escapeRegExp(tool)}\\b`, "i").test(text)
  );

  const skillsDetected: SkillsCategory = {
    technical: detectedTech.length > 0 ? detectedTech : ["JavaScript", "HTML/CSS", "Git", "REST APIs"],
    soft: detectedSoft.length > 0 ? detectedSoft : ["Problem Solving", "Teamwork", "Agile"],
    tools: detectedTools.length > 0 ? detectedTools : ["Git", "VS Code"],
    languages: ["English"],
  };

  // 2. Missing Industry Keywords based on target role or general tech
  const potentialMissing = [
    "TypeScript", "CI/CD Pipelines", "Docker", "Unit Testing (Jest)",
    "System Architecture", "Performance Monitoring", "A/B Testing", "WCAG Accessibility"
  ];
  const missingKeywords = potentialMissing.filter(
    (kw) => !lowerText.includes(kw.toLowerCase())
  );

  // 3. Grammar & Phrasing Checks
  const grammarSuggestions: GrammarSuggestion[] = [];
  WEAK_VERBS.forEach((weak, idx) => {
    if (lowerText.includes(weak.toLowerCase())) {
      grammarSuggestions.push({
        id: `g-gen-${idx}`,
        original: `Used passive phrasing "${weak}"`,
        suggestion: `Replace with high-impact action verbs such as "Engineered", "Architected", or "Spearheaded".`,
        reason: "Active verbs with outcome metrics increase ATS readability and recruiter engagement.",
        type: "impact",
      });
    }
  });

  if (!/\d+%/i.test(text) && !/\$\d+/i.test(text) && !/\b\d+\s*users\b/i.test(text)) {
    grammarSuggestions.push({
      id: "g-metrics",
      original: "No numerical metrics found in work experience bullets.",
      suggestion: "Add quantified outcomes e.g. 'Increased speed by 35%', 'Reduced error rate by 20%', or 'Managed 50k+ users'.",
      reason: "Quantified results significantly boost resume performance score.",
      type: "impact",
    });
  }

  // 4. Formatting Checks
  const formattingSuggestions: FormattingSuggestion[] = [];
  if (wordCount < 300) {
    formattingSuggestions.push({
      id: "fmt-len-short",
      category: "Length",
      issue: "Resume content is under 300 words.",
      recommendation: "Expand bullet points under work experience to detail technical decisions and outcomes.",
      severity: "high",
    });
  } else if (wordCount > 900) {
    formattingSuggestions.push({
      id: "fmt-len-long",
      category: "Length",
      issue: "Resume exceeds optimal length (900+ words).",
      recommendation: "Trim older experience or redundant descriptions to fit concisely on 1-2 pages.",
      severity: "medium",
    });
  }

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com/i.test(text);

  if (!hasLinkedIn) {
    formattingSuggestions.push({
      id: "fmt-linkedin",
      category: "Structure",
      issue: "LinkedIn profile URL missing in header.",
      recommendation: "Include a customized LinkedIn profile link (e.g. linkedin.com/in/yourname) at the top of your resume.",
      severity: "medium",
    });
  }

  if (!hasEmail || !hasPhone) {
    formattingSuggestions.push({
      id: "fmt-contact",
      category: "ATS Alignment",
      issue: "Contact information may be incomplete or inside header graphics.",
      recommendation: "Ensure email and phone number are present as plain text in the main body header.",
      severity: "high",
    });
  }

  // 5. Strengths & Weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (skillsDetected.technical.length >= 6) {
    strengths.push(`Rich technical skill profile with ${skillsDetected.technical.length} detected technologies.`);
  } else {
    weaknesses.push("Limited technical skills listed in dedicated skills section.");
  }

  const actionVerbCount = ACTION_VERBS.filter((v) =>
    new RegExp(`\\b${v}\\b`, "i").test(text)
  ).length;

  if (actionVerbCount >= 3) {
    strengths.push("Strong usage of action-oriented lead verbs in bullet points.");
  } else {
    weaknesses.push("Bullet points could use stronger, outcome-focused action verbs.");
  }

  if (hasEmail && hasPhone && hasLinkedIn) {
    strengths.push("Header contains complete ATS-friendly contact links.");
  }

  if (missingKeywords.length > 3) {
    weaknesses.push(`Missing ${missingKeywords.length} key industry terms standard for ${targetRole || "technical roles"}.`);
  }

  // 6. Calculate ATS & Resume Scores
  let atsScore = 65;
  if (skillsDetected.technical.length >= 5) atsScore += 10;
  if (hasEmail && hasPhone) atsScore += 8;
  if (hasLinkedIn) atsScore += 5;
  if (actionVerbCount >= 3) atsScore += 7;
  if (wordCount >= 350 && wordCount <= 750) atsScore += 5;
  atsScore = Math.min(98, Math.max(45, atsScore));

  const resumeScore = Math.min(99, atsScore + (strengths.length > 2 ? 5 : 2));

  const summary = `Resume parsed successfully (${wordCount} words, ${pageCount} page${pageCount > 1 ? "s" : ""}). ATS compatibility score is ${atsScore}/100 with ${skillsDetected.technical.length} technical skills identified.`;

  return {
    id: `rep-${Date.now()}`,
    resumeId: `res-${Math.random().toString(36).substring(2, 9)}`,
    fileName,
    uploadedAt: new Date().toISOString(),
    atsScore,
    resumeScore,
    wordCount,
    pageCount,
    parsedText: text,
    skillsDetected,
    missingKeywords: missingKeywords.slice(0, 5),
    grammarSuggestions,
    formattingSuggestions,
    strengths: strengths.length > 0 ? strengths : ["Clean overall layout structure."],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Consider adding more metrics."],
    summary,
    targetedRole: targetRole || "Software Engineer",
  };
}

/**
 * Job Match Comparator Engine
 */
export async function compareResumeWithJob(
  resumeText: string,
  jobDescription: string,
  jobTitle: string = "Target Role",
  companyName: string = "Target Company"
): Promise<JobMatchReport> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const jdWords = jobDescription.toLowerCase();
  
  // Extract keywords present in JD
  const jdTechSkills = TECH_SKILLS_DB.filter((skill) =>
    new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i").test(jobDescription)
  );

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  jdTechSkills.forEach((skill) => {
    if (new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i").test(resumeText)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchRatio = jdTechSkills.length > 0 ? matchedSkills.length / jdTechSkills.length : 0.75;
  const matchPercentage = Math.min(98, Math.max(40, Math.round(matchRatio * 100)));

  const improvementSuggestions = [
    `Incorporate missing key technical terms: ${missingSkills.slice(0, 3).join(", ") || "Cloud Architecture"}.`,
    `Tailor your Professional Summary to explicitly highlight experience matching ${jobTitle} requirements at ${companyName}.`,
    `Add bullet points demonstrating direct results related to responsibilities mentioned in the job description.`,
  ];

  const tailoredSummary = `Results-driven technical professional with hands-on experience in ${matchedSkills.slice(0, 4).join(", ") || "modern software development"}. Adept at solving complex engineering problems and delivering high-impact solutions closely aligned with ${companyName}'s needs for a ${jobTitle}.`;

  return {
    id: `jm-${Date.now()}`,
    resumeId: "res-current",
    jobTitle,
    companyName,
    jobDescription,
    matchPercentage,
    matchingSkills: matchedSkills.length > 0 ? matchedSkills : ["JavaScript", "Problem Solving"],
    missingSkills: missingSkills.length > 0 ? missingSkills : ["System Design"],
    matchedKeywords: matchedSkills,
    missingKeywords: missingSkills,
    improvementSuggestions,
    tailoredSummary,
    createdAt: new Date().toISOString(),
  };
}

/**
 * AI Cover Letter Generator
 */
export async function generateCoverLetter(
  resumeText: string,
  jobTitle: string,
  companyName: string,
  jobDescription?: string,
  tone: "Professional" | "Enthusiastic" | "Executive" | "Creative" = "Professional"
): Promise<CoverLetter> {
  await new Promise((resolve) => setTimeout(resolve, 1100));

  // Extract name if available
  const nameMatch = resumeText.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/);
  const candidateName = nameMatch ? nameMatch[1] : "Alex Morgan";

  const content = `Dear Hiring Manager,

I am writing to express my eager interest in the ${jobTitle} position at ${companyName}. Having carefully reviewed your team's focus and job requirements, I am confident that my technical skills and track record of delivering high-quality software solutions make me an ideal candidate for this role.

Throughout my career, I have specialized in building robust, user-centered applications and driving technical improvements that directly impact business outcomes. My experience aligns closely with ${companyName}'s goals, particularly in scaling systems, writing maintainable code, and collaborating across engineering and product teams.

I am particularly excited about the prospect of joining ${companyName} because of your commitment to excellence and innovation in the industry. I would welcome the opportunity to discuss how my background and passion for technology can support your team's ongoing success.

Thank you for your time and consideration.

Sincerely,
${candidateName}`;

  return {
    id: `cl-${Date.now()}`,
    companyName,
    jobTitle,
    jobDescription,
    tone,
    content,
    createdAt: new Date().toISOString(),
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
