// Tenant Dashboard — داشبورد المكتب

const TenantShell = ({ children, page, setPage, go }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    { id: 'home', label: 'الرئيسية', icon: 'home' },
    { id: 'info', label: 'المعلومات الأساسية', icon: 'building' },
    { id: 'projects', label: 'المشاريع والأعمال', icon: 'briefcase', badge: DEMO_PROJECTS.length },
    { id: 'services', label: 'الخدمات والمميزات', icon: 'layers' },
    { id: 'stats', label: 'الإحصاءات', icon: 'bar' },
    { id: 'testimonials', label: 'شهادات العملاء', icon: 'star' },
    { id: 'faqs', label: 'الأسئلة الشائعة', icon: 'faq' },
    { id: 'theme', label: 'القالب', icon: 'palette' },
    { id: 'domain', label: 'الدومين', icon: 'globe' },
    { id: 'subscription', label: 'الاشتراك', icon: 'card' },
    { id: 'analytics', label: 'التحليلات', icon: 'trend' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        className="td-sidebar"
        style={{
          width: 260, flexShrink: 0,
          borderInlineStart: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: 16,
          display: 'flex', flexDirection: 'column', gap: 14,
          position: 'sticky', top: 0, height: '100vh',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={20} />
          <IconBtn icon="menu" size={32} title="القائمة" onClick={() => setMobileOpen(false)} className="td-mobile-close" />
        </div>

        {/* Tenant card */}
        <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={DEMO_TENANT.short_ar} size={36} bg="var(--primary)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{DEMO_TENANT.short_ar}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{DEMO_TENANT.subdomain}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <PlanPill plan={DEMO_TENANT.plan} />
            <a
              href={`#/site/${DEMO_TENANT.slug}`}
              target="_blank"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}
              onClick={(e) => { e.preventDefault(); window.open(`#/site/${DEMO_TENANT.slug}`, '_blank'); }}
            >
              زيارة الموقع {React.createElement(Icons.external, { size: 11 })}
            </a>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto', margin: '0 -4px', padding: '0 4px' }}>
          {nav.map(n => (
            <SideNavItem key={n.id} {...n} active={page === n.id} onClick={() => { setPage(n.id); setMobileOpen(false); }} />
          ))}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SideNavItem icon="user" label="عبدالله الفارابي" onClick={() => {}} />
          <SideNavItem icon="logout" label="تسجيل الخروج" onClick={() => go('#/')} />
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 60,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '0 26px',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <IconBtn icon="menu" size={36} className="td-mobile-toggle" onClick={() => setMobileOpen(true)} />
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 500 }}>
            {nav.find(n => n.id === page)?.label}
          </h2>
          <div style={{ flex: 1 }}></div>
          <div style={{ flexShrink: 0, fontSize: 12, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }} className="td-status">
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }}></span>
            موقع منشور · آخر تحديث قبل 12 دقيقة
          </div>
          <IconBtn icon="bell" />
          <Avatar name="عبدالله الفارابي" size={32} />
        </header>

        <div style={{ padding: '26px 28px 60px', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 980px) {
          .td-sidebar {
            position: fixed !important;
            insetInlineStart: 0; top: 0; bottom: 0;
            z-index: 100;
            transform: translateX(${mobileOpen ? '0' : '100%'});
            transition: transform .2s ease;
          }
          .td-mobile-toggle { display: inline-flex !important; }
        }
        @media (min-width: 981px) {
          .td-mobile-toggle, .td-mobile-close { display: none !important; }
        }
        @media (max-width: 720px) {
          .td-status { display: none !important; }
        }
      `}</style>
    </div>
  );
};

// === Page: Home ===
const TenantHome = ({ go, setPage }) => {
  const t = DEMO_TENANT;
  const days = daysUntil(t.ends_at);
  return (
    <>
      <SectionHeader
        title={`أهلاً، ${t.short_ar}`}
        sub={`اشتراكك ينتهي بعد ${days} يوم — ${fmtDate(t.ends_at)}`}
        action={<Btn kind="primary" icon="external" onClick={() => window.open(`#/site/${t.slug}`, '_blank')}>زيارة موقعي</Btn>}
      />

      {days <= 30 && (
        <div style={{ marginBottom: 18 }}>
          <Alert tone="warn" icon="warn" title="اشتراكك يقارب الانتهاء" action={<Btn kind="accent" size="sm" icon="whatsapp" onClick={() => window.open('https://wa.me/966500000000','_blank')}>تجديد</Btn>}>
            تواصل معنا على واتساب لتجديد اشتراكك قبل الانتهاء وتفادي توقف الموقع.
          </Alert>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }} className="td-stats">
        <StatCard label="المشاريع المنشورة" value={DEMO_PROJECTS.length} suffix={`/ ${PLANS[t.plan].projects === Infinity ? '∞' : PLANS[t.plan].projects}`} icon="briefcase" />
        <StatCard label="القالب الحالي" value="Modern" icon="palette" hint="آخر تغيير قبل 5 أيام" />
        <StatCard label="حالة الاشتراك" value={t.active ? 'نشط' : 'موقوف'} icon="shield" tone="gold" hint={PLANS[t.plan].labelAr} />
        <StatCard label="أيام متبقية" value={days} suffix="يوم" icon="clock" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }} className="td-home-grid">
        <Card>
          <SectionHeader title="نظرة سريعة على الموقع" sub="آخر النشاط على موقعك خلال 30 يوماً" />
          <MiniChart />
          <hr className="wj-hr" style={{ margin: '20px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'إجمالي الزيارات', value: '1,847', icon: 'eye' },
              { label: 'مشاهدات المشاريع', value: '623', icon: 'briefcase' },
              { label: 'ضغطات الواتساب', value: '94', icon: 'whatsapp' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-alt)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  {React.createElement(Icons[s.icon], { size: 16 })}
                </span>
                <div>
                  <div className="mono" style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>الخطوات التالية</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { done: true, label: 'إعداد المعلومات الأساسية' },
                { done: true, label: 'رفع الشعار وصورة الغلاف' },
                { done: true, label: 'إضافة 5 مشاريع على الأقل' },
                { done: false, label: 'إضافة شهادات العملاء', click: 'testimonials' },
                { done: false, label: 'ضبط الأسئلة الشائعة', click: 'faqs' },
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => s.click && setPage(s.click)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 0',
                    textAlign: 'right',
                    color: s.done ? 'var(--muted)' : 'var(--ink)',
                    textDecoration: s.done ? 'line-through' : 'none',
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: s.done ? 'var(--primary)' : 'var(--bg-alt)',
                    color: s.done ? '#fff' : 'var(--muted)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    border: s.done ? 'none' : '1px solid var(--border-strong)',
                  }}>{s.done && React.createElement(Icons.check, { size: 12 })}</span>
                  <span style={{ fontSize: 13.5, flex: 1 }}>{s.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>روابط موقعك</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <LinkRow label="Subdomain" value={t.subdomain} />
              <LinkRow label="دومين مخصص" value={t.custom_domain} verified />
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .td-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .td-home-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

const LinkRow = ({ label, value, verified }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--bg-alt)', borderRadius: 8, fontSize: 13 }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</div>
      <div className="mono" style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    </div>
    {verified && <Badge tone="green" dot>متحقق</Badge>}
    <IconBtn icon="copy" size={28} title="نسخ" />
  </div>
);

