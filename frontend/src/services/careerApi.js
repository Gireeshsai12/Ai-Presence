import { apiRequest } from "./apiClient";

export function reviewResume({ resumeText, targetRole }) {
  return apiRequest("/api/career/resume/review", {
    method: "POST",
    body: JSON.stringify({
      resume_text: resumeText,
      target_role: targetRole || "Software Engineer",
    }),
  });
}

export function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/api/career/resume/upload-review", {
    method: "POST",
    body: formData,
  });
}

export function analyzeJobDescription({ resumeText, jobDescription }) {
  return apiRequest("/api/career/jd/analyze", {
    method: "POST",
    body: JSON.stringify({
      resume_text: resumeText || "",
      job_description: jobDescription,
    }),
  });
}

export function evaluateSTAR({ question, answer }) {
  return apiRequest("/api/career/star/evaluate", {
    method: "POST",
    body: JSON.stringify({
      question,
      answer,
    }),
  });
}

export function evaluateCoding({ question, solution, language }) {
  return apiRequest("/api/career/coding/evaluate", {
    method: "POST",
    body: JSON.stringify({
      question,
      solution,
      language: language || "javascript",
    }),
  });
}

export function startInterview({ role, difficulty, interviewType }) {
  return apiRequest("/api/interview/start", {
    method: "POST",
    body: JSON.stringify({
      role: role || "Software Engineer",
      difficulty: difficulty || "entry",
      interview_type: interviewType || "behavioral",
    }),
  });
}

export function evaluateInterviewAnswer({ question, answer, role }) {
  return apiRequest("/api/interview/evaluate-answer", {
    method: "POST",
    body: JSON.stringify({
      question,
      answer,
      role: role || "Software Engineer",
    }),
  });
}
