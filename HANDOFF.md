# وجود — Engineering Handoff Brief

> هذا الملف هو المرجع الكامل لبناء النسخة الإنتاجية من منصة **وجود** (Wujood) — منصة SaaS لإنشاء مواقع المكاتب المهنية. يتضمن: السياق، البنية التقنية، سكيما قاعدة البيانات، سياسات الأمان، ترتيب البناء، ومعايير القبول.

---

## 1. السياق

**وجود** منصة SaaS تتيح للمكاتب والشركات المهنية إنشاء موقع إلكتروني احترافي خاص بهم وإدارته بأنفسهم دون أي خبرة تقنية. كل مكتب يحصل على موقع مستقل برابط أو دومين خاص، يختار شكله من مجموعة قوالب متنوعة، ويدير محتواه كاملاً من داشبورد خاص به.

**المنصة تُدار من قِبل مالك واحد** (Super Admin) يُفعّل الحسابات يدوياً بعد استلام التحويل البنكي عبر واتساب. **لا يوجد نظام دفع إلكتروني** — كل شيء يدوي من جهة الأدمن. هذا قرار محسوم لا يتغير في هذه المرحلة.

---

## 2. الـ UI Prototype — موجود بالكامل

في هذا المستودع يوجد prototype عالي الدقة لكامل الـ UI بـ React + JSX (مرئي عبر `index.html`). **هذا مرجعك البصري الرئيسي** — كل شاشة وكل مكوّن مرسوم. مهمتك هي تحويله إلى تطبيق Next.js إنتاجي.

**هيكل ملفات الـ Prototype:**
```
index.html                          # نقطة الدخول، تحمّل React + Babel + كل المكوّنات
styles.css                          # design tokens، colors، type، components atoms
src/
  icons.jsx                         # كل الأيقونات SVG (للنقل لـ lucide-react)
  data.jsx                          # mock data — استبدله بـ Supabase queries
  atoms.jsx                         # Logo, Btn, Card, Badge, Toggle, Input, ... — للنقل لـ shadcn
  app.jsx                           # hash router — استبدله بـ Next.js App Router
  views/
    landing.jsx                     # الصفحة التسويقية للمنصة
    auth.jsx                        # تسجيل الدخول (مكتب / أدمن)
    tenant.jsx                      # داشبورد المكتب (11 صفحة)
    admin.jsx                       # داشبورد الأدمن (6 صفحات)
    publicSite.jsx                  # router للقوالب
    themeBuilder.jsx                # محرر القوالب المرئي
    templates/                      # 6 قوالب جاهزة
      classic.jsx                   # كلاسيكي بني + ذهبي
      heritage.jsx                  # تراثي سعودي طيني
      luxury.jsx                    # داكن + ذهبي
      minimal.jsx                   # أبيض + مساحات
      studio.jsx                    # غير متماثل + ساج
```

**ملاحظات مهمة عن الـ Prototype:**
- `styles.css` يحتوي على نظام التصميم الكامل (ألوان، خطوط، spacing). انقله لـ Tailwind config + CSS variables.
- `data.jsx` فيه شكل كل البيانات المطلوبة (tenants, projects, services, ...). استخدمه كمرجع لسكيما قاعدة البيانات.
- المكوّنات في `atoms.jsx` بـ inline styles — أعد بناءها على shadcn/ui للداشبورد. **القوالب** (templates/) ابقها على Tailwind المجرد فقط — لا تستخدم shadcn فيها.
- الـ Prototype **بدون باك اند فعلي** — كل البيانات في الذاكرة. مهمتك توصيله بقاعدة بيانات حقيقية.

---

## 3. المكدس التقني — قرارات محسومة لا تتغير

| المكوّن | الاختيار | السبب |
|---|---|---|
| Framework | **Next.js 14 + App Router** | SSR + توجيه متعدد المستأجرين |
| قاعدة البيانات | **Supabase (Postgres)** | RLS مدمج + Auth + Storage |
| المصادقة | **Supabase Auth** | يربط مع DB بشكل أصلي |
| التخزين | **Supabase Storage** | حدود لكل مكتب، سياسات أمان |
| التنسيق | **Tailwind CSS + shadcn/ui** | shadcn للداشبورد فقط؛ Tailwind المجرد للقوالب |
| الاستضافة | **Vercel** | Wildcard Domains + Middleware |
| الإيميلات | **Resend** | عربي ممتاز + DX جيد |
| اللغة | **TypeScript** | في كل مكان بدون استثناء |

