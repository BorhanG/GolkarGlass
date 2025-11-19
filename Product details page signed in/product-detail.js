// Product Detail Page JavaScript
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
          window.location.href = "/Wishlist page/wishlist.html";
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
// Image gallery functionality
let currentImageIndex = 0;
const images = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

// Function to change main image
function setImage(index) {
    if (index >= 0 && index < images.length) {
        currentImageIndex = index;
        const mainImage = document.getElementById('mainImage');
        mainImage.src = images[index];
        
        // Update thumbnail active state
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
}

// Function to navigate images with arrows
function changeImage(direction) {
    let newIndex = currentImageIndex + direction;
    
    // Loop around
    if (newIndex < 0) {
        newIndex = images.length - 1;
    } else if (newIndex >= images.length) {
        newIndex = 0;
    }
    
    setImage(newIndex);
}

// Color selection functionality
function selectColor(color) {
    // Remove active class from all color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    // Add active class to selected color
    const selectedOption = document.querySelector(`[data-color="${color}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
    
    // Here you could also change the main image based on color
    // For now, we'll just show a console message
    console.log(`Selected color: ${color}`);
}

// Quantity controls
function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    let newValue = currentValue + delta;
    
    // Ensure value stays within bounds
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    quantityInput.value = newValue;
}

// Tab switching functionality
function showTab(tabName) {
    // Hide all tab panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab panel
    const selectedPanel = document.getElementById(tabName);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to selected tab button
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Add to cart functionality
function addToCart() {
    const quantity = document.getElementById('quantity').value;
    const selectedColor = document.querySelector('.color-option.active').getAttribute('data-color');
    
    // Here you would typically send this data to your cart system
    console.log(`Added to cart: ${quantity} items in ${selectedColor} color`);
    
    // Show success message
    alert('محصول به سبد خرید اضافه شد!');
}

// Wishlist functionality
function toggleWishlist() {
    const wishlistBtn = document.querySelector('.wishlist i');
    if (wishlistBtn.classList.contains('far')) {
        wishlistBtn.classList.remove('far');
        wishlistBtn.classList.add('fas');
        wishlistBtn.style.color = '#e74c3c';
        alert('به لیست علاقه‌مندی‌ها اضافه شد!');
    } else {
        wishlistBtn.classList.remove('fas');
        wishlistBtn.classList.add('far');
        wishlistBtn.style.color = '#666';
        alert('از لیست علاقه‌مندی‌ها حذف شد!');
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    const addToCartBtn = document.querySelector('.add-to-cart');
    const wishlistBtn = document.querySelector('.wishlist');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', toggleWishlist);
    }
    
    // Set up quantity input validation
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
        });
    }
    
    // Set up keyboard navigation for image gallery
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeImage(1); // Next image
        } else if (e.key === 'ArrowRight') {
            changeImage(-1); // Previous image
        }
    });
    
    // Set up touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const mainImageContainer = document.querySelector('.main-image-container');
    if (mainImageContainer) {
        mainImageContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        mainImageContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                changeImage(1);
            } else {
                // Swipe right - previous image
                changeImage(-1);
            }
        }
    }
    
    // Initialize with first image
    setImage(0);
    
    console.log('Product detail page initialized successfully!');
});

// Make functions globally available
window.setImage = setImage;
window.changeImage = changeImage;
window.selectColor = selectColor;
window.changeQuantity = changeQuantity;
window.showTab = showTab; 
