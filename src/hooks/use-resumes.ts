import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import type {
  AnalysisReport,
  JobMatchReport,
  CoverLetter,
  ResumeBuilderData,
} from "@/types/resume";
import {
  getSavedReports,
  saveReport as saveLocalReport,
  deleteReport as deleteLocalReport,
  getSavedJobMatches,
  saveJobMatch as saveLocalJobMatch,
  getSavedCoverLetters,
  saveCoverLetter as saveLocalCoverLetter,
  getBuilderData,
  saveBuilderData as saveLocalBuilderData,
} from "@/lib/mock-data";

/* -------------------------------------------------------------------------- */
/*                            1. Analysis Reports                            */
/* -------------------------------------------------------------------------- */

export function useAnalysisReports() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["analysis_reports", user?.id],
    queryFn: async (): Promise<AnalysisReport[]> => {
      if (!user) return getSavedReports();

      const { data, error } = await supabase
        .from("analysis_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return getSavedReports();
      }

      return data.map((row) => ({
        id: row.id,
        resumeId: row.id,
        fileName: row.file_name,
        uploadedAt: row.created_at,
        atsScore: row.ats_score,
        resumeScore: row.resume_score,
        targetedRole: row.targeted_role || "Software Developer",
        wordCount: row.word_count,
        pageCount: row.page_count,
        skillsDetected: (row.skills_detected as any) || {
          technical: [],
          soft: [],
          tools: [],
          languages: [],
        },
        missingKeywords: (row.missing_keywords as string[]) || [],
        grammarSuggestions: (row.grammar_suggestions as any[]) || [],
        formattingSuggestions: (row.formatting_suggestions as any[]) || [],
        strengths: (row.strengths as string[]) || [],
        weaknesses: (row.weaknesses as string[]) || [],
        summary: row.summary || "",
        parsedText: row.parsed_text || "",
      }));
    },
  });
}

export function useSaveReport() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (report: AnalysisReport) => {
      // Always save to local fallback for smooth UX
      saveLocalReport(report);

      if (!user) return;

      const { error } = await supabase.from("analysis_reports").insert({
        user_id: user.id,
        file_name: report.fileName,
        ats_score: report.atsScore,
        resume_score: report.resumeScore,
        targeted_role: report.targetedRole,
        word_count: report.wordCount,
        page_count: report.pageCount,
        skills_detected: report.skillsDetected as any,
        missing_keywords: report.missingKeywords as any,
        grammar_suggestions: report.grammarSuggestions as any,
        formatting_suggestions: report.formattingSuggestions as any,
        strengths: report.strengths as any,
        weaknesses: report.weaknesses as any,
        summary: report.summary,
        parsed_text: report.parsedText,
      });

      if (error) {
        console.warn("[Supabase] Failed to persist report, saved locally:", error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["analysis_reports"] });
    },
  });
}

export function useDeleteReport() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      deleteLocalReport(id);

      if (!user) return;

      const { error } = await supabase
        .from("analysis_reports")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.warn("[Supabase] Failed to delete report from DB:", error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["analysis_reports"] });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                              2. Job Matches                                */
/* -------------------------------------------------------------------------- */

export function useJobMatches() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["job_matches", user?.id],
    queryFn: async (): Promise<JobMatchReport[]> => {
      if (!user) return getSavedJobMatches();

      const { data, error } = await supabase
        .from("job_matches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return getSavedJobMatches();
      }

      return data.map((row) => ({
        id: row.id,
        resumeId: "res-current",
        jobTitle: row.job_title,
        companyName: row.company_name,
        jobDescription: row.job_description,
        matchPercentage: row.match_percentage,
        matchingSkills: (row.matching_skills as string[]) || [],
        missingSkills: (row.missing_skills as string[]) || [],
        matchedKeywords: (row.matched_keywords as string[]) || [],
        missingKeywords: (row.missing_keywords as string[]) || [],
        improvementSuggestions: (row.improvement_suggestions as string[]) || [],
        tailoredSummary: row.tailored_summary || "",
        createdAt: row.created_at,
      }));
    },
  });
}

export function useSaveJobMatch() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (match: JobMatchReport) => {
      saveLocalJobMatch(match);

      if (!user) return;

      const { error } = await supabase.from("job_matches").insert({
        user_id: user.id,
        job_title: match.jobTitle,
        company_name: match.companyName,
        job_description: match.jobDescription,
        match_percentage: match.matchPercentage,
        matching_skills: match.matchingSkills as any,
        missing_skills: match.missingSkills as any,
        matched_keywords: match.matchedKeywords as any,
        missing_keywords: match.missingKeywords as any,
        improvement_suggestions: match.improvementSuggestions as any,
        tailored_summary: match.tailoredSummary,
      });

      if (error) {
        console.warn("[Supabase] Failed to persist job match, saved locally:", error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job_matches"] });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                              3. Cover Letters                              */
/* -------------------------------------------------------------------------- */

export function useCoverLetters() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["cover_letters", user?.id],
    queryFn: async (): Promise<CoverLetter[]> => {
      if (!user) return getSavedCoverLetters();

      const { data, error } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return getSavedCoverLetters();
      }

      return data.map((row) => ({
        id: row.id,
        companyName: row.company_name,
        jobTitle: row.job_title,
        jobDescription: row.job_description || undefined,
        tone: (row.tone as any) || "Professional",
        content: row.content,
        createdAt: row.created_at,
      }));
    },
  });
}

export function useSaveCoverLetter() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (cl: CoverLetter) => {
      saveLocalCoverLetter(cl);

      if (!user) return;

      const { error } = await supabase.from("cover_letters").insert({
        user_id: user.id,
        company_name: cl.companyName,
        job_title: cl.jobTitle,
        job_description: cl.jobDescription,
        tone: cl.tone,
        content: cl.content,
      });

      if (error) {
        console.warn("[Supabase] Failed to persist cover letter, saved locally:", error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cover_letters"] });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                            4. Resume Builder Data                          */
/* -------------------------------------------------------------------------- */

export function useBuilderData() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["builder_data", user?.id],
    queryFn: async (): Promise<ResumeBuilderData> => {
      if (!user) return getBuilderData();

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data || !data.data) {
        return getBuilderData();
      }

      return data.data as unknown as ResumeBuilderData;
    },
  });
}

export function useSaveBuilderData() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResumeBuilderData) => {
      saveLocalBuilderData(data);

      if (!user) return;

      const { error } = await supabase.from("resumes").upsert(
        {
          user_id: user.id,
          title: data.title || "Master Resume",
          data: data as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.warn("[Supabase] Failed to persist resume builder data:", error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["builder_data"] });
    },
  });
}
