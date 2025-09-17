// Shopping Cart JavaScript - Interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality
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
                        window.location.href = '/Dashboard page/dashboard.html';
                        break;
                    case 'سبد خرید':
                        console.log('Already on Shopping Cart');
                        break;
                    case 'علاقه‌مندی‌ها':
                        window.location.href = '/Wishlist-page/wishlist.html';
                        break;
                    case 'سفارشات من':
                        window.location.href = '/Orders-page/orders.html';
                        break;
                    case 'پروفایل':
                        window.location.href = '/Profile-page/profile.html';
                        break;
                    case 'تنظیمات':
                        window.location.href = '/Settings-page/settings.html';
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
                    window.location.href = '/Dashboard page/dashboard.html';
                    break;
                case 'سبد خرید':
                    console.log('Already on Shopping Cart');
                    break;
                case 'علاقه‌مندی‌ها':
                    window.location.href = '/Wishlist-page/wishlist.html';
                    break;
                case 'سفارشات من':
                    window.location.href = '/Orders-page/orders.html';
                    break;
                case 'پروفایل':
                    window.location.href = '/Profile-page/profile.html';
                    break;
                case 'تنظیمات':
                    window.location.href = '/Settings-page/settings.html';
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

    // Cart functionality
    let cartItems = [];
    let cartTotal = 0;
    let cartItemCount = 0;

    // Initialize cart
    function initCart() {
        loadCartFromStorage();
        renderCart();
        updateCartSummary();
    }

    // Load cart from localStorage
    function loadCartFromStorage() {
        try {
            const storedCart = localStorage.getItem('shoppingCart');
            if (storedCart) {
                cartItems = JSON.parse(storedCart);
            } else {
                // Load sample cart items if no stored cart
                loadSampleCartItems();
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            loadSampleCartItems();
        }
    }

    // Load sample cart items
    function loadSampleCartItems() {
        cartItems = [
            {
                id: 1,
                name: 'گلدان کریستال ایرانی',
                price: 450000,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                quantity: 1
            },
            {
                id: 2,
                name: 'لیوان‌های شراب لوکس',
                price: 280000,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                quantity: 2
            },
            {
                id: 3,
                name: 'مجموعه کاسه تزئینی',
                price: 320000,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                quantity: 1
            }
        ];
    }

    // Render cart items
    function renderCart() {
        const cartContainer = document.getElementById('cartItems');
        const emptyMessage = document.getElementById('emptyCartMessage');
        
        if (cartItems.length === 0) {
            cartContainer.style.display = 'none';
            emptyMessage.style.display = 'block';
            return;
        }
        
        cartContainer.style.display = 'block';
        emptyMessage.style.display = 'none';
        
        cartContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="qty-btn minus" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <span class="qty-number">${item.quantity}</span>
                            <button class="qty-btn plus" onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeItem(${item.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Change item quantity
    window.changeQuantity = function(itemId, delta) {
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity > 0) {
                item.quantity = newQuantity;
            } else if (newQuantity === 0) {
                removeItem(itemId);
                return;
            }
            
            saveCartToStorage();
            renderCart();
            updateCartSummary();
            showNotification(`تعداد ${item.name} به ${item.quantity} تغییر یافت`, 'info');
        }
    };

    // Remove item from cart
    window.removeItem = function(itemId) {
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const item = cartItems[itemIndex];
            if (confirm(`آیا مطمئن هستید که می‌خواهید ${item.name} را حذف کنید؟`)) {
                cartItems.splice(itemIndex, 1);
                saveCartToStorage();
                renderCart();
                updateCartSummary();
                showNotification(`${item.name} از سبد خرید حذف شد`, 'success');
            }
        }
    };

    // Clear cart
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (cartItems.length === 0) {
                showNotification('سبد خرید شما خالی است', 'info');
                return;
            }
            
            if (confirm('آیا مطمئن هستید که می‌خواهید تمام سبد خرید را پاک کنید؟')) {
                cartItems = [];
                saveCartToStorage();
                renderCart();
                updateCartSummary();
                showNotification('سبد خرید پاک شد', 'success');
            }
        });
    }

    // Update cart summary
    function updateCartSummary() {
        cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Update summary display
        const totalItemsElement = document.getElementById('totalItems');
        const subtotalElement = document.getElementById('subtotal');
        const totalAmountElement = document.getElementById('totalAmount');
        
        if (totalItemsElement) totalItemsElement.textContent = cartItemCount;
        if (subtotalElement) subtotalElement.textContent = formatPrice(cartTotal);
        if (totalAmountElement) totalAmountElement.textContent = formatPrice(cartTotal);
        
        // Update cart badge in header
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = cartItemCount;
        }
        
        // Disable checkout button if cart is empty
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = cartItemCount === 0;
        }
    }

    // Save cart to localStorage
    function saveCartToStorage() {
        try {
            localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Format price
    function formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    // Checkout functionality
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartItems.length === 0) {
                showNotification('سبد خرید شما خالی است!', 'error');
                return;
            }

            showNotification(`در حال انتقال به صفحه پرداخت برای مبلغ ${formatPrice(cartTotal)}...`, 'success');

            // Redirect to the new checkout page
            setTimeout(() => {
                window.location.href = '/Checkout page/checkout.html';
            }, 800);
        });
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
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
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Initialize cart when page loads
    initCart();

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // Add touch gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
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

    // Add loading animations for cart items
    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        const items = cartItemsContainer.querySelectorAll('.cart-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Add confirmation for logout
    const logoutItems = document.querySelectorAll('.logout-item');
    logoutItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
                window.location.href = '/Login page/login.html';
            }
        });
    });

    // Example notifications
    setTimeout(() => {
        showNotification('سبد خرید شما با موفقیت بارگذاری شد!', 'success');
    }, 1000);
}); 