**قواعد صارمة لا تُكسر:**
- shadcn/ui للداشبورد فقط — لا تستخدمه أبداً داخل القوالب العامة (يُكسر تخصيصها)
- كل الصور والملفات عبر Supabase Storage حصراً — لا روابط خارجية مباشرة
- الـ `slug` لا يتغير بعد الإنشاء (يكسر روابط Google والشيرات)
- **كل query تمر عبر `tenant_id`** بدون أي استثناء
- لا تسجيل ذاتي للمكاتب — الأدمن فقط ينشئ الحسابات
- لا دفع إلكتروني في هذه المرحلة
- Server Components أولاً، Client Components عند الحاجة فقط
- كل mutation تمر عبر Server Actions
- RLS في Supabase هي خط الدفاع الأول دائماً — **لا تعتمد على client-side فقط**

---

## 4. أنواع المستخدمين

| النوع | الوصف | الصلاحيات |
|---|---|---|
| **Public Visitor** | يتصفح موقع المكتب، لا حساب | يقرأ المحتوى العام للمكاتب النشطة فقط |
| **Tenant Owner/Editor** | صاحب المكتب | يرى ويعدل بياناته فقط — RLS تمنعه تماماً من رؤية بيانات مكتب آخر |
| **Super Admin** | مالك المنصة | يقرأ ويعدل كل شيء — يُتحقق منه عبر `is_admin()` في Postgres |

---

## 5. سكيما قاعدة البيانات الكاملة

### `tenants` (المكاتب)
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,                    -- لا يتغير بعد الإنشاء (يُحمى بـ trigger)
  name_ar TEXT NOT NULL,
  name_en TEXT,
  custom_domain TEXT UNIQUE,                    -- premium فقط
  logo_url TEXT,
  cover_url TEXT,
  about_ar TEXT,
  about_en TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address_ar TEXT,
  address_en TEXT,
  maps_url TEXT,
  social JSONB DEFAULT '{}'::jsonb,             -- {instagram, twitter, linkedin, snapchat, tiktok}
  video_url TEXT,
  whatsapp_note TEXT,
  sector TEXT NOT NULL,                         -- architecture | contractor | realestate | interior | photo | legal | medical | general
  current_template TEXT NOT NULL DEFAULT 'modern',
  is_active BOOLEAN DEFAULT true,
  plan TEXT NOT NULL DEFAULT 'basic',           -- basic | pro | premium
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON tenants (slug);
CREATE INDEX ON tenants (custom_domain) WHERE custom_domain IS NOT NULL;
CREATE INDEX ON tenants (is_active, ends_at);
```

### `tenant_users` (ربط الحساب بالمكتب)
```sql
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner',           -- owner | editor
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, user_id)
);
CREATE INDEX ON tenant_users (user_id);
```

### `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  category TEXT,                                 -- يعتمد على القطاع
  location TEXT,
  year INT,
  cover_url TEXT,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  price NUMERIC,                                 -- للعقاريين
  area_sqm NUMERIC,
  status TEXT,                                   -- تحت الإنشاء | مكتمل | للبيع
  rooms INT,
  bathrooms INT,
  tags TEXT[],
  deleted_at TIMESTAMPTZ,                        -- soft delete
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON projects (tenant_id, deleted_at);
CREATE INDEX ON projects (tenant_id, is_featured) WHERE deleted_at IS NULL;
```

### `project_images`
```sql
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON project_images (project_id, display_order);
```

### `content_blocks` (خدمات + مميزات)
```sql
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                            -- service | feature
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,                                     -- اسم من مكتبة محددة
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON content_blocks (tenant_id, type, is_published);
```

### `tenant_stats`
```sql
CREATE TABLE tenant_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  prefix TEXT,
  suffix TEXT,
  label TEXT NOT NULL,
  display_order INT DEFAULT 0
);
```

### `tenant_testimonials`
```sql
CREATE TABLE tenant_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_role TEXT,
  text TEXT NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);
