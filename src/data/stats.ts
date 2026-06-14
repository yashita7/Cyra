import type { DashboardStats } from "./types";

/** Dashboard stats for Screen 8 (Person 2) + Inbox stat strip. */
export const dashboardStats: DashboardStats = {
  valueRecoveredINR: 420000,
  co2DivertedKg: 1043,
  preventablePct: 58,
  unitsSaved: 96,
  unitsTotal: 100,
  scale: { valueRecoveredUSD: "$2B+", co2AvoidedTonnes: "1M+" },
};

/** Inbox top-strip tiles (consistent with stats above). */
export const inboxStats = {
  pending: 14,
  autoResolvedToday: 312,
  recoveryTodayINR: 420000, // ₹4.2L
  preventablePct: 58,
};
