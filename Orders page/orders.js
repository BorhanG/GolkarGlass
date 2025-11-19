// Orders Page JavaScript - Interactive functionality
document.addEventListener("DOMContentLoaded", function () {
  // Sidebar functionality
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
  const userProfileDropdown = document.querySelector(".user-profile-dropdown");
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
          userDropdownMenu.style.transform = "translateY(-15px) scale(0.95)";
        } else {
          userProfileDropdown.classList.add("active");
          userDropdownMenu.style.opacity = "1";
          userDropdownMenu.style.visibility = "visible";
          userDropdownMenu.style.transform = "translateY(0) scale(1)";
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", function (e) {
        if (!userProfileDropdown.contains(e.target)) {
          userProfileDropdown.classList.remove("active");
          userDropdownMenu.style.opacity = "0";
          userDropdownMenu.style.visibility = "hidden";
          userDropdownMenu.style.transform = "translateY(-15px) scale(0.95)";
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
    const dropdownItems = userDropdownMenu.querySelectorAll(".dropdown-item");
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        const action = this.querySelector("span").textContent;

        // Handle different actions
        switch (action) {
          case "داشبورد":
            window.location.href = "/Dashboard page/dashboard.html";
            break;
          case "سبد خرید":
            window.location.href = "/Shopping-Cart-page/shopping-cart.html";
            break;
          case "علاقه‌مندی‌ها":
            window.location.href = "/Wishlist-page/wishlist.html";
            break;
          case "سفارشات من":
            console.log("Already on Orders page");
            break;
          case "پروفایل":
            window.location.href = "/Profile-page/profile.html";
            break;
          case "تنظیمات":
            window.location.href = "/Settings-page/settings.html";
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
          window.location.href = "/Dashboard page/dashboard.html";
          break;
        case "سبد خرید":
          window.location.href = "/Shopping-Cart-page/shopping-cart.html";
          break;
        case "علاقه‌مندی‌ها":
          window.location.href = "/Wishlist-page/wishlist.html";
          break;
        case "سفارشات من":
          console.log("Already on Orders page");
          break;
        case "پروفایل":
          window.location.href = "/Profile-page/profile.html";
          break;
        case "تنظیمات":
          window.location.href = "/Settings-page/settings.html";
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

  // Orders functionality
  const ordersList = document.getElementById("ordersList");
  const emptyOrdersMessage = document.getElementById("emptyOrdersMessage");
  const statusFilter = document.getElementById("statusFilter");
  const sortFilter = document.getElementById("sortFilter");
  const timeFilter = document.getElementById("timeFilter");

  // Stats elements
  const totalOrders = document.getElementById("totalOrders");
  const pendingOrders = document.getElementById("pendingOrders");
  const shippedOrders = document.getElementById("shippedOrders");
  const deliveredOrders = document.getElementById("deliveredOrders");

  // Storage keys
  const ORDERS_STORAGE_KEY = "ordersData";
  const CART_STORAGE_KEY = "dashboardCart";

  let orders = [];
  let filteredOrders = [];

  // Initialize orders
  function initOrders() {
    loadOrdersFromStorage();
    if (orders.length === 0) {
      loadSampleOrders();
      saveOrdersToStorage();
    } else {
      // Initialize filteredOrders with all orders when loading from storage
      filteredOrders = [...orders];
    }
    updateStats();
    renderOrders();
    updateCartBadge();
  }

  // Load orders from localStorage
  function loadOrdersFromStorage() {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          orders = parsed;
          return;
        }
      }
    } catch (error) {
      console.error("Error loading orders from storage:", error);
      showNotification("خطا در بارگذاری سفارشات", "error");
    }
  }

  // ... existing code ...

  // Load sample orders if none exist
  function loadSampleOrders() {
    const today = new Date();
    const daysAgo = (days) => {
      const date = new Date(today);
      date.setDate(date.getDate() - days);
      return date.toISOString().split("T")[0];
    };

    orders = [
      {
        id: "12345",
        number: "#۱۲۳۴۵",
        date: daysAgo(3),
        status: "delivered",
        total: 450000,
        items: [
          {
            name: "گلدان کریستال ایرانی",
            price: 450000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=120&q=60",
          },
        ],
      },
      {
        id: "12344",
        number: "#۱۲۳۴۴",
        date: daysAgo(5),
        status: "shipped",
        total: 280000,
        items: [
          {
            name: "لیوان‌های شراب لوکس",
            price: 280000,
            quantity: 2,
            image:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=120&q=60",
          },
        ],
      },
      {
        id: "12343",
        number: "#۱۲۳۴۳",
        date: daysAgo(7),
        status: "processing",
        total: 320000,
        items: [
          {
            name: "مجموعه کاسه تزئینی",
            price: 320000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=120&q=60",
          },
        ],
      },
      {
        id: "12342",
        number: "#۱۲۳۴۲",
        date: daysAgo(10),
        status: "delivered",
        total: 520000,
        items: [
          {
            name: "دکانتر کریستال",
            price: 520000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1558618666/fcd25c85cd64?auto=format&fit=crop&w=120&q=60",
          },
        ],
      },
      {
        id: "12341",
        number: "#۱۲۳۴۱",
        date: daysAgo(12),
        status: "delivered",
        total: 180000,
        items: [
          {
            name: "مجموعه لیوان چای",
            price: 180000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1558618666/fcd25c85cd64?auto=format&fit=crop&w=120&q=60",
          },
        ],
      },
      {
        id: "12340",
        number: "#۱۲۳۴۰",
        date: daysAgo(15),
        status: "delivered",
        total: 380000,
        items: [
          {
            name: "کوزه آب دست‌ساز",
            price: 380000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=120&q=60",
          },
        ],
      },
      {
        id: "12339",
        number: "#۱۲۳۳۹",
        date: daysAgo(18),
        status: "delivered",
        total: 650000,
        items: [
          {
            name: "گلدان کریستال ایرانی",
            price: 450000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=120&q=60",
          },
          {
            name: "لیوان‌های شراب لوکس",
            price: 280000,
            quantity: 2,
            image:
              "https://images.unsplash.com/photo-1558618666/fcd25c85cd64?auto=format&fit=crop&w=120&q=60",
          },
          {
            name: "مجموعه لیوان چای",
            price: 180000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1558618666/fcd25c85cd64?auto=format&fit=crop&w=120&q=60",
          },
        ],
      },
    ];

    // Precompute totals for each order
    orders.forEach((o) => {
      o.total = o.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    });

    // Set filtered orders to all orders initially
    filteredOrders = [...orders];

    // Save to storage
    saveOrdersToStorage();
  }

  // ... existing code ...

  // Save orders to localStorage
  function saveOrdersToStorage() {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Error saving orders to storage:", error);
      showNotification("خطا در ذخیره سفارشات", "error");
    }
  }

  // Render orders
  function renderOrders() {
    if (!ordersList) return;

    if (filteredOrders.length === 0) {
      ordersList.innerHTML = "";
      if (emptyOrdersMessage) {
        emptyOrdersMessage.style.display = "block";
      }
      return;
    }

    if (emptyOrdersMessage) {
      emptyOrdersMessage.style.display = "none";
    }

    ordersList.innerHTML = "";

    filteredOrders.forEach((order, index) => {
      const orderElement = createOrderElement(order, index);
      ordersList.appendChild(orderElement);
    });

    addOrderActionListeners();
  }

  // Create order element
  function createOrderElement(order, index) {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-item";
    orderDiv.setAttribute("data-order-id", order.id);

    const statusClass = `order-status ${order.status}`;
    const statusText = getStatusText(order.status);

    const itemsHtml = order.items
      .map(
        (item) => `
            <div class="order-item-detail">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">${formatPrice(
                      item.price
                    )}</div>
                    <div class="order-item-quantity">تعداد: ${
                      item.quantity
                    }</div>
                </div>
            </div>
        `
      )
      .join("");

    const canCancel =
      order.status === "pending" || order.status === "processing";
    const cancelButton = canCancel
      ? `<button class="action-btn cancel-order-btn" title="لغو" data-index="${index}"><i class="fas fa-times"></i></button>`
      : "";

    orderDiv.innerHTML = `
            <div class="order-header">
                <div class="order-number">${order.number}</div>
                <div class="order-date">${formatDate(order.date)}</div>
                <div class="${statusClass}">${statusText}</div>
            </div>
            <div class="order-content">
                <div class="order-items">${itemsHtml}</div>
                <div class="order-summary">
                    <div class="order-total">
                        <span>مجموع:</span>
                        <span>${formatPrice(order.total)}</span>
                    </div>
                    <div class="order-actions">
                        <button class="action-btn view-order-btn" title="مشاهده" data-index="${index}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn track-order-btn" title="پیگیری" data-index="${index}"><i class="fas fa-truck"></i></button>
                        <button class="action-btn reorder-btn" title="سفارش مجدد" data-index="${index}"><i class="fas fa-redo"></i></button>
                        ${cancelButton}
                    </div>
                </div>
            </div>
        `;

    return orderDiv;
  }

  // Add event listeners to order action buttons
  function addOrderActionListeners() {
    // View order
    document.querySelectorAll(".view-order-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        viewOrder(filteredOrders[index]);
      });
    });

    // Track order
    document.querySelectorAll(".track-order-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        trackOrder(filteredOrders[index]);
      });
    });

    // Reorder
    document.querySelectorAll(".reorder-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        reorderItems(filteredOrders[index]);
      });
    });

    // Cancel order
    document.querySelectorAll(".cancel-order-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        cancelOrder(index);
      });
    });
  }

  // Order actions
  function viewOrder(order) {
    if (!order) return;

    // Get modal elements
    const modal = document.getElementById("orderModal");
    const overlay = document.getElementById("orderModalOverlay");
    const orderIdEl = document.getElementById("orderId");
    const orderDateEl = document.getElementById("orderDate");
    const orderStatusEl = document.getElementById("orderStatus");
    const orderProductsEl = document.getElementById("orderProducts");
    const orderTotalEl = document.getElementById("orderTotal");

    if (!modal || !overlay) {
      console.error("Modal elements not found");
      return;
    }

    // Populate modal with order data
    orderIdEl.textContent = order.number;
    orderDateEl.textContent = formatDate(order.date);
    orderStatusEl.textContent = getStatusText(order.status);
    orderStatusEl.className = `order-status-badge ${order.status}`;
    orderTotalEl.textContent = formatPrice(order.total);

    // Clear and populate products
    orderProductsEl.innerHTML = "";
    order.items.forEach((item) => {
      const productEl = document.createElement("div");
      productEl.className = "order-product";
      productEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70?text=Product'">
        <div class="order-product-info">
          <h4>${item.name}</h4>
          <p>تعداد: ${item.quantity}</p>
        </div>
        <div class="order-product-price">${formatPrice(item.price * item.quantity)}</div>
      `;
      orderProductsEl.appendChild(productEl);
    });

    // Open modal
    openOrderModal();
  }

  // Modal functions
  function openOrderModal() {
    const modal = document.getElementById("orderModal");
    const overlay = document.getElementById("orderModalOverlay");

    if (!modal || !overlay) return;

    modal.classList.remove("dis_none");
    overlay.classList.remove("dis_none");
    
    // Trigger animation
    requestAnimationFrame(() => {
      modal.classList.add("show");
      overlay.classList.add("show");
    });

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  }

  function closeOrderModal() {
    const modal = document.getElementById("orderModal");
    const overlay = document.getElementById("orderModalOverlay");

    if (!modal || !overlay) return;

    modal.classList.remove("show");
    overlay.classList.remove("show");

    // Hide after animation
    setTimeout(() => {
      modal.classList.add("dis_none");
      overlay.classList.add("dis_none");
    }, 300);

    // Restore body scroll
    document.body.style.overflow = "";
  }

  // Set up modal close handlers
  const closeModalBtn = document.getElementById("closeOrderModal");
  const modalOverlay = document.getElementById("orderModalOverlay");

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeOrderModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeOrderModal);
  }


  function trackOrder(order) {
    if (!order) return;

    showNotification(
      `پیگیری سفارش ${order.number} در حال بارگذاری است...`,
      "info"
    );

    setTimeout(() => {
      const trackingInfo = getTrackingInfo(order);
      alert(`پیگیری سفارش ${order.number}:\n\n${trackingInfo}`);
    }, 1000);
  }

  function reorderItems(order) {
    if (!order) return;

    try {
      // Load existing cart
      const existingCart = localStorage.getItem(CART_STORAGE_KEY);
      let cart = [];

      if (existingCart) {
        const parsed = JSON.parse(existingCart);
        if (Array.isArray(parsed)) {
          cart = parsed;
        }
      }

      // Add items to cart
      order.items.forEach((item) => {
        const existingItem = cart.find(
          (cartItem) => cartItem.name === item.name
        );

        if (existingItem) {
          existingItem.quantity =
            (parseInt(existingItem.quantity) || 0) +
            (parseInt(item.quantity) || 0);
        } else {
          cart.push({
            name: item.name,
            price: formatPrice(item.price),
            image: item.image,
            quantity: item.quantity,
          });
        }
      });

      // Save updated cart
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

      // Update cart badge
      updateCartBadge();

      showNotification(
        `اقلام سفارش ${order.number} به سبد خرید افزوده شد`,
        "success"
      );
    } catch (error) {
      console.error("Error adding items to cart:", error);
      showNotification("خطا در افزودن به سبد خرید", "error");
    }
  }

  function cancelOrder(index) {
    const order = filteredOrders[index];
    if (!order) return;

    if (
      !confirm(
        `آیا مطمئن هستید که می‌خواهید سفارش ${order.number} را لغو کنید؟`
      )
    ) {
      return;
    }

    // Update order status
    order.status = "cancelled";

    // Update original orders array
    const originalIndex = orders.findIndex((o) => o.id === order.id);
    if (originalIndex !== -1) {
      orders[originalIndex].status = "cancelled";
    }

    // Save to storage
    saveOrdersToStorage();

    // Refresh display
    applyFilters();
    updateStats();

    showNotification(`سفارش ${order.number} لغو شد`, "success");
  }

  // Filtering and sorting
  function applyFilters() {
    const status = statusFilter ? statusFilter.value : "all";
    const sortBy = sortFilter ? sortFilter.value : "newest";
    const timeRange = timeFilter ? timeFilter.value : "all";

    let filtered = orders.slice();

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }

    // Filter by time range
    if (timeRange !== "all") {
      filtered = filtered.filter((order) =>
        isWithinTimeRange(order.date, timeRange)
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "price-high":
          return b.total - a.total;
        case "price-low":
          return a.total - b.total;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    filteredOrders = filtered;
    renderOrders();
  }

  // Check if date is within time range
  function isWithinTimeRange(dateStr, range) {
    const orderDate = new Date(dateStr);
    const now = new Date();
    const diffTime = now - orderDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (range) {
      case "week":
        return diffDays <= 7;
      case "month":
        return diffDays <= 30;
      case "quarter":
        return diffDays <= 90;
      case "year":
        return diffDays <= 365;
      default:
        return true;
    }
  }

  // Update statistics
  function updateStats() {
    if (!totalOrders || !pendingOrders || !shippedOrders || !deliveredOrders)
      return;

    const total = orders.length;
    const pending = orders.filter((order) => order.status === "pending").length;
    const shipped = orders.filter((order) => order.status === "shipped").length;
    const delivered = orders.filter(
      (order) => order.status === "delivered"
    ).length;

    totalOrders.textContent = total;
    pendingOrders.textContent = pending;
    shippedOrders.textContent = shipped;
    deliveredOrders.textContent = delivered;
  }

  // Update cart badge
  function updateCartBadge() {
    try {
      const cartBadge = document.querySelector(".cart-badge");
      if (!cartBadge) return;

      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const cart = JSON.parse(cartData);
        if (Array.isArray(cart)) {
          const totalItems = cart.reduce(
            (sum, item) => sum + (parseInt(item.quantity) || 0),
            0
          );
          cartBadge.textContent = totalItems;
          return;
        }
      }
      cartBadge.textContent = "0";
    } catch (error) {
      console.error("Error updating cart badge:", error);
    }
  }

  // Utility functions
  function formatPrice(price) {
    return price.toLocaleString("fa-IR") + " تومان";
  }

  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("fa-IR");
    } catch (error) {
      return dateStr;
    }
  }

  function getStatusText(status) {
    const statusMap = {
      pending: "در انتظار پرداخت",
      processing: "در حال پردازش",
      shipped: "ارسال شده",
      delivered: "تحویل داده شده",
      cancelled: "لغو شده",
    };
    return statusMap[status] || status;
  }

  function getTrackingInfo(order) {
    const trackingMap = {
      pending: "سفارش در انتظار پرداخت است. لطفاً پرداخت خود را تکمیل کنید.",
      processing:
        "سفارش در حال پردازش است. تیم ما در حال آماده‌سازی سفارش شماست.",
      shipped:
        "سفارش ارسال شده است. شماره پیگیری: TRK" + order.id.padStart(6, "0"),
      delivered: "سفارش با موفقیت تحویل داده شده است.",
      cancelled: "سفارش لغو شده است.",
    };
    return trackingMap[order.status] || "اطلاعات پیگیری در دسترس نیست.";
  }

  // Notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${
              type === "success"
                ? "#27ae60"
                : type === "error"
                ? "#e74c3c"
                : "#3498db"
            };
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: 'Vazirmatn', sans-serif;
            font-weight: 500;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Add filter event listeners
  if (statusFilter) {
    statusFilter.addEventListener("change", applyFilters);
  }
  if (sortFilter) {
    sortFilter.addEventListener("change", applyFilters);
  }
  if (timeFilter) {
    timeFilter.addEventListener("change", applyFilters);
  }

  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      // Close modal if open, otherwise close sidebar
      const modal = document.getElementById("orderModal");
      if (modal && !modal.classList.contains("dis_none")) {
        closeOrderModal();
      } else {
        closeSidebar();
      }
    }
  });

  // Add touch gesture support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - open sidebar
        if (window.innerWidth <= 992) {
          openSidebar();
        }
      } else {
        // Swipe right - close sidebar
        if (window.innerWidth <= 992) {
          closeSidebar();
        }
      }
    }
  }

  // Add loading animations for stats cards
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });

  // Add hover effects for order items
  const orderItems = document.querySelectorAll(".order-item");
  orderItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
      this.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
    });
  });

  // Add confirmation for logout
  const logoutItems = document.querySelectorAll(".logout-item");
  logoutItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("آیا مطمئن هستید که می‌خواهید خارج شوید؟")) {
        window.location.href = "/Login page/login.html";
      }
    });
  });

  // Add auto-refresh for stats (optional)
  setInterval(() => {
    // Update stats every 30 seconds
    console.log("Refreshing orders stats...");
    updateStats();
  }, 30000);

  // Initialize the page
  initOrders();

  // Show welcome notification
  setTimeout(() => {
    showNotification("صفحه سفارشات شما با موفقیت بارگذاری شد!", "success");
  }, 1000);

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideOut {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .notification {
            font-family: 'Vazirmatn', sans-serif;
            font-weight: 500;
        }
        
        .stat-card {
            transition: all 0.3s ease;
        }
        
        .order-item {
            transition: all 0.3s ease;
        }
        
        .order-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
    `;
  document.head.appendChild(style);
});