```

### `tenant_faqs`
```sql
CREATE TABLE tenant_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);
```

### `subscription_logs`
```sql
CREATE TABLE subscription_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  action TEXT NOT NULL,                          -- activation | renewal | suspend | cancel | upgrade
  plan TEXT NOT NULL,
  amount NUMERIC,
  notes TEXT,                                    -- رقم التحويل، اسم المحوّل
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON subscription_logs (tenant_id, performed_at DESC);
```

### `admin_users`
```sql
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;
```

### `custom_themes`
```sql
CREATE TABLE custom_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  preview_url TEXT,
  config JSONB NOT NULL,                         -- إعدادات القالب الكامل
  required_plan TEXT NOT NULL DEFAULT 'pro',
  visibility TEXT NOT NULL DEFAULT 'public',     -- public | private
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `custom_theme_tenants`
```sql
CREATE TABLE custom_theme_tenants (
  theme_id UUID NOT NULL REFERENCES custom_themes(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (theme_id, tenant_id)
);
```

### `visitor_events`
```sql
CREATE TABLE visitor_events (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  referrer_host TEXT,
  device_type TEXT,                              -- mobile | desktop | tablet
  country_code TEXT,
  user_agent_hash TEXT,                          -- بدون cookies؛ hash من UA+IP يومياً
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON visitor_events (tenant_id, created_at DESC);
```

---

## 6. Row-Level Security — كل الجداول

**فعّل RLS على كل الجداول بدون استثناء**، ثم طبّق:

### `tenants`
```sql
-- Public: يقرأ المكاتب النشطة فقط
CREATE POLICY "public_read_active" ON tenants FOR SELECT
  USING (is_active = true AND ends_at > NOW());

-- Tenant: يرى ويعدل مكتبه فقط
CREATE POLICY "tenant_read_own" ON tenants FOR SELECT
  USING (id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "tenant_update_own" ON tenants FOR UPDATE
  USING (id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

-- Admin: كامل
CREATE POLICY "admin_all" ON tenants FOR ALL USING (is_admin()) WITH CHECK (is_admin());
```

### `projects`, `project_images`, `content_blocks`, `tenant_stats`, `tenant_testimonials`, `tenant_faqs`
نفس النمط لكل جدول:
```sql
-- Public: يقرأ بيانات المكاتب النشطة فقط
CREATE POLICY "public_read" ON <table> FOR SELECT
  USING (
    tenant_id IN (SELECT id FROM tenants WHERE is_active = true AND ends_at > NOW())
    AND (is_published = true OR is_published IS NULL)
    AND (deleted_at IS NULL OR deleted_at IS NULL)
  );

-- Tenant: full CRUD على بياناته فقط
CREATE POLICY "tenant_crud_own" ON <table> FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()))
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));

-- Admin
CREATE POLICY "admin_all" ON <table> FOR ALL USING (is_admin()) WITH CHECK (is_admin());
```

### `subscription_logs`, `admin_users`, `custom_themes`, `custom_theme_tenants`
الأدمن فقط:
```sql
CREATE POLICY "admin_only" ON <table> FOR ALL USING (is_admin()) WITH CHECK (is_admin());
-- استثناء: subscription_logs — صاحب المكتب يقرأ سجل مكتبه
CREATE POLICY "tenant_read_own_logs" ON subscription_logs FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));
```

### `visitor_events`
```sql
-- INSERT: مفتوح (يُسجَّل من الـ middleware)
CREATE POLICY "anyone_insert" ON visitor_events FOR INSERT WITH CHECK (true);
-- SELECT: المكتب يقرأ زواره فقط
CREATE POLICY "tenant_read_own" ON visitor_events FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));
-- Admin
CREATE POLICY "admin_all" ON visitor_events FOR SELECT USING (is_admin());
```

**Trigger لمنع تغيير الـ slug:**
```sql
CREATE OR REPLACE FUNCTION prevent_slug_change() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS DISTINCT FROM OLD.slug THEN
    RAISE EXCEPTION 'لا يمكن تغيير slug بعد الإنشاء';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_slug_immutable BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION prevent_slug_change();
```

