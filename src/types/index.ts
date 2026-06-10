import type { Database } from "./database";
import type { SUBSCRIPTION_TIERS, USER_ROLES } from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[number];
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Report = Database["public"]["Tables"]["reports"]["Row"];

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  profile: Profile | null;
}

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  pendingReports: number;
  revenueThisMonth: number;
}
