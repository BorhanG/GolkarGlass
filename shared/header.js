(function(){
  // Don't inject if page already has a header or body opts out
  if (document.querySelector('.header') || document.body.hasAttribute('data-no-header')) return;

  // Inject header HTML
  const headerHTML = `
  <header class="header">
    <nav class="nav-container">
      <button id="sidebarToggle" class="sidebar-toggle" aria-label="باز کردن منو">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="logo">GolkarGlass</div>
      <ul class="nav-menu">
        <li><a href="/Main page signed in/GolkarGlass.html">خانه</a></li>
        <li><a href="/About page/About.html">درباره ما</a></li>
        <li><a href="/Product page/products.html">محصولات</a></li>
        <li><a href="#testimonials">نظرات</a></li>
        <li class="nav-separator"></li>
        <li class="user-profile-dropdown">
          <button class="user-profile-btn">
            <span class="user-avatar"><i class="fas fa-user"></i></span>
            <span class="user-name">کاربر عزیز</span>
            <span class="dropdown-arrow"><i class="fas fa-chevron-down"></i></span>
          </button>
          <div class="user-dropdown-menu">
            <div class="dropdown-header">
              <div class="user-info">
                <span class="user-avatar-large"><i class="fas fa-user"></i></span>
                <div class="user-details">
                  <span class="user-name-large">کاربر عزیز</span>
                  <span class="user-email">user@golkarglass.com</span>
                </div>
              </div>
            </div>
            <div class="dropdown-separator"></div>
            <a href="/Dashboard page/dashboard.html" class="dropdown-item"><i class="fas fa-tachometer-alt"></i><span>داشبورد</span></a>
            <a href="/Shopping-Cart-page/shopping-cart.html" class="dropdown-item"><i class="fas fa-shopping-cart"></i><span>سبد خرید</span><span class="cart-badge">0</span></a>
            <a href="/Wishlist page/wishlist.html" class="dropdown-item"><i class="fas fa-heart"></i><span>علاقه‌مندی‌ها</span></a>
            <a href="/My orders page/my-orders-advanced.html" class="dropdown-item"><i class="fas fa-box"></i><span>سفارشات من</span></a>
            <a href="/Profile page/profile.html" class="dropdown-item"><i class="fas fa-user-edit"></i><span>پروفایل</span></a>
            <a href="/Settings page/settings.html" class="dropdown-item"><i class="fas fa-cog"></i><span>تنظیمات</span></a>
            <div class="dropdown-separator"></div>
            <a href="/Login page/login.html" class="dropdown-item logout-item"><i class="fas fa-sign-out-alt"></i><span>خروج</span></a>
          </div>
        </li>
      </ul>
    </nav>
  </header>
  `;

  document.documentElement.insertAdjacentHTML('afterbegin', headerHTML);

  // Append header.css
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/shared/header.css';
  document.head.appendChild(link);

  // Sidebar HTML (append to body if not present)
  if (!document.getElementById('sidebarMenu')){
    const aside = document.createElement('aside');
    aside.id = 'sidebarMenu';
    aside.className = 'sidebar-menu';
    aside.innerHTML = `
      <button id="sidebarClose" class="sidebar-close" aria-label="بستن منو">&times;</button>
      <nav>
        <ul>
          <li><a href="/Main page signed in/GolkarGlass.html">خانه</a></li>
          <li><a href="/About page/About.html">درباره ما</a></li>
          <li><a href="/Product page/products.html">محصولات</a></li>
          <li><a href="#testimonials">نظرات</a></li>
          <li class="sidebar-separator"></li>
          <li class="sidebar-user-profile">
            <div class="sidebar-user-info">
              <span class="sidebar-user-avatar"><i class="fas fa-user"></i></span>
              <span class="sidebar-user-name">کاربر عزیز</span>
            </div>
            <div class="sidebar-user-menu">
              <a href="/Dashboard page/dashboard.html" class="sidebar-user-item"><i class="fas fa-tachometer-alt"></i><span>داشبورد</span></a>
              <a href="/Shopping-Cart-page/shopping-cart.html" class="sidebar-user-item"><i class="fas fa-shopping-cart"></i><span>سبد خرید</span></a>
              <a href="/Wishlist page/wishlist.html" class="sidebar-user-item"><i class="fas fa-heart"></i><span>علاقه‌مندی‌ها</span></a>
              <a href="/My orders page/my-orders-advanced.html" class="sidebar-user-item"><i class="fas fa-box"></i><span>سفارشات من</span></a>
              <a href="/Profile page/profile.html" class="sidebar-user-item"><i class="fas fa-user-edit"></i><span>پروفایل</span></a>
              <a href="/Settings page/settings.html" class="sidebar-user-item"><i class="fas fa-cog"></i><span>تنظیمات</span></a>
              <a href="/Login page/login.html" class="sidebar-user-item logout-item"><i class="fas fa-sign-out-alt"></i><span>خروج</span></a>
            </div>
          </li>
        </ul>
      </nav>
    `;
    document.body.appendChild(aside);
    const overlay = document.createElement('div'); overlay.id = 'sidebarOverlay'; overlay.className='sidebar-overlay'; document.body.appendChild(overlay);
  }

  // Wire interactions
  document.addEventListener('DOMContentLoaded', ()=>{
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar(){ if(sidebarMenu) sidebarMenu.classList.add('open'); if(sidebarOverlay) sidebarOverlay.classList.add('open'); if(sidebarToggle) sidebarToggle.classList.add('hide'); }
    function closeSidebar(){ if(sidebarMenu) sidebarMenu.classList.remove('open'); if(sidebarOverlay) sidebarOverlay.classList.remove('open'); if(sidebarToggle) sidebarToggle.classList.remove('hide'); }

    if(sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
    if(sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if(sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // user dropdown
    const userProfileDropdown = document.querySelector('.user-profile-dropdown');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    if(userProfileDropdown && userDropdownMenu){
      userProfileDropdown.addEventListener('click', function(e){ e.stopPropagation(); userProfileDropdown.classList.toggle('active'); });
      document.addEventListener('click', ()=>{ userProfileDropdown.classList.remove('active'); });
    }

    // update cart-badge from localStorage if present
    try{
      const cart = JSON.parse(localStorage.getItem('shoppingCart')||'[]');
      const badge = document.querySelector('.cart-badge'); if(badge) badge.textContent = cart.reduce((s,i)=>s+(i.quantity||1),0);
    }catch(e){}
  });
})();