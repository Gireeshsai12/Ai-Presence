import { apiRequest } from "./apiClient";

export function getDashboardStats() {
  return apiRequest("/api/analytics/dashboard");
}
