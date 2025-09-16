// Wishlist JavaScript - Clean rewrite (UTF-8)
// Features:
// - Load/save wishlist in localStorage
// - Render items, stats, and empty state
// - Add to cart, remove item, add all to cart, clear wishlist
// - Share wishlist (Web Share API with clipboard fallback)
// - Sort by: recent, oldest, price-low, price-high, name
// - Sidebar toggle, user dropdown behavior
// - Lightweight notification system
// - Simple fade-in animations for cards
// - Keyboard (Esc) and touch swipe support

(function () {
  'use strict';

  // ---- State ----
  let wishlistItems = [];
  const LS_KEY = 'wishlistItems';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    // Optional helper CSS for dropdowns (if present in project)
    injectOptionalStyles('../shared/user-dropdown-fix.css');
    injectOptionalStyles('wishlist-overrides.css');

    // Initialize
    initWishlist();
    initSidebar();
    initUserProfileDropdown();
    addEventListeners();
    initCustomSortDropdown();
    loadSharedFooter();
  });

  function injectOptionalStyles(href) {
    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onerror = () => link.remove();
      document.head.appendChild(link);
    } catch {}
  }

  // ---- Wishlist core ----
  function initWishlist() {
    loadWishlistFromStorage();
    if (!Array.isArray(wishlistItems) || wishlistItems.length === 0) {
      // seed with sample data to demonstrate UI
      wishlistItems = sampleWishlist();
      saveWishlistToStorage();
    }
    renderWishlist();
    updateStats();
    // animations setup after first render
    setTimeout(() => {
      setupStatsCardAnimations();
      setupQuickActionAnimations();
      setupWishlistItemAnimations();
    }, 50);
  }

  function loadWishlistFromStorage() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      // validate minimal shape
      wishlistItems = parsed.filter(
        (it) => it && typeof it.id === 'number' && typeof it.title === 'string'
      );
    } catch {
      wishlistItems = [];
      localStorage.removeItem(LS_KEY);
    }
  }

  function saveWishlistToStorage() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(wishlistItems));
    } catch {}
  }

  function sampleWishlist() {
    const now = Date.now();
    return [
      {
        id: 1,
        title: 'لیوان شیشه‌ای طرح مینیمال',
        description:
          'لیوان شیشه‌ای مقاوم با طراحی مینیمال، مناسب نوشیدنی‌های گرم و سرد.',
        price: 450000,
        image:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&q=80',
        addedToCart: false,
        dateAdded: new Date(now - 0).toISOString(),
      },
      {
        id: 2,
        title: 'بطری شیشه‌ای درب‌دار',
        description:
          'بطری شیشه‌ای شفاف با درب آب‌بندی شده، مناسب نگهداری آب‌میوه و شربت.',
        price: 280000,
        image:
          'https://images.unsplash.com/photo-15586186666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80',
        addedToCart: true,
        dateAdded: new Date(now - 86400000).toISOString(),
      },
      {
        id: 3,
        title: 'لیوان دوجداره شیشه‌ای',
        description:
          'لیوان دوجداره مناسب قهوه و چای، جلوگیری از انتقال گرما به دست.',
        price: 320000,
        image:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&q=80',
        addedToCart: false,
        dateAdded: new Date(now - 172800000).toISOString(),
      },
    ];
  }

  function renderWishlist() {
    const container = $('.wishlist-items');
    if (!container) return;

    if (!wishlistItems.length) {
      container.innerHTML = `
        <div class="empty-wishlist-message">
          <i class="fas fa-heart"></i>
          <h3>لیست علاقه‌مندی‌ها خالی است</h3>
          <p>برای مشاهده محصولات، به صفحه محصولات بروید و موارد دلخواهتان را اضافه کنید.</p>
          <a href="/Product page/products.html" class="browse-products-btn">
            <i class="fas fa-shopping-bag"></i>
            مشاهده محصولات
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = wishlistItems.map(itemToHtml).join('');
  }

  function itemToHtml(item) {
    return `
      <div class="wishlist-item" data-id="${item.id}">
        <div class="wishlist-item-image">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy" />
        </div>
        <div class="wishlist-item-info">
          <h3 class="wishlist-item-title">${escapeHtml(item.title)}</h3>
          <p class="wishlist-item-description">${escapeHtml(item.description || '')}</p>
        </div>
        <div class="wishlist-item-footer">
          <div class="wishlist-item-price">${formatPrice(item.price)}</div>
          <div class="wishlist-item-actions">
            <button class="add-to-cart-btn"
              title="${item.addedToCart ? 'در سبد خرید قرار گرفت' : 'افزودن به سبد خرید'}">
              <i class="fas fa-cart-plus"></i>
            </button>
            <button class="remove-btn" title="حذف از علاقه‌مندی‌ها">
              <i class="fas fa-heart-broken"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ---- Actions ----
  function addToCart(itemId) {
    const item = wishlistItems.find((i) => i.id === itemId);
    if (!item) return;
    if (item.addedToCart) { 
      showNotification('این مورد قبلاً به سبد خرید اضافه شده است', 'info');
      return;
    }

    item.addedToCart = true;
    saveWishlistToStorage();
    renderWishlist();
    updateStats();
    showNotification(`${item.title} به سبد خرید اضافه شد`, 'success');
  }

  function removeFromWishlist(itemId) {
    const item = wishlistItems.find((i) => i.id === itemId);
    if (!item) return;

    if (
      confirm(`آیا از حذف "${item.title}" از لیست علاقه‌مندی‌ها مطمئن هستید؟`)
    ) {
      wishlistItems = wishlistItems.filter((i) => i.id !== itemId);
      saveWishlistToStorage();
      renderWishlist();
      updateStats();
      showNotification(`${item.title} از علاقه‌مندی‌ها حذف شد`, 'info');
    }
  }

  function addAllToCart() {
    const pending = wishlistItems.filter((i) => !i.addedToCart);
    if (!pending.length) {
      showNotification('همه‌ی موارد قبلاً به سبد خرید اضافه شده‌اند', 'info');
      return;
    }
    pending.forEach((i) => (i.addedToCart = true));
    saveWishlistToStorage();
    renderWishlist();
    updateStats();
    showNotification(`${pending.length} مورد به سبد خرید اضافه شد`, 'success');
  }

  function clearWishlist() {
    if (!wishlistItems.length) {
      showNotification('لیست علاقه‌مندی‌ها خالی است', 'info');
      return;
    }
    if (confirm('آیا از حذف همه‌ی موارد علاقه‌مندی‌ها مطمئن هستید؟')) {
      wishlistItems = [];
      saveWishlistToStorage();
      renderWishlist();
      updateStats();
      showNotification('لیست علاقه‌مندی‌ها پاک شد', 'success');
    }
  }

  async function shareWishlist() {
    if (!wishlistItems.length) {
      showNotification('لیست علاقه‌مندی‌ها خالی است', 'info');
      return;
    }
    const text = `لیست علاقه‌مندی‌های من در GolkarGlass:\n\n${wishlistItems
      .map((i) => `- ${i.title} - ${formatPrice(i.price)}`)
      .join('\n')}\n\nلینک صفحه: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'لیست علاقه‌مندی‌ها', text, url: window.location.href });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showNotification('متن لیست کپی شد', 'success');
      } else {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showNotification('متن لیست کپی شد', 'success');
      }
    } catch {
      showNotification('اشتراک‌گذاری انجام نشد', 'error');
    }
  }

  function sortWishlist(sortBy) {
    switch (sortBy) {
      case 'recent':
        wishlistItems.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
      case 'oldest':
        wishlistItems.sort(
          (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
        );
        break;
      case 'price-low':
        wishlistItems.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        wishlistItems.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        wishlistItems.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
        break;
      default:
        break;
    }
    renderWishlist();
    showNotification(`مرتب‌سازی بر اساس "${getSortLabel(sortBy)}" انجام شد`, 'info');
  }

  function getSortLabel(key) {
    const map = {
      recent: 'جدیدترین',
      oldest: 'قدیمی‌ترین',
      'price-low': 'قیمت (کم به زیاد)',
      'price-high': 'قیمت (زیاد به کم)',
      name: 'نام',
    };
    return map[key] || 'نام';
  }

  // ---- Stats ----
  function updateStats() {
    const total = wishlistItems.length;
    const added = wishlistItems.filter((i) => i.addedToCart).length;
    const viewed = Math.floor(total * 0.8); // demo value

    const totalEl = $('.stat-number[data-stat="total"]');
    const cartEl = $('.stat-number[data-stat="cart"]');
    const viewedEl = $('.stat-number[data-stat="viewed"]');

    if (totalEl) totalEl.textContent = nf(total);
    if (cartEl) cartEl.textContent = nf(added);
    if (viewedEl) viewedEl.textContent = nf(viewed);
  }

  // ---- Utilities ----
  function nf(num) {
    try {
      return Number(num || 0).toLocaleString('fa-IR');
    } catch {
      return String(num || 0);
    }
  }

  function formatPrice(price) {
    return `${nf(price)} تومان`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ---- Sidebar ----
  function initSidebar() {
    const toggle = $('#sidebarToggle');
    const menu = $('#sidebarMenu');
    const closeBtn = $('#sidebarClose');
    const overlay = $('#sidebarOverlay');

    if (toggle) toggle.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
  }

  function openSidebar() {
    $('#sidebarMenu')?.classList.add('open');
    $('#sidebarOverlay')?.classList.add('open');
    $('#sidebarToggle')?.classList.add('hide');
    document.body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    $('#sidebarMenu')?.classList.remove('open');
    $('#sidebarOverlay')?.classList.remove('open');
    $('#sidebarToggle')?.classList.remove('hide');
    document.body.classList.remove('sidebar-open');
  }

  // ---- User dropdown ----
  function initUserProfileDropdown() {
    const wrapper = $('.user-profile-dropdown');
    const menu = $('.user-dropdown-menu');
    if (!wrapper || !menu) return;

    const touch = 'ontouchstart' in window || (navigator?.maxTouchPoints || 0) > 0;

    if (touch) {
      wrapper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const active = wrapper.classList.toggle('active');
        applyDropdownStyles(menu, active);
      });
      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          wrapper.classList.remove('active');
          applyDropdownStyles(menu, false);
        }
      });
    } else {
      wrapper.addEventListener('mouseenter', () => applyDropdownStyles(menu, true));
      wrapper.addEventListener('mouseleave', () => applyDropdownStyles(menu, false));
    }
  }

  function applyDropdownStyles(menu, open) {
    menu.style.opacity = open ? '1' : '0';
    menu.style.visibility = open ? 'visible' : 'hidden';
    menu.style.transform = open ? 'translateY(0) scale(1)' : 'translateY(-15px) scale(0.95)';
  }

  // ---- Events ----
  function addEventListeners() {
    // Wishlist item actions via delegation
    const itemsContainer = $('.wishlist-items');
    if (itemsContainer) {
      itemsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const itemEl = e.target.closest('.wishlist-item');
        if (!itemEl) return;
        const id = Number(itemEl.getAttribute('data-id'));
        if (btn.classList.contains('add-to-cart-btn')) {
          addToCart(id);
        } else if (btn.classList.contains('remove-btn')) {
          removeFromWishlist(id);
        }
      });
    }

    // Header actions
    $('.add-all-btn')?.addEventListener('click', addAllToCart);
    $('.clear-btn')?.addEventListener('click', clearWishlist);
    $('.share-btn')?.addEventListener('click', shareWishlist);

    // Filter select
    $('.filter-select')?.addEventListener('change', function () {
      sortWishlist(this.value);
    });

    // Smooth scrolling for local anchors
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = $(a.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Keyboard ESC to close sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });

    // Touch swipe for sidebar (mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener('touchstart', (e) => {
      try { touchStartX = e.changedTouches[0].screenX; } catch {}
    });
    document.addEventListener('touchend', (e) => {
      try {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(touchStartX - touchEndX);
      } catch {}
    });

    // Debounced resize (placeholder)
    let resizeTO;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(() => {
        // layout recalculation hooks
      }, 200);
    });
  }

  function handleSwipe(diff) {
    const threshold = 50;
    if (Math.abs(diff) < threshold) return;
    if (window.innerWidth <= 992) {
      if (diff > 0) openSidebar(); // swipe left
      else closeSidebar(); // swipe right
    }
  }

  // ---- Notifications ----
  function showNotification(message, type = 'info') {
    try {
      const el = document.createElement('div');
      el.className = `notification ${type}`;
      el.textContent = message;
      el.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: #fff;
        padding: 1rem 1.25rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform .3s ease;
        font-family: 'Vazirmatn', sans-serif;
        font-weight: 500;
        max-width: 320px;
        word-wrap: break-word;
      `;
      document.body.appendChild(el);
      setTimeout(() => (el.style.transform = 'translateX(0)'), 30);
      setTimeout(() => {
        el.style.transform = 'translateX(100%)';
        setTimeout(() => el.remove(), 300);
      }, 2800);
    } catch {
      alert(message);
    }
  }

  // ---- Animations ----
  function setupWishlistItemAnimations() {
    const cards = $$('.wishlist-item');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach((c) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(20px)';
      c.style.transition = 'opacity .6s ease, transform .6s ease';
      obs.observe(c);
    });
  }

  function setupStatsCardAnimations() {
    const cards = $$('.stat-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all .6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 120);
    });
  }

  function setupQuickActionAnimations() {
    const btns = $$('.quick-action-btn');
    btns.forEach((btn, i) => {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(20px)';
      setTimeout(() => {
        btn.style.transition = 'all .6s ease';
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      }, i * 120);
    });
  }

  // ---- Custom styled sort dropdown (replaces native select) ----
  function initCustomSortDropdown() {
    try {
      const native = document.querySelector('.filter-select');
      if (!native) return;
      // Prevent duplicate build
      if (native.nextElementSibling && native.nextElementSibling.classList?.contains('sort-dropdown')) {
        // Remove native select if custom is already present
        native.remove();
        syncSortFromSelect(native, native.nextElementSibling);
        return;
      }
      const dropdown = buildSortDropdown(native);
      native.insertAdjacentElement('afterend', dropdown);
      // Remove native select from DOM (listener and reference still usable)
      native.remove();
      syncSortFromSelect(native, dropdown);
    } catch (e) {
      console.error('Error initializing custom sort dropdown:', e);
    }
  }

  function buildSortDropdown(select) {
    const wrapper = document.createElement('div');
    wrapper.className = 'sort-dropdown';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sort-toggle';
    toggle.setAttribute('aria-haspopup', 'listbox');
    toggle.setAttribute('aria-expanded', 'false');

    const label = document.createElement('span');
    label.className = 'sort-label';
    label.textContent = 'مرتب‌سازی:';

    const value = document.createElement('span');
    value.className = 'sort-value';

    const chevron = document.createElement('i');
    chevron.className = 'sort-chevron';

    toggle.append(label, value, chevron);

    const menu = document.createElement('div');
    menu.className = 'sort-menu';
    menu.setAttribute('role', 'listbox');
    menu.tabIndex = -1;

    Array.from(select.options).forEach((opt) => {
      const item = document.createElement('div');
      item.className = 'sort-option';
      item.setAttribute('role', 'option');
      item.dataset.value = opt.value;
      item.textContent = opt.textContent.trim();
      if (opt.selected) item.setAttribute('aria-selected', 'true');
      item.addEventListener('click', () => {
        try {
          select.value = opt.value;
          // Trigger native change for any existing listeners
          const evt = new Event('change', { bubbles: true });
          select.dispatchEvent(evt);
          updateSortSelected(menu, opt.value);
          updateToggleValue(wrapper, select);
          closeMenu(wrapper);
        } catch (e) {
          console.error('Error handling sort option click:', e);
        }
      });
      menu.appendChild(item);
    });

    // Toggle open/close
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      wrapper.classList.contains('open') ? closeMenu(wrapper) : openMenu(wrapper);
    });

    // Hover open/close for hover-capable devices
    try {
      if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
        wrapper.addEventListener('mouseenter', () => openMenu(wrapper));
        wrapper.addEventListener('mouseleave', () => closeMenu(wrapper));
      }
    } catch {}

    // Keyboard handling
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu(wrapper);
        focusFirstOption(menu);
      }
    });
    menu.addEventListener('keydown', (e) => {
      const current = document.activeElement;
      if (!menu.contains(current)) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(wrapper);
        toggle.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusNextOption(menu, current);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusPrevOption(menu, current);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        current.click();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) closeMenu(wrapper);
    });

    // Sync if native select changes programmatically
    select.addEventListener('change', () => {
      updateSortSelected(menu, select.value);
      updateToggleValue(wrapper, select);
    });

    wrapper.append(toggle, menu);
    return wrapper;
  }

  function openMenu(wrapper) {
    wrapper.classList.add('open');
    const toggle = wrapper.querySelector('.sort-toggle');
    toggle?.setAttribute('aria-expanded', 'true');
    wrapper.querySelector('.sort-menu')?.focus();
  }
  function closeMenu(wrapper) {
    wrapper.classList.remove('open');
    const toggle = wrapper.querySelector('.sort-toggle');
    toggle?.setAttribute('aria-expanded', 'false');
  }
  function focusFirstOption(menu) {
    const first = menu.querySelector('.sort-option');
    first?.focus();
  }
  function focusNextOption(menu, current) {
    const items = Array.from(menu.querySelectorAll('.sort-option'));
    const i = items.indexOf(current);
    const next = items[i + 1] || items[0];
    next.focus();
  }
  function focusPrevOption(menu, current) {
    const items = Array.from(menu.querySelectorAll('.sort-option'));
    const i = items.indexOf(current);
    const prev = items[i - 1] || items[items.length - 1];
    prev.focus();
  }
  function updateSortSelected(menu, value) {
    menu.querySelectorAll('.sort-option').forEach((el) => {
      if (el.dataset.value === value) el.setAttribute('aria-selected', 'true');
      else el.removeAttribute('aria-selected');
    });
  }
  function updateToggleValue(wrapper, select) {
    const selected = select.options[select.selectedIndex];
    const valEl = wrapper.querySelector('.sort-value');
    if (valEl && selected) valEl.textContent = selected.textContent.trim();
  }
  function syncSortFromSelect(select, wrapper) {
    updateToggleValue(wrapper, select);
    const menu = wrapper.querySelector('.sort-menu');
    if (menu) updateSortSelected(menu, select.value);
  }

  function loadSharedFooter() {
    try {
      var t = document.createElement('script');
      t.src = '../shared/theme.js';
      document.body.appendChild(t);
      var s = document.createElement('script');
      s.src = '../shared/footer.js';
      document.body.appendChild(s);
    } catch {}
  }

  // ---- Expose for inline/on-page triggers if any ----
  window.addToCart = addToCart;
  window.removeFromWishlist = removeFromWishlist;
  window.addAllToCart = addAllToCart;
  window.clearWishlist = clearWishlist;
  window.shareWishlist = shareWishlist;
  window.sortWishlist = sortWishlist;
  window.openSidebar = openSidebar;
  window.closeSidebar = closeSidebar;
})();
