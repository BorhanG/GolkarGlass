(function () {
  // Don't inject if page already has a header or body opts out
  if ( 
    document.body.hasAttribute("data-no-header")
  )
    return;

  // Inject header HTML
  const headerHTML = `
  <header class="header">
        <nav class="nav-container">
            <div class="logo">GolkarGlass</div>
            <ul class="nav-menu">
                <li><a href=""/Main page signed in/GolkarGlass.html"">خانه</a></li>
                <li><a href="/About page/About.html">درباره ما</a></li>
                <li><a href="/Product page/products.html">محصولات</a></li>
                <li><a href="#testimonials">نظرات</a></li>
                <li class="nav-separator"></li>
                <li class="user-profile-dropdown">
                    <button class="user-profile-btn">
                        <span class="user-avatar">
                            <i class="fas fa-user"></i>
                        </span>
                        <span class="user-name">کاربر عزیز</span>
                        <span class="dropdown-arrow">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </button>
                    <div class="user-dropdown-menu">
                        <div class="dropdown-header">
                            <div class="user-info">
                                <span class="user-avatar-large">
                                    <i class="fas fa-user"></i>
                                </span>
                                <div class="user-details">
                                    <span class="user-name-large">کاربر عزیز</span>
                                    <span class="user-email">user@golkarglass.com</span>
                                </div>
                            </div>
                        </div>
                        <div class="dropdown-separator"></div>
                        <a href="/Dashboard page/dashboard.html" class="dropdown-item">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>داشبورد</span>
                        </a>
                        <a href="/Shopping-Cart-page/shopping-cart.html" class="dropdown-item">
                            <i class="fas fa-shopping-cart"></i>
                            <span>سبد خرید</span>
                            <span class="cart-badge">3</span>
                        </a>
                        <a href="/Wishlist page/wishlist.html" class="dropdown-item">
                            <i class="fas fa-heart"></i>
                            <span>علاقه‌مندی‌ها</span>
                        </a>
                        <a href="/My orders page/my-orders-advanced.html" class="dropdown-item">
                            <i class="fas fa-box"></i>
                            <span>سفارشات من</span>
                        </a>
                        <a href="/Profile page/profile.html" class="dropdown-item">
                            <i class="fas fa-user-edit"></i>
                            <span>پروفایل</span>
                        </a>
                        <a href="/Settings page/settings.html" class="dropdown-item">
                            <i class="fas fa-cog"></i>
                            <span>تنظیمات</span>
                        </a>
                        <div class="dropdown-separator"></div>
                        <a href="/Login page/login.html" class="dropdown-item logout-item">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>خروج</span>
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
    </header>
  `;

  document.documentElement.insertAdjacentHTML("afterbegin", headerHTML);

  // Append header.css
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/shared/header.css";
  document.head.appendChild(link);

  // Sidebar HTML (append to body if not present)
  
    const aside = document.createElement("aside");
    aside.id = "sidebarMenu";
    aside.className = "sidebar-menu";
    aside.innerHTML = `
    <button id="sidebarToggle" class="sidebar-toggle" aria-label="باز کردن منو">
      <span></span>
      <span></span>
      <span></span>
    </button>
      <aside id="sidebarMenu" class="sidebar-menu">
      <button id="sidebarClose" class="sidebar-close" aria-label="بستن منو">&times;</button>
      <nav>
        <ul>
          <li><a href="/Main page signed in/GolkarGlass.html">خانه</a></li>
          <li><a href="/About page/About.html">درباره ما</a></li>
          <li><a href="/Product page signed in/products.html">محصولات</a></li>
          <li><a href="#testimonials">نظرات</a></li>
          <li class="sidebar-separator"></li>
          <li class="sidebar-user-profile">
            <div class="sidebar-user-info">
              <span class="sidebar-user-avatar">
                <i class="fas fa-user"></i>
              </span>
              <span class="sidebar-user-name">کاربر عزیز</span>
            </div>
            <div class="sidebar-user-menu">
              <a href="/Dashboard page/dashboard.html" class="sidebar-user-item">
                <i class="fas fa-tachometer-alt"></i>
                <span>داشبورد</span>
              </a>
              <a href="/Shopping-Cart-page/shopping-cart.html" class="sidebar-user-item">
                <i class="fas fa-shopping-cart"></i>
                <span>سبد خرید</span>
              </a>
                                      <a href="/Wishlist page/wishlist.html" class="sidebar-user-item">
                            <i class="fas fa-heart"></i>
                            <span>علاقه‌مندی‌ها</span>
                        </a>
              <a href="/My orders page/my-orders-advanced.html" class="sidebar-user-item">
                <i class="fas fa-box"></i>
                <span>سفارشات من</span>
              </a>
              <a href="/Profile page/profile.html" class="sidebar-user-item">
                <i class="fas fa-user-edit"></i>
                <span>پروفایل</span>
              </a>
              <a href="/Settings page/settings.html" class="sidebar-user-item">
                <i class="fas fa-cog"></i>
                <span>تنظیمات</span>
              </a>
              <a href="/Login page/login.html" class="sidebar-user-item logout-item">
                <i class="fas fa-sign-out-alt"></i>
                <span>خروج</span>
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
    <div id="sidebarOverlay" class="sidebar-overlay"></div>
    `;
    document.body.appendChild(aside);
    const overlay = document.createElement("div");
    overlay.id = "sidebarOverlay";
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  

  // Wire interactions
  document.addEventListener("DOMContentLoaded", () => {
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarMenu = document.getElementById("sidebarMenu");
    const sidebarClose = document.getElementById("sidebarClose");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    function openSidebar() {
      if (sidebarMenu) sidebarMenu.classList.add("open");
      if (sidebarOverlay) sidebarOverlay.classList.add("open");
      if (sidebarToggle) sidebarToggle.classList.add("hide");
    }
    function closeSidebar() {
      if (sidebarMenu) sidebarMenu.classList.remove("open");
      if (sidebarOverlay) sidebarOverlay.classList.remove("open");
      if (sidebarToggle) sidebarToggle.classList.remove("hide");
    }

    if (sidebarToggle) sidebarToggle.addEventListener("click", openSidebar);
    if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

    // user dropdown
    document.addEventListener("DOMContentLoaded", function () {
      const sidebarToggle = document.getElementById("sidebarToggle");
      const sidebarMenu = document.getElementById("sidebarMenu");
      const sidebarClose = document.getElementById("sidebarClose");
      const sidebarOverlay = document.getElementById("sidebarOverlay");

      function openSidebar() {
        sidebarMenu.classList.add("open");
        sidebarOverlay.classList.add("open");
        if (sidebarToggle) sidebarToggle.classList.add("hide");
      }
      function closeSidebar() {
        sidebarMenu.classList.remove("open");
        sidebarOverlay.classList.remove("open");
        if (sidebarToggle) sidebarToggle.classList.remove("hide");
      }

      if (sidebarToggle) {
        sidebarToggle.addEventListener("click", openSidebar);
      }
      if (sidebarClose) {
        sidebarClose.addEventListener("click", closeSidebar);
      }
      if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
      }

      // User Profile Dropdown Functionality
      const userProfileDropdown = document.querySelector(
        ".user-profile-dropdown"
      );
      const userDropdownMenu = document.querySelector(".user-dropdown-menu");

      if (userProfileDropdown && userDropdownMenu) {
        let isTouchDevice =
          "ontouchstart" in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
          // Touch device behavior
          userProfileDropdown.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (userProfileDropdown.classList.contains("active")) {
              userProfileDropdown.classList.remove("active");
              userDropdownMenu.style.opacity = "0";
              userDropdownMenu.style.visibility = "hidden";
              userDropdownMenu.style.transform =
                "translate(-50%, -50%) scale(0.9)";
            } else {
              userProfileDropdown.classList.add("active");
              userDropdownMenu.style.opacity = "1";
              userDropdownMenu.style.visibility = "visible";
              userDropdownMenu.style.transform =
                "translate(-50%, -50%) scale(1)";
            }
          });

          // Close dropdown when clicking outside
          document.addEventListener("click", function (e) {
            if (!userProfileDropdown.contains(e.target)) {
              userProfileDropdown.classList.remove("active");
              userDropdownMenu.style.opacity = "0";
              userDropdownMenu.style.visibility = "hidden";
              userDropdownMenu.style.transform =
                "translate(-50%, -50%) scale(0.9)";
            }
          });
        } else {
          // Desktop hover behavior
          userProfileDropdown.addEventListener("mouseenter", function () {
            userDropdownMenu.style.opacity = "1";
            userDropdownMenu.style.visibility = "visible";
            userDropdownMenu.style.transform = "translateY(0) scale(1)";
          });

          // Hide dropdown when mouse leaves
          userProfileDropdown.addEventListener("mouseleave", function () {
            userDropdownMenu.style.opacity = "0";
            userDropdownMenu.style.visibility = "hidden";
            userDropdownMenu.style.transform = "translateY(-15px) scale(0.95)";
          });
        }

        // Handle dropdown item clicks
        const dropdownItems =
          userDropdownMenu.querySelectorAll(".dropdown-item");
        dropdownItems.forEach((item) => {
          item.addEventListener("click", function (e) {
            e.preventDefault();
            const action = this.querySelector("span").textContent;

            // Handle different actions
            switch (action) {
              case "داشبورد":
                console.log("Navigating to Dashboard...");
                // Add navigation logic here
                break;
              case "سبد خرید":
                console.log("Navigating to Shopping Cart...");
                // Add navigation logic here
                break;
              case "علاقه‌مندی‌ها":
                console.log("Navigating to Wishlist...");
                // Add navigation logic here
                break;
              case "سفارشات من":
                console.log("Navigating to My Orders...");
                // Add navigation logic here
                break;
              case "پروفایل":
                console.log("Navigating to Profile...");
                // Add navigation logic here
                break;
              case "تنظیمات":
                console.log("Navigating to Settings...");
                // Add navigation logic here
                break;
              case "خروج":
                console.log("Logging out...");
                // Add logout logic here
                if (confirm("آیا مطمئن هستید که می‌خواهید خارج شوید؟")) {
                  // Redirect to login page or perform logout
                  window.location.href = "/Login page/login.html";
                }
                break;
            }
          });
        });
      }

      // Sidebar user menu functionality
      const sidebarUserItems = document.querySelectorAll(".sidebar-user-item");
      sidebarUserItems.forEach((item) => {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          const action = this.querySelector("span").textContent;

          // Handle different actions (same as dropdown)
          switch (action) {
            case "داشبورد":
              console.log("Navigating to Dashboard...");
              break;
            case "سبد خرید":
              console.log("Navigating to Shopping Cart...");
              break;
            case "علاقه‌مندی‌ها":
              console.log("Navigating to Wishlist...");
              break;
            case "سفارشات من":
              console.log("Navigating to My Orders...");
              break;
            case "پروفایل":
              console.log("Navigating to Profile...");
              break;
            case "تنظیمات":
              console.log("Navigating to Settings...");
              break;
            case "خروج":
              console.log("Logging out...");
              if (confirm("آیا مطمئن هستید که می‌خواهید خارج شوید؟")) {
                window.location.href = "/Login page/login.html";
              }
              break;
          }
        });
      });
    });

    // update cart-badge from localStorage if present
    try {
      const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
      const badge = document.querySelector(".cart-badge");
      if (badge)
        badge.textContent = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    } catch (e) {}
  });
})();
