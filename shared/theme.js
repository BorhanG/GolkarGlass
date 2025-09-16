// Shared theme loader: font-awesome, theme CSS and site-wide theme manager
(function(){
  // --- Ensure Font Awesome ---
  try{
    if(!document.querySelector('link[href*="font-awesome"]')){
      var fa = document.createElement('link');
      fa.rel='stylesheet';
      fa.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(fa);
    }
  }catch(e){console.error('fa load',e)}

  // --- THEME MANAGER (site-wide light/dark) ---
  var THEME_KEY = 'siteTheme';
  var SETTINGS_KEY = 'settingsInfo';

  function ensureThemeStyles(){
    if(document.getElementById('shared-theme-styles')) return;
    var css = document.createElement('style');
    css.id = 'shared-theme-styles';
    css.textContent = `
/* Smooth cross-fade for theme changes */
body, header, footer, .header, .footer, .settings-section, .product-card, .product-badge, .logo, .nav-menu a, button, input, select, textarea {
  transition: background-color 320ms ease, color 320ms ease, border-color 260ms ease, box-shadow 300ms ease, filter 300ms ease;
}

:root[data-theme="dark"] { color-scheme: dark; }

:root[data-theme="dark"] body { background: #121212 !important; color: #eee !important; }

/* Containers and cards */
:root[data-theme="dark"] .header,
:root[data-theme="dark"] header.header { background-color: #1a1a1a !important; border-color:#333 !important; }
:root[data-theme="dark"] .nav-menu a { color: #ddd !important; }
:root[data-theme="dark"] .user-dropdown-menu,
:root[data-theme="dark"] .sidebar-menu,
:root[data-theme="dark"] .dashboard-section,
:root[data-theme="dark"] .dashboard .section,
:root[data-theme="dark"] .orders-table-container,
:root[data-theme="dark"] .orders-table,
:root[data-theme="dark"] .cart-summary,
:root[data-theme="dark"] .cart-item,
:root[data-theme="dark"] .wishlist-item,
:root[data-theme="dark"] .wishlist-items .wishlist-item,
:root[data-theme="dark"] .profile-form,
:root[data-theme="dark"] .settings-section,
:root[data-theme="dark"] .search-box,
:root[data-theme="dark"] .filter-bar,
:root[data-theme="dark"] .stat-card,
:root[data-theme="dark"] .quick-actions .quick-action-btn { background: #1e1e1e !important; color:#eee !important; box-shadow: none !important; }

/* Tables */
:root[data-theme="dark"] table,
:root[data-theme="dark"] .orders-table { background:#1e1e1e !important; color:#ddd !important; }
:root[data-theme="dark"] .orders-table th,
:root[data-theme="dark"] .orders-table td,
:root[data-theme="dark"] table th,
:root[data-theme="dark"] table td { background:#1f1f1f !important; border-color:#333 !important; color:#ddd !important; }

/* Inputs */
:root[data-theme="dark"] input,
:root[data-theme="dark"] select,
:root[data-theme="dark"] textarea { background:#222 !important; color:#eee !important; border-color:#444 !important; }
:root[data-theme="dark"] input::placeholder,
:root[data-theme="dark"] textarea::placeholder { color:#aaa !important; }

/* Buttons */
:root[data-theme="dark"] button:not(.checkout-btn):not(.clear-cart-btn):not(.translate-btn) { background:#2a2a2a !important; color:#eee !important; border-color:#444 !important; }

/* Links */
:root[data-theme="dark"] a { color:#e0d3a5; }

/* Footer already dark; ensure text contrast */
:root[data-theme="dark"] .footer { background:#111 !important; color:#f0f0f0 !important; }

/* Sidebar overlay tint for dark */
:root[data-theme="dark"] .sidebar-overlay.open { background: rgba(0,0,0,0.6) !important; }

/* Gold accent overrides (brand-preserving styles for dark mode) */
:root[data-theme="dark"] .logo,
:root[data-theme="dark"] .profile-username,
:root[data-theme="dark"] .settings-title,
:root[data-theme="dark"] .settings-section-title,
:root[data-theme="dark"] .product-title { color: #d4af37 !important; }

:root[data-theme="dark"] .nav-separator { background: #d4af37 !important; }

:root[data-theme="dark"] .signin-btn,
:root[data-theme="dark"] .settings-save-btn,
:root[data-theme="dark"] .settings-password-btn,
:root[data-theme="dark"] .settings-add-address-btn,
:root[data-theme="dark"] .settings-add-card-btn,
:root[data-theme="dark"] .cta-button { 
  background: linear-gradient(90deg,#d4af37 0%, #ffe9a7 100%) !important; 
  color: #111 !important; 
  box-shadow: 0 8px 28px rgba(212,175,55,0.12) !important;
  border-color: rgba(255, 235, 167, 0.08) !important;
}

:root[data-theme="dark"] .signin-btn:hover,
:root[data-theme="dark"] .settings-save-btn:hover,
:root[data-theme="dark"] .settings-password-btn:hover,
:root[data-theme="dark"] .settings-add-address-btn:hover,
:root[data-theme="dark"] .settings-add-card-btn:hover { 
  transform: translateY(-2px) !important; 
  box-shadow: 0 18px 44px rgba(212,175,55,0.18) !important;
}

:root[data-theme="dark"] .product-badge,
:root[data-theme="dark"] .stat-icon,
:root[data-theme="dark"] .user-avatar,
:root[data-theme="dark"] .profile-avatar { 
  background: linear-gradient(90deg,#d4af37 0%, #ffe9a7 100%) !important; 
  color: #111 !important; 
  box-shadow: 0 8px 20px rgba(212,175,55,0.08) !important;
}

/* Gentle gold glow on headers and important labels */
:root[data-theme="dark"] h1, :root[data-theme="dark"] h2, :root[data-theme="dark"] h3 {
  text-shadow: 0 1px 8px rgba(212,175,55,0.06) !important;
}

/* make input borders subtly gold when focused in dark mode */
:root[data-theme="dark"] input:focus, :root[data-theme="dark"] select:focus, :root[data-theme="dark"] textarea:focus {
  box-shadow: 0 0 0 6px rgba(212,175,55,0.06) !important;
  border-color: #bfa13a !important;
}

/* preserve contrast on danger buttons but keep subtle gold outline */
:root[data-theme="dark"] .settings-delete-btn { 
  box-shadow: 0 6px 20px rgba(231,76,60,0.06) !important; 
}
`;
    document.head.appendChild(css);
  }

  function getSavedTheme(){
    try {
      var theme = localStorage.getItem(THEME_KEY);
      if (theme === 'light' || theme === 'dark') return theme;
      var settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      if (settings && (settings.theme === 'light' || settings.theme === 'dark')) return settings.theme;
    } catch (e) {}
    return 'light';
  }

  function saveTheme(theme){
    try {
      localStorage.setItem(THEME_KEY, theme);
      var settings = {};
      try { settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch(e) { settings = {}; }
      settings.theme = theme;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch(e) {}
  }

  function applyTheme(theme){
    try {
      var t = (theme === 'dark') ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
      document.body.classList.toggle('theme-dark', t === 'dark');
    } catch(e) { console.error('applyTheme', e); }
  }

  function handleThemeSelectIfPresent(){
    try {
      var themeSelect = document.querySelector('#theme, select[name="theme"]');
      if (!themeSelect) return;
      var current = getSavedTheme();
      if (themeSelect.value !== current) themeSelect.value = current;
    } catch(e) {}
  }

  window.addEventListener('storage', function(e){
    try {
      if (e.key === THEME_KEY || e.key === SETTINGS_KEY) {
        var next = getSavedTheme();
        applyTheme(next);
      }
    } catch{}
  });

  window.setSiteTheme = function(theme){
    var value = (theme === 'dark') ? 'dark' : 'light';
    saveTheme(value);
    applyTheme(value);
  };

  ensureThemeStyles();
  applyTheme(getSavedTheme());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleThemeSelectIfPresent);
  } else {
    handleThemeSelectIfPresent();
  }
})();
