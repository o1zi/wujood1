export type Sector =
  | "architecture"
  | "contractor"
  | "realestate"
  | "interior"
  | "photo"
  | "legal"
  | "medical"
  | "general";

export type Plan = "basic" | "pro" | "premium";

export type TenantRole = "owner" | "editor";

export type AccountStatus = "active" | "expired" | "suspended";

export interface SectorConfig {
  label: string;
  projectWord: string;
  actionLabel: string;
}

export interface PlanConfig {
  priceYearly: number;
  projects: number;
  storage_mb: number;
  templates: string[];
  customDomain: boolean;
}

export interface Tenant {
  id: string;
  slug: string;
  name_ar: string;
  name_en?: string | null;
  custom_domain?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  about_ar?: string | null;
  about_en?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address_ar?: string | null;
  address_en?: string | null;
  maps_url?: string | null;
  social?: Record<string, string> | null;
  video_url?: string | null;
  whatsapp_note?: string | null;
  sector: Sector;
  current_template: string;
  theme_config?: ThemeConfig | null;
  is_active: boolean;
  plan: Plan;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThemeConfig {
  primary?: string;
  accent?: string;
  bg?: string;
  text?: string;
  radius?: number;
  fontHead?: string;
  fontBody?: string;
  heroStyle?: string;
  dark?: boolean;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: TenantRole;
  created_at: string;
}

export interface Project {
  id: string;
  tenant_id: string;
  title_ar: string;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  category?: string | null;
  location?: string | null;
  year?: number | null;
  cover_url?: string | null;
  display_order: number;
  is_featured: boolean;
  price?: number | null;
  area_sqm?: number | null;
  status?: string | null;
  rooms?: number | null;
  bathrooms?: number | null;
  tags?: string[] | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  tenant_id: string;
  url: string;
  display_order: number;
  created_at: string;
}

export interface ContentBlock {
  id: string;
  tenant_id: string;
  type: "service" | "feature";
  title: string;
  description?: string | null;
  icon?: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface TenantStat {
  id: string;
  tenant_id: string;
  value: number;
  prefix?: string | null;
  suffix?: string | null;
  label: string;
  display_order: number;
}

export interface TenantTestimonial {
  id: string;
  tenant_id: string;
  client_name: string;
  client_role?: string | null;
  text: string;
  rating?: number | null;
  display_order: number;
  is_published: boolean;
}

export interface TenantFaq {
  id: string;
  tenant_id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
}

export interface SubscriptionLog {
  id: string;
  tenant_id: string;
  action: string;
  plan: Plan;
  amount?: number | null;
  notes?: string | null;
  performed_by?: string | null;
  performed_at: string;
}

export interface CustomTheme {
  id: string;
  name_ar: string;
  name_en?: string | null;
  description?: string | null;
  preview_url?: string | null;
  config: ThemeConfig;
  required_plan: Plan;
  visibility: "public" | "private";
  is_active: boolean;
  created_by?: string | null;
  created_at: string;
}

export interface VisitorEvent {
  id: number;
  tenant_id: string;
  path: string;
  referrer_host?: string | null;
  device_type?: "mobile" | "desktop" | "tablet" | null;
  country_code?: string | null;
  user_agent_hash?: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: { Row: Tenant; Insert: Omit<Tenant, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Tenant, "id" | "slug">> };
      tenant_users: { Row: TenantUser; Insert: Omit<TenantUser, "id" | "created_at">; Update: Partial<TenantUser> };
      projects: { Row: Project; Insert: Omit<Project, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Project, "id" | "tenant_id">> };
      project_images: { Row: ProjectImage; Insert: Omit<ProjectImage, "id" | "created_at">; Update: Partial<ProjectImage> };
      content_blocks: { Row: ContentBlock; Insert: Omit<ContentBlock, "id" | "created_at">; Update: Partial<Omit<ContentBlock, "id" | "tenant_id">> };
      tenant_stats: { Row: TenantStat; Insert: Omit<TenantStat, "id">; Update: Partial<TenantStat> };
      tenant_testimonials: { Row: TenantTestimonial; Insert: Omit<TenantTestimonial, "id">; Update: Partial<TenantTestimonial> };
      tenant_faqs: { Row: TenantFaq; Insert: Omit<TenantFaq, "id">; Update: Partial<TenantFaq> };
      subscription_logs: { Row: SubscriptionLog; Insert: Omit<SubscriptionLog, "id">; Update: Partial<SubscriptionLog> };
      admin_users: { Row: { user_id: string; created_at: string }; Insert: { user_id: string }; Update: never };
      custom_themes: { Row: CustomTheme; Insert: Omit<CustomTheme, "id" | "created_at">; Update: Partial<Omit<CustomTheme, "id">> };
      visitor_events: { Row: VisitorEvent; Insert: Omit<VisitorEvent, "id" | "created_at">; Update: never };
    };
    Views: Record<string, never>;
    Functions: {
      visitor_by_device: {
        Args: { p_tenant_id: string; p_since: string };
        Returns: { device_type: string; count: number }[];
      };
    };
  };
}
