-- ============================================================
-- وجود — Initial Migration (idempotent, safe to re-run)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS tenants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name_ar        TEXT NOT NULL,
  name_en        TEXT,
  custom_domain  TEXT UNIQUE,
  logo_url       TEXT,
  cover_url      TEXT,
  about_ar       TEXT,
  about_en       TEXT,
  phone          TEXT,
  whatsapp       TEXT,
  email          TEXT,
  address_ar     TEXT,
  address_en     TEXT,
  maps_url       TEXT,
  social         JSONB DEFAULT '{}'::jsonb,
  video_url      TEXT,
  whatsapp_note  TEXT,
  sector         TEXT NOT NULL CHECK (sector IN ('architecture','contractor','realestate','interior','photo','legal','medical','general')),
  current_template TEXT NOT NULL DEFAULT 'modern',
  theme_config   JSONB,
  is_active      BOOLEAN DEFAULT true,
  plan           TEXT NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic','pro','premium')),
  starts_at      TIMESTAMPTZ,
  ends_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug           ON tenants (slug);
CREATE INDEX IF NOT EXISTS idx_tenants_custom_domain  ON tenants (custom_domain) WHERE custom_domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_active_ends    ON tenants (is_active, ends_at);

-- ----

CREATE TABLE IF NOT EXISTS tenant_users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner','editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users (user_id);

-- ----

CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title_ar        TEXT NOT NULL,
  title_en        TEXT,
  description_ar  TEXT,
  description_en  TEXT,
  category        TEXT,
  location        TEXT,
  year            INT,
  cover_url       TEXT,
  display_order   INT DEFAULT 0,
  is_featured     BOOLEAN DEFAULT false,
  price           NUMERIC,
  area_sqm        NUMERIC,
  status          TEXT,
  rooms           INT,
  bathrooms       INT,
  tags            TEXT[],
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_tenant       ON projects (tenant_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_featured     ON projects (tenant_id, is_featured) WHERE deleted_at IS NULL;

-- ----

CREATE TABLE IF NOT EXISTS project_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images (project_id, display_order);

-- ----

CREATE TABLE IF NOT EXISTS content_blocks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('service','feature')),
  title         TEXT NOT NULL,
  description   TEXT,
  icon          TEXT,
  display_order INT DEFAULT 0,
  is_published  BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_tenant ON content_blocks (tenant_id, type, is_published);

-- ----

CREATE TABLE IF NOT EXISTS tenant_stats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  value         NUMERIC NOT NULL,
  prefix        TEXT,
  suffix        TEXT,
  label         TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- ----

CREATE TABLE IF NOT EXISTS tenant_testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_name   TEXT NOT NULL,
  client_role   TEXT,
  text          TEXT NOT NULL,
  rating        SMALLINT CHECK (rating BETWEEN 1 AND 5),
  display_order INT DEFAULT 0,
  is_published  BOOLEAN DEFAULT true
);

-- ----

CREATE TABLE IF NOT EXISTS tenant_faqs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_published  BOOLEAN DEFAULT true
);

-- ----

CREATE TABLE IF NOT EXISTS subscription_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  action       TEXT NOT NULL,
  plan         TEXT NOT NULL,
  amount       NUMERIC,
  notes        TEXT,
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_logs_tenant ON subscription_logs (tenant_id, performed_at DESC);

-- ----

CREATE TABLE IF NOT EXISTS admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----

CREATE TABLE IF NOT EXISTS custom_themes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar       TEXT NOT NULL,
  name_en       TEXT,
  description   TEXT,
  preview_url   TEXT,
  config        JSONB NOT NULL,
  required_plan TEXT NOT NULL DEFAULT 'pro' CHECK (required_plan IN ('basic','pro','premium')),
  visibility    TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private')),
  is_active     BOOLEAN DEFAULT true,
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ----