---

## 7. التوجيه متعدد المستأجرين (Middleware)

`middleware.ts` يعمل قبل كل طلب:

```
1. اقرأ host من الـ request
2. إذا host === ROOT_DOMAIN أو www.ROOT_DOMAIN → السماح للراوت كما هو (landing, /login, /dashboard, /admin)
3. إذا host === <slug>.ROOT_DOMAIN → استخرج slug، ابحث عنه في tenants
4. إذا host دومين آخر → ابحث عنه في tenants.custom_domain
5. إذا وُجد المكتب:
   - أضف x-tenant-id و x-tenant-slug للـ headers
   - أعد كتابة الراوت إلى /_site/<slug>/<path>
6. إذا لم يوجد → redirect إلى صفحة "غير موجود"
7. للأدمن: /admin/* محمي بمسار middleware ثاني يتحقق من is_admin()
```

**عند انتهاء الاشتراك:**
- إذا `is_active = true && ends_at < NOW()` → اعرض صفحة "انتهى الاشتراك — تواصل مع المكتب" (موجودة جاهزة في الـ prototype كقالب يمكن إنشاؤه)
- إذا `is_active = false` → 404

---

## 8. التخزين (Supabase Storage)

**Buckets:**
- `tenants` — عامة (للشعارات، الأغلفة، الصور المنشورة)

**هيكل المجلدات داخل bucket واحد:**
```
{tenant_id}/logo.{ext}
{tenant_id}/cover.{ext}
{tenant_id}/projects/{project_id}/cover.{ext}
{tenant_id}/projects/{project_id}/gallery/{image_id}.{ext}
```

**سياسات Storage:**
- READ: عامة لكل ما في bucket `tenants` (المسارات يصعب تخمينها لأن tenant_id UUID)
- WRITE/UPDATE/DELETE: فقط لصاحب المكتب أو الأدمن، يُتحقق من `tenant_id` في المسار

**حدود الرفع (تُطبَّق في Server Action قبل الرفع):**
| الملف | الحد الأقصى | الصيغ |
|---|---|---|
| الشعار | 2 MB | PNG, JPG, SVG, WebP |
| صورة الغلاف | 5 MB | JPG, WebP |
| صور المشاريع | 10 MB/صورة، 20 صورة/مشروع | JPG, WebP |
| التخزين الكلي | Basic 500MB · Pro 2GB · Premium 10GB | — |

**عند استبدال صورة:** احذف القديمة تلقائياً من Storage (تجنب الملفات اليتيمة).

---

## 9. الباقات وحدودها

```typescript
const PLANS = {
  basic:   { priceYearly: 1200, projects: 10,       storage_mb: 500,   templates: ['modern'],           customDomain: false },
  pro:     { priceYearly: 2000, projects: 30,       storage_mb: 2000,  templates: ['all_base', 'public_custom'], customDomain: false },
  premium: { priceYearly: 3500, projects: Infinity, storage_mb: 10000, templates: ['all'],              customDomain: true  },
};
```

**كل حد يُفرَض في 3 طبقات:**
1. UI (للتجربة) — تعطيل الأزرار
2. Server Action (لمنع الاستخدام المباشر للـ API)
3. RLS / DB constraints (دفاع نهائي)

---

## 10. الإيميلات التلقائية (Resend)

| المناسبة | المستلم | المحتوى | طريقة التشغيل |
|---|---|---|---|
| إنشاء حساب جديد | المكتب | ترحيب + بيانات الدخول + رابط الداشبورد | Server Action عند إنشاء tenant |
| تفعيل الحساب | المكتب | إشعار التفعيل + رابط الموقع | Server Action |
| تجديد الاشتراك | المكتب | تأكيد التجديد + تاريخ الانتهاء الجديد | Server Action |
| إيقاف الحساب | المكتب | إشعار الإيقاف + تعليمات التجديد | Server Action |
| 30 يوم قبل الانتهاء | المكتب | تذكير بالتجديد + رابط واتساب | **Cron يومي** يفحص ends_at |
| 7 أيام قبل الانتهاء | المكتب | تذكير عاجل | **Cron يومي** |

كل قوالب الإيميل بالعربي + RTL + توقيع المنصة.

