import type { Tenant, Project, ContentBlock, TenantStat, TenantTestimonial, TenantFaq } from "@/lib/types";

export interface TemplateProps {
  tenant: Tenant;
  projects: Project[];
  services: ContentBlock[];
  features: ContentBlock[];
  stats: TenantStat[];
  testimonials: TenantTestimonial[];
  faqs: TenantFaq[];
}