CREATE TABLE IF NOT EXISTS custom_theme_tenants (
  theme_id    UUID NOT NULL REFERENCES custom_themes(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (theme_id, tenant_id)
);

-- ----

CREATE TABLE IF NOT EXISTS visitor_events (
  id              BIGSERIAL PRIMARY KEY,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  path            TEXT NOT NULL,
  referrer_host   TEXT,
  device_type     TEXT CHECK (device_type IN ('mobile','desktop','tablet')),
  country_code    TEXT,
  user_agent_hash TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_events_tenant ON visitor_events (tenant_id, created_at DESC);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- updated_at auto-update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tenants_updated_at') THEN
    CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'projects_updated_at') THEN
    CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- Prevent slug change
CREATE OR REPLACE FUNCTION prevent_slug_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS DISTINCT FROM OLD.slug THEN
    RAISE EXCEPTION 'لا يمكن تغيير slug بعد الإنشاء';
  END IF;
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tenants_slug_immutable') THEN
    CREATE TRIGGER tenants_slug_immutable BEFORE UPDATE ON tenants
      FOR EACH ROW EXECUTE FUNCTION prevent_slug_change();
  END IF;
END $$;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;

-- Tenant membership check (for RLS)
CREATE OR REPLACE FUNCTION is_tenant_member(p_tenant_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_users
    WHERE tenant_id = p_tenant_id AND user_id = auth.uid()
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE tenants              ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images       ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_stats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_testimonials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_faqs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_themes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_theme_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_events       ENABLE ROW LEVEL SECURITY;

-- ---- tenants ----
DROP POLICY IF EXISTS "tenants_public_read"   ON tenants;
DROP POLICY IF EXISTS "tenants_tenant_read"   ON tenants;
DROP POLICY IF EXISTS "tenants_tenant_update" ON tenants;
DROP POLICY IF EXISTS "tenants_admin_all"     ON tenants;

CREATE POLICY "tenants_public_read" ON tenants FOR SELECT
  USING (is_active = true AND ends_at > NOW());

CREATE POLICY "tenants_tenant_read" ON tenants FOR SELECT
  USING (id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "tenants_tenant_update" ON tenants FOR UPDATE
  USING (id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "tenants_admin_all" ON tenants FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- tenant_users ----
DROP POLICY IF EXISTS "tu_tenant_read"  ON tenant_users;
DROP POLICY IF EXISTS "tu_admin_all"    ON tenant_users;

CREATE POLICY "tu_tenant_read" ON tenant_users FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "tu_admin_all" ON tenant_users FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- projects ----
DROP POLICY IF EXISTS "proj_public_read"  ON projects;
DROP POLICY IF EXISTS "proj_tenant_crud"  ON projects;
DROP POLICY IF EXISTS "proj_admin_all"    ON projects;

CREATE POLICY "proj_public_read" ON projects FOR SELECT
  USING (
    deleted_at IS NULL
    AND tenant_id IN (SELECT id FROM tenants WHERE is_active = true AND ends_at > NOW())
  );

CREATE POLICY "proj_tenant_crud" ON projects FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "proj_admin_all" ON projects FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- project_images ----
DROP POLICY IF EXISTS "pimg_public_read"  ON project_images;
DROP POLICY IF EXISTS "pimg_tenant_crud"  ON project_images;
DROP POLICY IF EXISTS "pimg_admin_all"    ON project_images;

CREATE POLICY "pimg_public_read" ON project_images FOR SELECT
  USING (tenant_id IN (SELECT id FROM tenants WHERE is_active = true AND ends_at > NOW()));

CREATE POLICY "pimg_tenant_crud" ON project_images FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "pimg_admin_all" ON project_images FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- content_blocks ----
DROP POLICY IF EXISTS "cb_public_read"  ON content_blocks;
DROP POLICY IF EXISTS "cb_tenant_crud"  ON content_blocks;
DROP POLICY IF EXISTS "cb_admin_all"    ON content_blocks;

CREATE POLICY "cb_public_read" ON content_blocks FOR SELECT
  USING (
    is_published = true
    AND tenant_id IN (SELECT id FROM tenants WHERE is_active = true AND ends_at > NOW())
  );

CREATE POLICY "cb_tenant_crud" ON content_blocks FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "cb_admin_all" ON content_blocks FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- tenant_stats ----
DROP POLICY IF EXISTS "stats_public_read"  ON tenant_stats;
DROP POLICY IF EXISTS "stats_tenant_crud"  ON tenant_stats;
DROP POLICY IF EXISTS "stats_admin_all"    ON tenant_stats;

CREATE POLICY "stats_public_read" ON tenant_stats FOR SELECT
  USING (tenant_id IN (SELECT id FROM tenants WHERE is_active = true AND ends_at > NOW()));

CREATE POLICY "stats_tenant_crud" ON tenant_stats FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "stats_admin_all" ON tenant_stats FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- tenant_testimonials ----
DROP POLICY IF EXISTS "tm_public_read"  ON tenant_testimonials;
DROP POLICY IF EXISTS "tm_tenant_crud"  ON tenant_testimonials;
DROP POLICY IF EXISTS "tm_admin_all"    ON tenant_testimonials;

CREATE POLICY "tm_public_read" ON tenant_testimonials FOR SELECT
  USING (
    is_published = true
    AND tenant_id IN (SELECT id FROM tenants WHERE is_active = true AND ends_at > NOW())
  );

CREATE POLICY "tm_tenant_crud" ON tenant_testimonials FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "tm_admin_all" ON tenant_testimonials FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- tenant_faqs ----
DROP POLICY IF EXISTS "faq_public_read"  ON tenant_faqs;
DROP POLICY IF EXISTS "faq_tenant_crud"  ON tenant_faqs;
DROP POLICY IF EXISTS "faq_admin_all"    ON tenant_faqs;

CREATE POLICY "faq_public_read" ON tenant_faqs FOR SELECT
  USING (
    is_published = true
    AND tenant_id IN (SELECT id FROM tenants WHERE is_active = true AND ends_at > NOW())
  );

CREATE POLICY "faq_tenant_crud" ON tenant_faqs FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "faq_admin_all" ON tenant_faqs FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- subscription_logs ----
DROP POLICY IF EXISTS "sl_tenant_read"  ON subscription_logs;
DROP POLICY IF EXISTS "sl_admin_all"    ON subscription_logs;

CREATE POLICY "sl_tenant_read" ON subscription_logs FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "sl_admin_all" ON subscription_logs FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- admin_users ----
DROP POLICY IF EXISTS "au_admin_only" ON admin_users;

CREATE POLICY "au_admin_only" ON admin_users FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- custom_themes ----
DROP POLICY IF EXISTS "ct_public_read"  ON custom_themes;
DROP POLICY IF EXISTS "ct_admin_all"    ON custom_themes;

CREATE POLICY "ct_public_read" ON custom_themes FOR SELECT
  USING (is_active = true AND visibility = 'public');

CREATE POLICY "ct_admin_all" ON custom_themes FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- custom_theme_tenants ----
DROP POLICY IF EXISTS "ctt_tenant_read"  ON custom_theme_tenants;
DROP POLICY IF EXISTS "ctt_admin_all"    ON custom_theme_tenants;

CREATE POLICY "ctt_tenant_read" ON custom_theme_tenants FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "ctt_admin_all" ON custom_theme_tenants FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- visitor_events ----
DROP POLICY IF EXISTS "ve_anyone_insert"  ON visitor_events;
DROP POLICY IF EXISTS "ve_tenant_read"    ON visitor_events;
DROP POLICY IF EXISTS "ve_admin_read"     ON visitor_events;

CREATE POLICY "ve_anyone_insert" ON visitor_events FOR INSERT WITH CHECK (true);

CREATE POLICY "ve_tenant_read" ON visitor_events FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "ve_admin_read" ON visitor_events FOR SELECT
  USING (is_admin());

-- ============================================================
-- STORAGE BUCKETS (run via Supabase dashboard or CLI)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('tenants', 'tenants', true)
-- ON CONFLICT DO NOTHING;
