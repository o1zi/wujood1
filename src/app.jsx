// Main app — hash-based router

const useHashRoute = () => {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const handler = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return [hash, (h) => { window.location.hash = h.startsWith('#') ? h.slice(1) : h; window.scrollTo(0, 0); }];
};

const App = () => {
  const [hash, go] = useHashRoute();
  const route = hash.replace(/^#/, '') || '/';

  let view;
  if (route === '/' || route === '') view = <Landing go={go} />;
  else if (route === '/login') view = <Auth go={go} />;
  else if (route.startsWith('/dashboard')) view = <Tenant go={go} />;
  else if (route === '/theme-builder') view = <ThemeBuilder go={go} />;
  else if (route.startsWith('/admin')) view = <Admin go={go} />;
  else if (route.startsWith('/site/')) {
    const parts = route.split('/site/')[1].split('/');
    const slug = parts[0];
    const template = parts[1] || 'modern';
    view = <PublicSite slug={slug} template={template} go={go} />;
  }
  else view = <Landing go={go} />;

  const routes = [
    { id: '/', label: 'Landing', short: 'الرئيسية' },
    { id: '/login', label: 'Login', short: 'دخول' },
    { id: 'sep1' },
    { id: '/dashboard', label: 'Tenant', short: 'داشبورد المكتب' },
    { id: 'sep2' },
    { id: '/admin', label: 'Admin', short: 'داشبورد الأدمن' },
    { id: '/theme-builder', label: 'Theme', short: 'محرر القوالب' },
    { id: 'sep3' },
    { id: '/site/alfarabi', label: 'Public Site', short: 'موقع المكتب' },
    { id: '/site/alfarabi/classic', label: 'Classic', short: 'كلاسيكي' },
    { id: '/site/alfarabi/heritage', label: 'Heritage', short: 'تراثي' },
    { id: '/site/alfarabi/minimal', label: 'Minimal', short: 'بسيط' },
    { id: '/site/alfarabi/luxury', label: 'Luxury', short: 'فاخر' },
    { id: '/site/alfarabi/studio', label: 'Studio', short: 'استوديو' },
  ];

  const isMatch = (id) => {
    if (id === '/') return route === '/' || route === '';
    if (id === '/site/alfarabi') return route === '/site/alfarabi' || route === '/site/alfarabi/modern';
    if (id.startsWith('/site/alfarabi/')) return route === id;
    return route.startsWith(id);
  };

  return (
    <>
      {view}
      {/* Dev nav switcher */}
      <div className="wj-nav-switcher">
        <span className="wj-nav-label">demo</span>
        {routes.map((r, i) => r.id.startsWith('sep') ? (
          <span key={r.id} className="sep"></span>
        ) : (
          <button
            key={r.id}
            className={isMatch(r.id) ? 'active' : ''}
            onClick={() => go('#' + r.id)}
          >{r.short}</button>
        ))}
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