---

## 11. حالات الحساب

| الحالة | `is_active` | `ends_at` | ما يراه الزائر | ما يراه المكتب في الداشبورد |
|---|---|---|---|---|
| نشط ومدفوع | true | المستقبل | الموقع الكامل | كل شيء يعمل |
| انتهى الاشتراك | true | الماضي | صفحة "انتهى الاشتراك" | تحذير واضح + تعليمات التجديد |
| موقوف يدوياً | false | أي قيمة | 404 | رسالة إيقاف + تعليمات |

---

## 12. محرك القوالب الديناميكي

**الفكرة:** القوالب نفسها كود ثابت، لكن **مظهرها** يتغيّر حسب JSON من `tenants.theme_config` (تُضاف كعمود JSONB):

```typescript
// في كل قالب:
<div style={{
  '--p-primary': tenant.theme_config.primary || '#0e3b2e',
  '--p-accent': tenant.theme_config.accent || '#b08a3e',
  '--p-r': tenant.theme_config.radius + 'px',
  '--p-fhead': `'${tenant.theme_config.fontHead}', sans-serif`,
  // ...
}}>
```

وداخل القالب: `background: var(--p-primary)`. نتيجة: **نفس الكود ينتج تصاميم مختلفة**.

محرر القوالب (`themeBuilder.jsx` في الـ prototype) يولّد هذا الـ JSON ويحفظه في `custom_themes.config` أو `tenants.theme_config`.

---

## 13. كل صفحات المنصة — مع المتطلبات الخلفية

### A. الصفحات العامة (root domain)
| الراوت | الوصف | Backend |
|---|---|---|
| `/` | Landing تسويقية | static |
| `/login` | تسجيل دخول (مكتب + أدمن) | Supabase Auth |
| `/expired` | صفحة "انتهى الاشتراك" | يُحوَّل من middleware |

### B. داشبورد المكتب (محمي بـ tenant_users)
| الراوت | الوصف |
|---|---|
| `/dashboard` | الرئيسية + إحصاءات سريعة + خطوات تالية |
| `/dashboard/info` | المعلومات الأساسية (اسم، نبذة، شعار، تواصل، سوشيال) |
| `/dashboard/projects` | إدارة المشاريع (CRUD + رفع صور + DnD reorder) |
| `/dashboard/projects/[id]` | تعديل مشروع واحد |
| `/dashboard/services` | الخدمات والمميزات |
| `/dashboard/stats` | أرقام الإنجازات |
| `/dashboard/testimonials` | شهادات العملاء |
| `/dashboard/faqs` | الأسئلة الشائعة |
| `/dashboard/theme` | اختيار القالب (مع تطبيق حدود الباقة) |
| `/dashboard/domain` | الـ subdomain + الدومين المخصص (Premium) + حالة التحقق |
| `/dashboard/subscription` | حالة الاشتراك + السجل + زر تجديد عبر واتساب |
| `/dashboard/analytics` | تحليلات الزوار |

### C. داشبورد الأدمن (محمي بـ admin_users)
| الراوت | الوصف |
|---|---|
| `/admin` | إحصائيات المنصة + المكاتب التي تحتاج متابعة |
| `/admin/tenants` | جدول كل المكاتب + بحث + فلترة |
| `/admin/tenants/new` | إنشاء مكتب جديد (يُنشئ Auth user + tenant + tenant_users + log + إيميل ترحيب) |
| `/admin/tenants/[id]` | تفاصيل + إجراءات (تفعيل/تجديد/إيقاف/حذف) |
| `/admin/templates` | إدارة القوالب المخصصة |
| `/admin/templates/builder/[?id]` | محرر القوالب المرئي |
| `/admin/stats` | إحصاءات شاملة |
| `/admin/logs` | سجل كل العمليات |
| `/admin/settings` | إعدادات المنصة، قوالب الإيميل |

### D. موقع المكتب العام (يُعرض بناءً على middleware)
يُحدَّد القالب من `tenants.current_template` ويُحمَّل من `app/_site/[slug]/page.tsx`:
- الرئيسية: hero + about + services + projects + features + testimonials + faqs + cta + footer
- `/projects` — كل المشاريع + فلتر
- `/projects/[id]` — تفاصيل المشروع + lightbox
- `/contact` — صفحة التواصل
- زر واتساب عائم في كل الصفحات

