export const APP_NAME = "Marketplace";

export const USER_ROLES = [
  "user",
  "premium",
  "moderator",
  "admin",
  "super_admin",
] as const;

export const SUBSCRIPTION_TIERS = ["free", "premium", "elite"] as const;

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  gallery: "gallery",
  videos: "videos",
  verification: "verification",
} as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
  dashboardProfile: "/dashboard/profile",
  dashboardSubscription: "/dashboard/subscription",
  admin: "/admin",
  adminUsers: "/admin/users",
  adminSubscriptions: "/admin/subscriptions",
  adminReports: "/admin/reports",
  adminAnalytics: "/admin/analytics",
} as const;

export const PROTECTED_ROUTES = [
  ROUTES.dashboard,
  ROUTES.dashboardProfile,
  ROUTES.dashboardSubscription,
] as const;

export const ADMIN_ROUTES = [
  ROUTES.admin,
  ROUTES.adminUsers,
  ROUTES.adminSubscriptions,
  ROUTES.adminReports,
  ROUTES.adminAnalytics,
] as const;

export const AUTH_ROUTES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
] as const;

export const ROLE_HIERARCHY: Record<
  (typeof USER_ROLES)[number],
  number
> = {
  user: 0,
  premium: 1,
  moderator: 2,
  admin: 3,
  super_admin: 4,
};

export const SUBSCRIPTION_FEATURES = {
  free: {
    name: "Free",
    price: 0,
    features: ["Basic profile", "Limited gallery", "Standard support"],
  },
  premium: {
    name: "Premium",
    price: 1999,
    features: [
      "Verified badge",
      "Unlimited gallery",
      "Priority listing",
      "Email support",
    ],
  },
  elite: {
    name: "Elite",
    price: 4999,
    features: [
      "All Premium features",
      "Video uploads",
      "Featured placement",
      "Dedicated support",
      "Analytics dashboard",
    ],
  },
} as const;
