document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.querySelector('.product-title').textContent;
        alert(`${productName} به سبد خرید اضافه شد!`);
    });
});


document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('از پیام شما متشکریم! به زودی با شما تماس خواهیم گرفت.');
    this.reset();
});

document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.add('open');
    if (sidebarToggle) sidebarToggle.classList.add('hide');
  }
  function closeSidebar() {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    if (sidebarToggle) sidebarToggle.classList.remove('hide');
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', openSidebar);
  }
  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // User Profile Dropdown Functionality
  const userProfileDropdown = document.querySelector('.user-profile-dropdown');
  const userDropdownMenu = document.querySelector('.user-dropdown-menu');
  
  if (userProfileDropdown && userDropdownMenu) {
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      // Touch device behavior
      userProfileDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (userProfileDropdown.classList.contains('active')) {
          userProfileDropdown.classList.remove('active');
          userDropdownMenu.style.opacity = '0';
          userDropdownMenu.style.visibility = 'hidden';
          userDropdownMenu.style.transform = 'translate(-50%, -50%) scale(0.9)';
        } else {
          userProfileDropdown.classList.add('active');
          userDropdownMenu.style.opacity = '1';
          userDropdownMenu.style.visibility = 'visible';
          userDropdownMenu.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!userProfileDropdown.contains(e.target)) {
          userProfileDropdown.classList.remove('active');
          userDropdownMenu.style.opacity = '0';
          userDropdownMenu.style.visibility = 'hidden';
          userDropdownMenu.style.transform = 'translate(-50%, -50%) scale(0.9)';
        }
      });
    } else {
      // Desktop hover behavior
      userProfileDropdown.addEventListener('mouseenter', function() {
        userDropdownMenu.style.opacity = '1';
        userDropdownMenu.style.visibility = 'visible';
        userDropdownMenu.style.transform = 'translateY(0) scale(1)';
      });
      
      // Hide dropdown when mouse leaves
      userProfileDropdown.addEventListener('mouseleave', function() {
        userDropdownMenu.style.opacity = '0';
        userDropdownMenu.style.visibility = 'hidden';
        userDropdownMenu.style.transform = 'translateY(-15px) scale(0.95)';
      });
    }
    
    // Handle dropdown item clicks
    const dropdownItems = userDropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.querySelector('span').textContent;
        
        // Handle different actions
        switch(action) {
          case 'داشبورد':
            console.log('Navigating to Dashboard...');
            // Add navigation logic here
            break;
          case 'سبد خرید':
            console.log('Navigating to Shopping Cart...');
            // Add navigation logic here
            break;
          case 'علاقه‌مندی‌ها':
            console.log('Navigating to Wishlist...');
            // Add navigation logic here
            break;
          case 'سفارشات من':
            console.log('Navigating to My Orders...');
            // Add navigation logic here
            break;
          case 'پروفایل':
            console.log('Navigating to Profile...');
            // Add navigation logic here
            break;
          case 'تنظیمات':
            console.log('Navigating to Settings...');
            // Add navigation logic here
            break;
          case 'خروج':
            console.log('Logging out...');
            // Add logout logic here
            if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
              // Redirect to login page or perform logout
              window.location.href = '/Login page/login.html';
            }
            break;
        }
      });
    });
  }

  // Sidebar user menu functionality
  const sidebarUserItems = document.querySelectorAll('.sidebar-user-item');
  sidebarUserItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const action = this.querySelector('span').textContent;
      
      // Handle different actions (same as dropdown)
      switch(action) {
        case 'داشبورد':
          console.log('Navigating to Dashboard...');
          break;
        case 'سبد خرید':
          console.log('Navigating to Shopping Cart...');
          break;
        case 'علاقه‌مندی‌ها':
          console.log('Navigating to Wishlist...');
          break;
        case 'سفارشات من':
          console.log('Navigating to My Orders...');
          break;
        case 'پروفایل':
          console.log('Navigating to Profile...');
          break;
        case 'تنظیمات':
          console.log('Navigating to Settings...');
          break;
        case 'خروج':
          console.log('Logging out...');
          if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
            window.location.href = '/Login page/login.html';
          }
          break;
      }
    });
  });
});