const MiniChart = () => {
  const data = [30, 42, 35, 58, 48, 65, 72, 60, 78, 85, 76, 92, 88, 95, 102, 89, 110, 124, 118, 105, 134, 142, 128, 156, 148, 162, 175, 168, 184, 190];
  const max = Math.max(...data);
  return (
    <svg viewBox="0 0 320 100" preserveAspectRatio="none" style={{ width: '100%', height: 110 }}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e3b2e" stopOpacity=".18" />
          <stop offset="100%" stopColor="#0e3b2e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${100 - (data[0] / max) * 90} ${data.map((v, i) => `L${(i / (data.length - 1)) * 320},${100 - (v / max) * 90}`).join(' ')} L320,100 L0,100 Z`}
        fill="url(#g1)"
      />
      <path
        d={`M0,${100 - (data[0] / max) * 90} ${data.map((v, i) => `L${(i / (data.length - 1)) * 320},${100 - (v / max) * 90}`).join(' ')}`}
        fill="none" stroke="#0e3b2e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
};

// === Page: Basic Info ===
const TenantInfo = () => {
  const [t, setT] = useState(DEMO_TENANT);
  const [saved, setSaved] = useState(false);
  const upd = (k, v) => setT({ ...t, [k]: v });

  return (
    <>
      <SectionHeader
        title="المعلومات الأساسية"
        sub="هذه البيانات تظهر على موقعك مباشرة. اضغط حفظ بعد التعديل."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" icon="refresh">إلغاء</Btn>
            <Btn kind="primary" icon="check" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}>حفظ التغييرات</Btn>
          </div>
        }
      />

      {saved && (
        <div style={{ marginBottom: 14 }}>
          <Alert tone="success" icon="check" title="تم الحفظ">سيظهر التحديث على موقعك خلال ثوانٍ.</Alert>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, alignItems: 'flex-start' }} className="info-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Brand */}
          <Card>
            <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>الهوية البصرية</h3>
            <p style={{ margin: '0 0 18px', fontSize: 13, color: 'var(--muted)' }}>الشعار وصورة الغلاف اللي تظهر في موقعك.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
              <UploadSlot label="الشعار" hint="PNG/SVG · 2MB كحد أقصى" ratio="1/1" />
              <UploadSlot label="صورة الغلاف" hint="JPG/WebP · 5MB كحد أقصى" ratio="16/9" />
            </div>
            <hr className="wj-hr" style={{ margin: '18px 0' }} />
            <Field label="رابط الفيديو التعريفي (اختياري)" hint="رابط من يوتيوب أو فيمو يظهر في قسم 'من نحن'">
              <Input dir="ltr" style={{ textAlign: 'left' }} placeholder="https://youtube.com/watch?v=..." />
            </Field>
          </Card>

          {/* Names */}
          <Card>
            <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>الاسم والنبذة</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="الاسم بالعربي *">
                <Input value={t.name_ar} onChange={(e) => upd('name_ar', e.target.value)} />
              </Field>
              <Field label="الاسم بالإنجليزي">
                <Input value={t.name_en} onChange={(e) => upd('name_en', e.target.value)} dir="ltr" style={{ textAlign: 'left' }} />
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="النبذة التعريفية (عربي)" hint={`${t.about_ar.length} / 600 حرف`}>
                <Textarea value={t.about_ar} onChange={(e) => upd('about_ar', e.target.value)} rows={4} />
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="النبذة التعريفية (English)">
                <Textarea value={t.about_en} onChange={(e) => upd('about_en', e.target.value)} dir="ltr" style={{ textAlign: 'left' }} rows={3} />
              </Field>
            </div>
          </Card>

          {/* Contact */}
          <Card>
            <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>التواصل</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="رقم الهاتف">
                <Input value={t.phone} onChange={(e) => upd('phone', e.target.value)} dir="ltr" style={{ textAlign: 'left' }} />
              </Field>
              <Field label="رقم واتساب">
                <Input value={t.whatsapp} onChange={(e) => upd('whatsapp', e.target.value)} dir="ltr" style={{ textAlign: 'left' }} />
              </Field>
              <Field label="البريد الإلكتروني للعرض" hint="غير بريد الدخول">
                <Input value={t.email} onChange={(e) => upd('email', e.target.value)} dir="ltr" style={{ textAlign: 'left' }} />
              </Field>
              <Field label="ملاحظة واتساب" hint="تظهر في رسالة الواتساب الجاهزة">
                <Input placeholder="مرحباً، أود الاستفسار عن خدماتكم..." />
              </Field>
              <Field label="العنوان">
                <Input value={t.address_ar} onChange={(e) => upd('address_ar', e.target.value)} />
              </Field>
              <Field label="رابط Google Maps">
                <Input dir="ltr" placeholder="https://maps.google.com/..." style={{ textAlign: 'left' }} />
              </Field>
            </div>
          </Card>

          {/* Social */}
          <Card>
            <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>السوشيال ميديا</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                { k: 'instagram', l: 'إنستقرام', ic: 'instagram' },
                { k: 'twitter', l: 'تويتر / X', ic: 'twitter' },
                { k: 'linkedin', l: 'لينكدإن', ic: 'linkedin' },
                { k: 'snapchat', l: 'سناب شات', ic: 'snapchat' },
                { k: 'tiktok', l: 'تيك توك', ic: 'tiktok' },
              ].map(s => (
                <div key={s.k} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 10, border: '1px solid var(--border)', borderRadius: 10 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--bg-alt)', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {React.createElement(Icons[s.ic], { size: 14 })}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 60 }}>{s.l}</span>
                  <input
                    className="wj-input sm"
                    style={{ flex: 1, textAlign: 'left' }}
                    dir="ltr"
                    placeholder="@username"
                    value={t.social?.[s.k] || ''}
                    onChange={(e) => upd('social', { ...t.social, [s.k]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: live preview */}
        <div style={{ position: 'sticky', top: 80 }} className="info-aside">
          <Card pad={false}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>معاينة مصغّرة</span>
              <span style={{ marginInlineStart: 'auto' }}><Badge tone="green" dot>مباشر</Badge></span>
            </div>
            <div style={{ padding: 14 }}>
              <ProjectCover seed={2} h={120} radius={8} />
              <div style={{ marginTop: 12 }}>
                <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>{t.short_ar}</h4>
                <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
                  {t.about_ar.slice(0, 130)}...
                </p>
              </div>
              <div style={{ marginTop: 12, padding: 10, background: 'var(--bg-alt)', borderRadius: 8, fontSize: 11.5, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span>📞 {t.phone}</span>
                <span>✉ {t.email}</span>
                <span>📍 {t.address_ar}</span>
              </div>
            </div>
          </Card>
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 12 }}>التغييرات تظهر على موقعك مباشرة بعد الحفظ.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .info-grid { grid-template-columns: 1fr !important; }
          .info-aside { position: static !important; }
        }
      `}</style>
    </>
  );
};

const UploadSlot = ({ label, hint, ratio = '1/1' }) => (
  <Field label={label} hint={hint}>
    <div style={{
      aspectRatio: ratio,
      border: '1.5px dashed var(--border-strong)',
      borderRadius: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
      background: 'var(--bg-alt)',
      cursor: 'pointer',
      transition: 'all .15s',
      color: 'var(--muted)',
    }}>
      {React.createElement(Icons.upload, { size: 22 })}
      <span style={{ fontSize: 12 }}>اسحب صورة أو اضغط للرفع</span>
    </div>
  </Field>
);

// === Page: Projects ===
const TenantProjects = () => {
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid'); // grid | list
  const [editing, setEditing] = useState(null);

  const filtered = projects.filter(p => {
    if (filter !== 'all' && p.category !== filter) return false;
    if (search && !p.title_ar.includes(search)) return false;
    return true;
  });

  const cats = ['all', ...new Set(projects.map(p => p.category))];
  const planLimit = PLANS[DEMO_TENANT.plan].projects;
  const usedPct = planLimit === Infinity ? 0 : (projects.length / planLimit) * 100;

  return (
    <>
      <SectionHeader
        title="المشاريع والأعمال"
        sub={`${projects.length} ${planLimit === Infinity ? 'مشروع منشور — غير محدود' : `من ${planLimit} مسموح به في باقتك`}`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" icon="download">تصدير</Btn>
            <Btn kind="primary" icon="plus" onClick={() => setEditing({})}>إضافة مشروع</Btn>
          </div>
        }
      />

      {planLimit !== Infinity && (
        <div style={{ marginBottom: 18, padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--ink-soft)', flexShrink: 0 }}>استخدام الباقة</span>
          <div style={{ flex: 1, height: 6, background: 'var(--bg-alt)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${usedPct}%`, background: usedPct > 80 ? 'var(--warn)' : 'var(--primary)', borderRadius: 999, transition: 'width .3s' }}></div>
          </div>
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{projects.length} / {planLimit}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}><SearchInput value={search} onChange={setSearch} placeholder="بحث في المشاريع..." /></div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 160 }}>
          {cats.map(c => <option key={c} value={c}>{c === 'all' ? 'كل التصنيفات' : c}</option>)}
        </Select>
        <div style={{ display: 'inline-flex', gap: 2, padding: 3, background: 'var(--bg-alt)', borderRadius: 8 }}>
          <button onClick={() => setView('grid')} style={{ padding: '6px 10px', borderRadius: 6, background: view === 'grid' ? 'var(--surface)' : 'transparent', color: view === 'grid' ? 'var(--ink)' : 'var(--muted)' }}>
            {React.createElement(Icons.grid, { size: 15 })}
          </button>
          <button onClick={() => setView('list')} style={{ padding: '6px 10px', borderRadius: 6, background: view === 'list' ? 'var(--surface)' : 'transparent', color: view === 'list' ? 'var(--ink)' : 'var(--muted)' }}>
            {React.createElement(Icons.list, { size: 15 })}
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="proj-grid">
          {filtered.map(p => (
            <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all .2s' }}>
              <div style={{ position: 'relative' }}>
                <ProjectCover seed={p.cover_seed} label={p.title_ar} h={150} radius={0} />
                {p.featured && (
                  <span style={{ position: 'absolute', top: 10, insetInlineStart: 10, padding: '4px 8px', background: 'rgba(255,255,255,.95)', color: 'var(--accent)', borderRadius: 6, fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {React.createElement(Icons.star, { size: 11 })} مميّز
                  </span>
                )}
              </div>
              <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <Badge>{p.category}</Badge>
                  <Badge>{p.year}</Badge>
                </div>
                <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>{p.title_ar}</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', flex: 1 }}>{p.location}</p>
                <div style={{ display: 'flex', gap: 4, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <Btn kind="ghost" size="sm" icon="edit" onClick={() => setEditing(p)}>تعديل</Btn>
                  <Btn kind="ghost" size="sm" icon="eye">معاينة</Btn>
                  <span style={{ marginInlineStart: 'auto' }}><IconBtn icon="drag" size={28} title="ترتيب" /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card pad={false}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-alt)' }}>
              <tr>
                {['', 'العنوان', 'التصنيف', 'الموقع', 'السنة', 'مميّز', ''].map((h, i) => (
                  <th key={i} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, color: 'var(--muted)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ width: 48, height: 36, borderRadius: 5, overflow: 'hidden' }}>
                      <ProjectCover seed={p.cover_seed} h={36} radius={5} />
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13.5, fontWeight: 500 }}>{p.title_ar}</td>
                  <td style={{ padding: '10px 14px' }}><Badge>{p.category}</Badge></td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--muted)' }}>{p.location}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }} className="mono">{p.year}</td>
                  <td style={{ padding: '10px 14px' }}>{p.featured && <span style={{ color: 'var(--accent)' }}>{React.createElement(Icons.star, { size: 15 })}</span>}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      <IconBtn icon="edit" size={28} title="تعديل" onClick={() => setEditing(p)} />
                      <IconBtn icon="trash" size={28} title="حذف" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        width={760}
        footer={
          <>
            <Btn kind="primary" icon="check" onClick={() => setEditing(null)}>حفظ</Btn>
            <Btn kind="ghost" onClick={() => setEditing(null)}>إلغاء</Btn>
            <div style={{ marginInlineStart: 'auto' }}>
              {editing?.id && <Btn kind="danger" icon="trash">حذف</Btn>}
            </div>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="العنوان (عربي) *"><Input defaultValue={editing?.title_ar} /></Field>
          <Field label="العنوان (English)"><Input defaultValue={editing?.title_en} dir="ltr" style={{ textAlign: 'left' }} /></Field>
          <Field label="التصنيف">
            <Select defaultValue={editing?.category}>
              <option>سكني</option><option>تجاري</option><option>تعليمي</option><option>صحي</option><option>ديني</option><option>حكومي</option><option>صناعي</option>
            </Select>
          </Field>
          <Field label="الموقع"><Input defaultValue={editing?.location} /></Field>
          <Field label="السنة"><Input type="number" defaultValue={editing?.year} className="mono" style={{ fontFamily: 'var(--font-mono)' }} /></Field>
          <Field label="الحالة">
            <Select defaultValue={editing?.status}>
              <option>تحت الإنشاء</option><option>مكتمل</option><option>للبيع</option>
            </Select>
          </Field>
        </div>
        <div style={{ marginTop: 14 }}>
          <Field label="الوصف"><Textarea rows={3} defaultValue={editing?.title_ar ? `${editing.title_ar} - مشروع متميز...` : ''} /></Field>
        </div>
        <div style={{ marginTop: 14, padding: 14, background: 'var(--bg-alt)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>مشروع مميّز</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>يظهر في الصفحة الرئيسية</div>
          </div>
          <Toggle on={editing?.featured} onChange={() => {}} />
        </div>
        <div style={{ marginTop: 14 }}>
          <Field label="معرض الصور" hint="حد أقصى 20 صورة، 10MB لكل صورة">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[1, 2, 3].map(i => <EmptyImg key={i} label={`صورة ${i}`} h={90} radius={8} />)}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 90, border: '1.5px dashed var(--border-strong)', borderRadius: 8, color: 'var(--muted)', cursor: 'pointer' }}>
                {React.createElement(Icons.plus, { size: 22 })}
              </div>
            </div>
          </Field>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 980px) { .proj-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .proj-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
};

// === Page: Services & Features ===
const TenantServices = () => {
  const [items, setItems] = useState([...DEMO_SERVICES, ...DEMO_FEATURES]);
  const [tab, setTab] = useState('service');
  const filtered = items.filter(x => x.type === tab);

  return (
    <>
      <SectionHeader
        title="الخدمات والمميزات"
        sub="إدارة الخدمات اللي يقدمها مكتبك والنقاط التنافسية اللي تميّزه."
      />
      <TabBar
        tabs={[
          { id: 'service', label: 'الخدمات', icon: 'briefcase' },
          { id: 'feature', label: 'المميزات', icon: 'sparkles' },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <Btn kind="primary" icon="plus">إضافة {tab === 'service' ? 'خدمة' : 'ميزة'}</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }} className="srv-grid">
        {filtered.map(s => (
          <Card key={s.id}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.createElement(Icons[s.icon] || Icons.cube, { size: 20 })}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>{s.title}</h4>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                <Toggle on={s.published} onChange={(v) => setItems(items.map(x => x.id === s.id ? { ...x, published: v } : x))} />
                <div style={{ display: 'flex', gap: 2 }}>
                  <IconBtn icon="edit" size={26} />
                  <IconBtn icon="drag" size={26} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <style>{`@media (max-width: 720px) { .srv-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
};

// === Page: Stats ===
const TenantStats = () => {
  const [stats, setStats] = useState(DEMO_STATS);
  return (
    <>
      <SectionHeader title="الإحصاءات" sub="الأرقام اللي تظهر في قسم 'من نحن' على موقعك." action={<Btn kind="primary" icon="plus">إضافة رقم</Btn>} />
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.map((s, i) => (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '24px 90px 60px 1fr 80px', gap: 12, alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--muted)', cursor: 'grab' }}>{React.createElement(Icons.drag, { size: 16 })}</span>
              <Input className="wj-input sm mono" defaultValue={s.value} />
              <Input className="wj-input sm" defaultValue={s.suffix} placeholder="+" />
              <Input className="wj-input sm" defaultValue={s.label} />
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IconBtn icon="edit" size={26} />
                <IconBtn icon="trash" size={26} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

// === Page: Testimonials ===
const TenantTestimonials = () => (
  <>
    <SectionHeader title="شهادات العملاء" sub="آراء عملائك اللي تظهر على موقعك." action={<Btn kind="primary" icon="plus">إضافة شهادة</Btn>} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }} className="srv-grid">
      {DEMO_TESTIMONIALS.map(t => (
        <Card key={t.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Avatar name={t.name} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.role}</div>
              </div>
            </div>
            <Toggle on={t.published} onChange={() => {}} />
          </div>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < t.rating ? 'var(--accent)' : 'var(--border)' }}>{React.createElement(Icons.star, { size: 14 })}</span>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.65 }}>"{t.text}"</p>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
            <IconBtn icon="edit" size={28} />
            <IconBtn icon="trash" size={28} />
          </div>
        </Card>
      ))}
    </div>
  </>
);

// === Page: FAQs ===
const TenantFaqs = () => {
  const [open, setOpen] = useState('q1');
  return (
    <>
      <SectionHeader title="الأسئلة الشائعة" sub="الأسئلة اللي يكررها زوار موقعك." action={<Btn kind="primary" icon="plus">إضافة سؤال</Btn>} />
      <Card pad={false}>
        {DEMO_FAQS.map((q, i) => (
          <div key={q.id} style={{ borderBottom: i < DEMO_FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <button
              onClick={() => setOpen(open === q.id ? null : q.id)}
              style={{ width: '100%', textAlign: 'right', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span style={{ color: 'var(--muted)' }}>{React.createElement(Icons.drag, { size: 14 })}</span>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 14.5 }}>{q.q}</span>
              <Toggle on={q.published} onChange={() => {}} />
              <span style={{ transform: open === q.id ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'var(--muted)' }}>
                {React.createElement(Icons.chevronDown, { size: 16 })}
              </span>
            </button>
            {open === q.id && (
              <div style={{ padding: '0 20px 16px 56px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Textarea defaultValue={q.a} rows={3} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn kind="primary" size="sm">حفظ</Btn>
                  <Btn kind="danger" size="sm" icon="trash">حذف</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </Card>
    </>
  );
};

// === Page: Theme picker ===
const TenantTheme = () => {
  const [active, setActive] = useState('modern');
  const t = DEMO_TENANT;
  const themes = [
    { id: 'modern', name: 'Modern', desc: 'أبيض نظيف + accent', plan: 'basic', colors: ['#ffffff', '#0e3b2e', '#b08a3e'] },
    { id: 'classic', name: 'Classic', desc: 'كريمي + بني', plan: 'pro', colors: ['#f6efe3', '#5a3e2b', '#c69749'] },
    { id: 'bold', name: 'Bold', desc: 'أسود + أحمر', plan: 'pro', colors: ['#0a0a0a', '#ff3b30', '#fafafa'] },
    { id: 'minimal', name: 'Minimal', desc: 'مساحات بيضاء', plan: 'pro', colors: ['#fafafa', '#1a1a1a', '#888'] },
    { id: 'luxury', name: 'Luxury', desc: 'أسود + ذهبي', plan: 'pro', colors: ['#0a0a0a', '#d4a85a', '#f4ecd8'] },
  ];
  return (
    <>
      <SectionHeader title="اختيار القالب" sub="تغيير القالب فوري بدون فقدان أي بيانات." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="tmpl-grid">
        {themes.map(th => {
          const locked = t.plan === 'basic' && th.plan !== 'basic';
          return (
            <button
              key={th.id}
              onClick={() => !locked && setActive(th.id)}
              disabled={locked}
              style={{
                textAlign: 'right',
                background: 'var(--surface)',
                border: `2px solid ${active === th.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                position: 'relative',
                opacity: locked ? 0.6 : 1,
                cursor: locked ? 'not-allowed' : 'pointer',
              }}
            >
              <div style={{ aspectRatio: '4/3', background: th.colors[0], padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: th.colors[1], opacity: .8 }}>{th.id === 'bold' || th.id === 'luxury' ? 'STUDIO' : 'استوديو'}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: th.colors[1], fontFamily: th.id === 'classic' || th.id === 'luxury' ? 'serif' : 'inherit' }}>مكتب{th.id === 'bold' && '.'}</div>
                  <div style={{ height: 4, background: th.colors[2], width: '50%', marginTop: 8, borderRadius: th.id === 'bold' ? 0 : 2 }}></div>
                </div>
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {th.name}
                    {active === th.id && <Badge tone="green" dot>الحالي</Badge>}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{th.desc}</div>
                </div>
                {locked && <Badge tone="gold">{PLANS[th.plan].labelAr}</Badge>}
              </div>
            </button>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 980px) { .tmpl-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .tmpl-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
};

// === Page: Domain ===
const TenantDomain = () => {
  const t = DEMO_TENANT;
  const isPrem = t.plan === 'premium';
  const [verified, setVerified] = useState(true);
  return (
    <>
      <SectionHeader title="الدومين" sub="رابط موقعك على الإنترنت." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="dom-grid">
        <Card>
          <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontSize: 16 }}>Subdomain (مجاني)</h3>
          <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, flex: 1 }}>{t.subdomain}</span>
            <Badge tone="green" dot>نشط</Badge>
            <IconBtn icon="copy" />
            <IconBtn icon="external" onClick={() => window.open(`#/site/${t.slug}`, '_blank')} />
          </div>
          <p style={{ marginTop: 12, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
            هذا الرابط متاح لجميع الباقات وغير قابل للتغيير بعد الإنشاء (لأن تغييره يكسر روابطك القديمة).
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16 }}>دومين مخصص</h3>
            <Badge tone="gold">Premium</Badge>
          </div>
          {!isPrem ? (
            <Alert tone="info" title="غير متاح في باقتك">
              الدومين المخصص (مثل moktab.com) متاح في باقة Premium فقط. <a href="#" style={{ color: 'var(--primary)' }}>الترقية</a>
            </Alert>
          ) : (
            <>
              <Field label="الدومين المخصص">
                <Input defaultValue={t.custom_domain} dir="ltr" style={{ textAlign: 'left' }} />
              </Field>
              <div style={{ marginTop: 12, padding: 12, background: 'var(--bg)', borderRadius: 10, fontSize: 12.5, fontFamily: 'var(--font-mono)' }}>
                <div style={{ color: 'var(--muted)', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>أضف هذا السجل في إعدادات DNS لديك:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 6 }}>
                  <span style={{ color: 'var(--muted)' }}>Type</span><span>CNAME</span>
                  <span style={{ color: 'var(--muted)' }}>Name</span><span>@ (root)</span>
                  <span style={{ color: 'var(--muted)' }}>Value</span><span>cname.wujood.sa</span>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                {verified ? <Badge tone="green" dot>تم التحقق</Badge> : <Badge tone="amber" dot>قيد الانتظار</Badge>}
                <Btn kind="secondary" size="sm" icon="refresh">إعادة الفحص</Btn>
              </div>
            </>
          )}
        </Card>
      </div>
      <style>{`@media (max-width: 880px) { .dom-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
};

// === Page: Subscription ===
const TenantSubscription = () => {
  const t = DEMO_TENANT;
  const days = daysUntil(t.ends_at);
  return (
    <>
      <SectionHeader title="الاشتراك" sub="حالة باقتك وسجل التجديدات." />
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 18 }} className="sub-grid">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '.08em' }}>الباقة الحالية</div>
              <h2 style={{ margin: '4px 0', fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600 }}>{PLANS[t.plan].labelAr}</h2>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}><span className="mono">{fmtSAR(PLANS[t.plan].priceY)}</span> ريال / سنة</div>
            </div>
            <PlanPill plan={t.plan} />
          </div>
          <hr className="wj-hr" style={{ margin: '20px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <InfoRow label="ينتهي بتاريخ" value={fmtDate(t.ends_at)} />
            <InfoRow label="آخر تجديد" value={fmtDate(t.starts_at)} />
            <InfoRow label="الأيام المتبقية" value={`${days} يوم`} />
            <InfoRow label="حالة الاشتراك" value={t.active ? 'نشط' : 'موقوف'} />
          </div>
          <hr className="wj-hr" style={{ margin: '20px 0' }} />
          <Alert tone="warn" icon="info" title="للتجديد أو الترقية">
            تواصل معنا على واتساب وسنُحدّث اشتراكك خلال 24 ساعة بعد التحويل.
            <div style={{ marginTop: 10 }}>
              <Btn kind="accent" icon="whatsapp" onClick={() => window.open('https://wa.me/966500000000','_blank')}>تجديد عبر واتساب</Btn>
            </div>
          </Alert>
        </Card>
        <Card>
          <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontSize: 16 }}>مميزات باقتك</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              `${PLANS[t.plan].projects === Infinity ? 'مشاريع غير محدودة' : PLANS[t.plan].projects + ' مشروع'}`,
              `${PLANS[t.plan].storage} تخزين`,
              PLANS[t.plan].templates,
              PLANS[t.plan].custom_domain ? 'دومين مستقل' : 'subdomain فقط',
              'دعم فني عبر واتساب',
              'تحليلات أساسية',
            ].map((x, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5 }}>
                <span style={{ color: 'var(--primary)' }}>{React.createElement(Icons.check, { size: 16 })}</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card pad={false}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16 }}>سجل الاشتراكات</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-alt)' }}>
            <tr>{['التاريخ', 'الإجراء', 'الباقة', 'المبلغ', 'الملاحظة'].map(h => (
              <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {SUBSCRIPTION_LOG.map(l => (
              <tr key={l.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{l.at}</td>
                <td style={{ padding: '12px 14px', fontSize: 13.5, fontWeight: 500 }}>{l.action}</td>
                <td style={{ padding: '12px 14px' }}><PlanPill plan={l.plan} /></td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmtSAR(l.amount)} ريال</td>
                <td style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--muted)' }}>{l.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <style>{`@media (max-width: 880px) { .sub-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '.05em' }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 3 }}>{value}</div>
  </div>
);

// === Page: Analytics ===
const TenantAnalytics = () => (
  <>
    <SectionHeader title="التحليلات" sub="إحصاءات زوار موقعك خلال آخر 30 يوماً." action={
      <Select defaultValue="30"><option value="7">آخر 7 أيام</option><option value="30">آخر 30 يوم</option><option value="90">آخر 90 يوم</option></Select>
    } />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }} className="td-stats">
      <StatCard label="إجمالي الزيارات" value="1,847" icon="eye" hint="+23% عن الفترة السابقة" />
      <StatCard label="زوار فريدون" value="1,124" icon="users" />
      <StatCard label="مشاهدات الصفحات" value="4,632" icon="layers" />
      <StatCard label="متوسط مدة الزيارة" value="2:47" icon="clock" tone="gold" />
    </div>
    <Card>
      <SectionHeader title="الزيارات عبر الزمن" sub="" />
      <MiniChart />
    </Card>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 14 }} className="an-grid">
      <Card>
        <h4 style={{ margin: '0 0 12px', fontFamily: 'var(--font-display)', fontSize: 15 }}>أكثر الصفحات زيارة</h4>
        {[
          { p: '/ (الرئيسية)', c: 1247 },
          { p: '/projects', c: 893 },
          { p: '/projects/al-waha', c: 412 },
          { p: '/contact', c: 287 },
          { p: '/projects/nakheel-tower', c: 198 },
        ].map(x => (
          <div key={x.p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid var(--border)', fontSize: 13 }}>
            <span style={{ flex: 1, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>{x.p}</span>
            <span className="mono" style={{ color: 'var(--muted)' }}>{x.c.toLocaleString('en-US')}</span>
          </div>
        ))}
      </Card>
      <Card>
        <h4 style={{ margin: '0 0 12px', fontFamily: 'var(--font-display)', fontSize: 15 }}>الأجهزة</h4>
        {[
          { d: 'الجوال', p: 68, c: '1,256' },
          { d: 'سطح المكتب', p: 24, c: '443' },
          { d: 'التابلت', p: 8, c: '148' },
        ].map(x => (
          <div key={x.d} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>{x.d}</span>
              <span className="mono" style={{ color: 'var(--muted)' }}>{x.p}% — {x.c}</span>
            </div>
            <div style={{ height: 5, background: 'var(--bg-alt)', borderRadius: 999 }}>
              <div style={{ height: '100%', width: `${x.p}%`, background: 'var(--primary)', borderRadius: 999 }}></div>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <h4 style={{ margin: '0 0 12px', fontFamily: 'var(--font-display)', fontSize: 15 }}>مصادر الزيارات</h4>
        {[
          { s: 'Google', c: 854, p: 46 },
          { s: 'مباشر', c: 412, p: 22 },
          { s: 'Instagram', c: 287, p: 16 },
          { s: 'WhatsApp', c: 178, p: 10 },
          { s: 'أخرى', c: 116, p: 6 },
        ].map(x => (
          <div key={x.s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid var(--border)', fontSize: 13 }}>
            <span style={{ flex: 1 }}>{x.s}</span>
            <span className="mono" style={{ color: 'var(--muted)', fontSize: 12 }}>{x.p}%</span>
            <span className="mono" style={{ minWidth: 40, textAlign: 'left' }}>{x.c}</span>
          </div>
        ))}
      </Card>
    </div>
    <style>{`@media (max-width: 980px) { .an-grid { grid-template-columns: 1fr !important; } }`}</style>
  </>
);

// === Main Tenant component ===
const Tenant = ({ go }) => {
  const [page, setPage] = useState('home');
  const map = {
    home: <TenantHome go={go} setPage={setPage} />,
    info: <TenantInfo />,
    projects: <TenantProjects />,
    services: <TenantServices />,
    stats: <TenantStats />,
    testimonials: <TenantTestimonials />,
    faqs: <TenantFaqs />,
    theme: <TenantTheme />,
    domain: <TenantDomain />,
    subscription: <TenantSubscription />,
    analytics: <TenantAnalytics />,
  };
  return <TenantShell page={page} setPage={setPage} go={go}>{map[page]}</TenantShell>;
};

window.Tenant = Tenant;
