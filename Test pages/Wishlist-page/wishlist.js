// Wishlist JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }

    // User profile dropdown functionality
    const userProfileDropdown = document.querySelector('.user-profile-dropdown');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    
    if (userProfileDropdown && userDropdownMenu) {
        let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            userProfileDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdownMenu.classList.toggle('active');
                userProfileDropdown.classList.toggle('active');
            });
        } else {
            userProfileDropdown.addEventListener('mouseenter', function() {
                userDropdownMenu.classList.add('active');
                userProfileDropdown.classList.add('active');
            });
            
            userProfileDropdown.addEventListener('mouseleave', function() {
                userDropdownMenu.classList.remove('active');
                userProfileDropdown.classList.remove('active');
            });
        }
    }

    // Wishlist functionality
    let wishlistItems = [];
    
    function loadWishlistFromStorage() {
        const savedWishlist = localStorage.getItem('userWishlist');
        if (savedWishlist) {
            wishlistItems = JSON.parse(savedWishlist);
            renderWishlistItems();
        } else {
            loadSampleWishlistItems();
        }
    }

    function loadSampleWishlistItems() {
        wishlistItems = [
            {
                id: 1,
                name: 'گلدان کریستال ایرانی',
                price: 450000,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                description: 'گلدان کریستال دست‌ساز با نقوش پیچیده ایرانی. مناسب برای نمایش گل‌های تازه یا به عنوان قطعه تزئینی.',
                addedDate: new Date('2024-01-15')
            },
            {
                id: 2,
                name: 'لیوان‌های شراب لوکس',
                price: 280000,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                description: 'مجموعه ۶ عددی لیوان‌های شراب برتر با تزئینات طلایی. هر لیوان به صورت جداگانه برای تجربه نوشیدن بی‌نظیر ساخته شده است.',
                addedDate: new Date('2024-01-20')
            },
            {
                id: 3,
                name: 'مجموعه کاسه تزئینی',
                price: 320000,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                description: 'مجموعه ۳ عددی کاسه‌های شیشه‌ای دست‌ساز در اندازه‌های مختلف. مناسب برای سرو یا تزئین خانه.',
                addedDate: new Date('2024-01-25')
            },
            {
                id: 4,
                name: 'کوزه آب دست‌ساز',
                price: 380000,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                description: 'کوزه شیشه‌ای زیبای دست‌ساز با نقوش سنتی ایرانی. مناسب برای سرو آب یا نوشیدنی‌ها.',
                addedDate: new Date('2024-01-30')
            }
        ];
        renderWishlistItems();
        saveWishlistToStorage();
    }

    function renderWishlistItems() {
        const wishlistItemsContainer = document.getElementById('wishlistItems');
        const emptyWishlistMessage = document.getElementById('emptyWishlistMessage');
        
        if (wishlistItems.length === 0) {
            wishlistItemsContainer.style.display = 'none';
            emptyWishlistMessage.style.display = 'block';
            return;
        }
        
        wishlistItemsContainer.style.display = 'grid';
        emptyWishlistMessage.style.display = 'none';
        
        wishlistItemsContainer.innerHTML = wishlistItems.map((item, index) => `
            <div class="wishlist-item" data-id="${item.id}">
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <span class="wishlist-item-badge">محبوب</span>
                </div>
                <div class="wishlist-item-content">
                    <div class="wishlist-item-title">${item.name}</div>
                    <div class="wishlist-item-description">${item.description}</div>
                    <div class="wishlist-item-price">${formatPrice(item.price)}</div>
                    <div class="wishlist-item-actions">
                        <button class="add-to-cart-btn" onclick="addToCart(${index})">
                            <i class="fas fa-shopping-cart"></i>
                            افزودن به سبد
                        </button>
                        <button class="remove-wishlist-btn" onclick="removeFromWishlist(${index})">
                            <i class="fas fa-heart-broken"></i>
                            حذف
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    window.addToCart = function(index) {
        const item = wishlistItems[index];
        
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }
        
        // Save updated cart
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        
        // Show success message
        showNotification(`${item.name} به سبد خرید اضافه شد!`, 'success');
        
        // Update cart badge in header
        updateCartBadge();
    }

    window.removeFromWishlist = function(index) {
        const item = wishlistItems[index];
        const itemName = item.name;
        
        if (confirm(`آیا مطمئن هستید که می‌خواهید ${itemName} را از علاقه‌مندی‌ها حذف کنید؟`)) {
            // Add removing animation
            const wishlistItem = document.querySelector(`[data-id="${item.id}"]`);
            wishlistItem.classList.add('removing');
            
            setTimeout(() => {
                wishlistItems.splice(index, 1);
                renderWishlistItems();
                saveWishlistToStorage();
                showNotification(`${itemName} از علاقه‌مندی‌ها حذف شد`, 'success');
            }, 300);
        }
    }

    function saveWishlistToStorage() {
        localStorage.setItem('userWishlist', JSON.stringify(wishlistItems));
    }

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
    }

    // Clear wishlist functionality
    const clearWishlistBtn = document.getElementById('clearWishlistBtn');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', function() {
            if (confirm('آیا مطمئن هستید که می‌خواهید تمام علاقه‌مندی‌ها را پاک کنید؟')) {
                wishlistItems = [];
                renderWishlistItems();
                saveWishlistToStorage();
                showNotification('لیست علاقه‌مندی‌ها پاک شد', 'success');
            }
        });
    }

    // Sorting functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortWishlistItems(sortBy);
        });
    }

    function sortWishlistItems(sortBy) {
        const sortedItems = [...wishlistItems];
        
        switch (sortBy) {
            case 'newest':
                sortedItems.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
                break;
            case 'oldest':
                sortedItems.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate));
                break;
            case 'price-low':
                sortedItems.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedItems.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sortedItems.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
                break;
        }
        
        wishlistItems = sortedItems;
        renderWishlistItems();
    }

    // View toggle functionality
    const viewSelect = document.getElementById('viewSelect');
    if (viewSelect) {
        viewSelect.addEventListener('change', function() {
            const wishlistItemsContainer = document.getElementById('wishlistItems');
            if (this.value === 'list') {
                wishlistItemsContainer.classList.add('list-view');
            } else {
                wishlistItemsContainer.classList.remove('list-view');
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            font-family: 'Vazirmatn', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function() {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Initialize wishlist
    loadWishlistFromStorage();
    updateCartBadge();
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