---

## 14. متغيرات البيئة

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=                # Server-only، للأدمن operations فقط
NEXT_PUBLIC_ROOT_DOMAIN=wujood.sa
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@wujood.sa
WHATSAPP_SUPPORT_NUMBER=+966500000000
```

---

## 15. القطاعات المهنية المدعومة

كل قطاع يؤثر على: مصطلحات القوائم، أقسام الصفحة الرئيسية، تسميات الأزرار، شكل عرض المشاريع.

| القطاع (`sector`) | المصطلح المستخدم في القوائم |
|---|---|
| `architecture` | مكاتب الهندسة المعمارية والإنشائية — مشاريع، إشراف، تصميم |
| `contractor` | مقاولو البناء — مشاريع منجزة، تنفيذ |
| `realestate` | تطوير عقاري — وحدات، أسعار، غرف، حمامات |
| `interior` | ديكور داخلي — أعمال، ستايل |
| `photo` | تصوير — أعمال، بورتفوليو |
| `legal` | استشارات قانونية — خدمات، قضايا |
| `medical` | عيادات طبية — خدمات، تخصصات |
| `general` | متعدد الأنشطة |

---

## 16. ترتيب البناء (الأولوية)

> **اتبع هذا الترتيب حرفياً.** كل مرحلة تبني على ما قبلها.

### المرحلة 1 — البنية التحتية
1. أنشئ مشروع Next.js 14 (App Router + TypeScript)
2. أنشئ مشروع Supabase
3. شغّل سكيما قاعدة البيانات بالكامل + RLS policies + triggers + indexes
4. أنشئ helper functions (`is_admin()`, etc.)
5. أنشئ Supabase Storage bucket `tenants` مع السياسات
6. شغّل migrations كملف واحد قابل لإعادة التشغيل

### المرحلة 2 — Middleware والتوجيه
1. اكتب `middleware.ts` للتوجيه متعدد المستأجرين
2. اكتب middleware ثاني لحماية `/admin/*`
3. اختبر مع subdomain محلي (e.g. `localhost:3000` + `test.localhost:3000`)
4. أضف صفحة `/expired` للمكاتب المنتهية

### المرحلة 3 — الـ Public Pages
1. Landing page (مرجع: `src/views/landing.jsx`)
2. Login page (مرجع: `src/views/auth.jsx`) + Supabase Auth wiring
3. صفحة 404 للمكاتب الموقوفة

### المرحلة 4 — داشبورد المكتب
الترتيب الداخلي:
1. Shell + sidebar (مرجع: `src/views/tenant.jsx` → `TenantShell`)
2. الرئيسية (`TenantHome`)
3. المعلومات الأساسية (`TenantInfo`) + رفع الشعار/الغلاف
4. المشاريع (`TenantProjects`) — هذا الأهم؛ يتضمن DnD + رفع متعدد للصور
5. الخدمات والمميزات
6. الإحصاءات / الشهادات / الأسئلة
7. القالب
8. الدومين
9. الاشتراك
10. التحليلات

### المرحلة 5 — موقع المكتب العام (Public Site)
1. ابدأ بقالب Modern (مرجع: `src/views/publicSite.jsx` → `TplModern`)
2. ثم Classic, Heritage, Minimal, Luxury, Studio (كلها في `src/views/templates/`)
3. كل قالب يستهلك نفس البيانات من قاعدة البيانات
4. أضف صفحات `/projects` و `/projects/[id]` و `/contact`
5. زر واتساب العائم

### المرحلة 6 — داشبورد الأدمن
1. Shell (مرجع: `src/views/admin.jsx` → `AdminShell`)
2. الرئيسية + إحصائيات
3. إدارة المكاتب (الجدول + الفلترة)
4. إنشاء مكتب جديد (Server Action ينشئ Auth user + tenant + tenant_users + log + إيميل)
5. تفاصيل المكتب + إجراءات الاشتراك
6. إعدادات المنصة

### المرحلة 7 — الإيميلات
1. أنشئ قوالب Resend (6 قوالب) بالعربي + RTL
2. اربطها بالـ Server Actions
3. أضف Cron job يومي (Vercel Cron) للتذكيرات (30 و 7 أيام)

### المرحلة 8 — التحليلات وتتبع الزوار
1. أضف tracking endpoint يستقبل من middleware
2. لوحة تحليلات المكتب
3. لوحة تحليلات الأدمن

### المرحلة 9 — محرر القوالب المرئي
**الأكثر تعقيداً — يُبنى أخيراً.**
1. CRUD للقوالب المخصصة (`/admin/templates`)
2. المحرر المرئي (مرجع: `src/views/themeBuilder.jsx`)
3. ربط رؤية القالب بمكاتب محددة (`custom_theme_tenants`)
4. رفع قالب من ZIP (إن طُلب)

### المرحلة 10 — النشر
1. ربط Vercel بالمستودع
2. ضبط Wildcard Domain `*.wujood.sa`
3. ضبط الـ Custom Domains (verify CNAME من داشبورد المكتب)
4. اختبار end-to-end على Production

---

## 17. معايير القبول

### وظيفياً
- [ ] أدمن يُنشئ مكتب جديد → إيميل ترحيب يصل خلال دقائق
- [ ] صاحب المكتب يدخل → يرى داشبورده فقط ولا يستطيع رؤية أي مكتب آخر (يتأكَّد بـ SQL مباشرة)
- [ ] صاحب المكتب يحاول رفع 11 مشروع في Basic → يُمنع
- [ ] صاحب المكتب يحاول رفع صورة 15MB → يُمنع
- [ ] subdomain يعمل (slug.wujood.sa يفتح موقع المكتب)
- [ ] دومين مخصص يعمل بعد CNAME verification
- [ ] انتهاء الاشتراك → الزائر يرى صفحة "انتهى الاشتراك"
- [ ] إيقاف الحساب → الزائر يرى 404

### أمنياً
- [ ] محاولة API direct call لمكتب آخر تُرفض بـ RLS
- [ ] غير الأدمن يحاول /admin → redirect لتسجيل الدخول
- [ ] Service role key ليس في أي client bundle
- [ ] كل الإدخالات validated بـ Zod في الـ Server Actions

### أداءً
- [ ] LCP < 1.5s على Slow 3G لموقع المكتب
- [ ] الصور بصيغة WebP مع `next/image` و responsive sizes
- [ ] داشبورد يفتح في أقل من 2s

### تجربة المستخدم
- [ ] كل النصوص بالعربي + RTL بدون مشاكل
- [ ] Toast notifications عند الحفظ والأخطاء
- [ ] Loading states في كل operation
- [ ] Empty states واضحة
- [ ] Confirmation modals للحذف
- [ ] Mobile dashboard: قائمة سفلية بدلاً من sidebar

---

## 18. خارج النطاق (لا تبني هذه إلا إذا طُلب صراحةً)

- نظام دفع إلكتروني (الدفع يدوي بالكامل عبر واتساب)
- تطبيق جوال
- نموذج تواصل داخل موقع المكتب (العملاء يتواصلون خارجياً)
- تحليلات متقدمة بإعلانات
- API عام للمطورين
- تبديل اللغة للزوار

---

## 19. ملاحظات أخيرة

- **استخدم الـ prototype مرجعاً بصرياً**، لكن لا تنسخ الكود حرفياً — أعد كتابته بـ TypeScript + Next.js patterns صحيحة.
- **القوالب** (`src/views/templates/`) أقرب لما تحتاجه نهائياً — Tailwind المجرد + بدون state معقد. انقلها بأقل تعديل.
- **الداشبوردات** أعد بناءها على shadcn — التصميم نفس الـ prototype لكن الـ components مختلفة.
- استخدم **Drizzle ORM** أو **Supabase JS client** للـ DB — اختر واحداً والتزم به.
- اكتب اختبارات لـ RLS باستخدام Postgres roles مختلفة في `vitest`.

> **عند الانتهاء، اعرض على المالك:** لقطات شاشة لكل صفحة في الإنتاج، تقرير اختبارات RLS، نسخة احتياطية كاملة من قاعدة البيانات.

— نهاية الـ Brief
