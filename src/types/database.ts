export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          country: string | null;
          languages: string[];
          verified_status: boolean;
          role: "user" | "premium" | "moderator" | "admin" | "super_admin";
          subscription_tier: "free" | "premium" | "elite";
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          languages?: string[];
          verified_status?: boolean;
          role?: "user" | "premium" | "moderator" | "admin" | "super_admin";
          subscription_tier?: "free" | "premium" | "elite";
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          languages?: string[];
          verified_status?: boolean;
          role?: "user" | "premium" | "moderator" | "admin" | "super_admin";
          subscription_tier?: "free" | "premium" | "elite";
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          status: string;
          tier: "free" | "premium" | "elite";
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          status: string;
          tier: "free" | "premium" | "elite";
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          status?: string;
          tier?: "free" | "premium" | "elite";
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          description: string | null;
          status: "pending" | "reviewed" | "resolved" | "dismissed";
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          description?: string | null;
          status?: "pending" | "reviewed" | "resolved" | "dismissed";
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          reported_user_id?: string;
          reason?: string;
          description?: string | null;
          status?: "pending" | "reviewed" | "resolved" | "dismissed";
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          user_id: string;
          bucket: string;
          path: string;
          type: "image" | "video";
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bucket: string;
          path: string;
          type: "image" | "video";
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bucket?: string;
          path?: string;
          type?: "image" | "video";
          is_public?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
      has_role: {
        Args: { user_id: string; required_role: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "user" | "premium" | "moderator" | "admin" | "super_admin";
      subscription_tier: "free" | "premium" | "elite";
      report_status: "pending" | "reviewed" | "resolved" | "dismissed";
    };
    CompositeTypes: Record<string, never>;
  };
}
