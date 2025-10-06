// Orders JavaScript
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

    // Orders functionality
    let orders = [];
    
    function loadOrdersFromStorage() {
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
            orders = JSON.parse(savedOrders);
            renderOrders();
            updateStats();
        } else {
            loadSampleOrders();
        }
    }

    function loadSampleOrders() {
        orders = [
            {
                id: 'ORD-001',
                date: new Date('2024-01-15'),
                status: 'delivered',
                total: 1250000,
                items: [
                    {
                        name: 'گلدان کریستال ایرانی',
                        price: 450000,
                        quantity: 2,
                        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                    },
                    {
                        name: 'لیوان‌های شراب لوکس',
                        price: 280000,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                    }
                ]
            },
            {
                id: 'ORD-002',
                date: new Date('2024-01-20'),
                status: 'shipped',
                total: 680000,
                items: [
                    {
                        name: 'مجموعه کاسه تزئینی',
                        price: 320000,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                    },
                    {
                        name: 'کوزه آب دست‌ساز',
                        price: 380000,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                    }
                ]
            },
            {
                id: 'ORD-003',
                date: new Date('2024-01-25'),
                status: 'processing',
                total: 520000,
                items: [
                    {
                        name: 'دکانتر کریستال',
                        price: 520000,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                    }
                ]
            },
            {
                id: 'ORD-004',
                date: new Date('2024-01-30'),
                status: 'pending',
                total: 180000,
                items: [
                    {
                        name: 'مجموعه لیوان چای',
                        price: 180000,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                    }
                ]
            }
        ];
        renderOrders();
        updateStats();
        saveOrdersToStorage();
    }

    function renderOrders() {
        const ordersList = document.getElementById('ordersList');
        const emptyOrdersMessage = document.getElementById('emptyOrdersMessage');
        
        if (orders.length === 0) {
            ordersList.style.display = 'none';
            emptyOrdersMessage.style.display = 'block';
            return;
        }
        
        ordersList.style.display = 'flex';
        emptyOrdersMessage.style.display = 'none';
        
        ordersList.innerHTML = orders.map((order, index) => `
            <div class="order-item" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-number">${order.id}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                    <div class="order-status ${order.status}">${getStatusText(order.status)}</div>
                </div>
                <div class="order-content">
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item-detail">
                                <div class="order-item-image">
                                    <img src="${item.image}" alt="${item.name}">
                                </div>
                                <div class="order-item-info">
                                    <div class="order-item-name">${item.name}</div>
                                    <div class="order-item-price">${formatPrice(item.price)}</div>
                                    <div class="order-item-quantity">تعداد: ${item.quantity}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-summary">
                        <div class="order-total">مجموع: ${formatPrice(order.total)}</div>
                        <div class="order-actions">
                            ${getOrderActions(order.status, index)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to action buttons
        addOrderActionListeners();
    }

    function getStatusText(status) {
        const statusMap = {
            'pending': 'در انتظار پرداخت',
            'processing': 'در حال پردازش',
            'shipped': 'ارسال شده',
            'delivered': 'تحویل داده شده',
            'cancelled': 'لغو شده'
        };
        return statusMap[status] || status;
    }

    function getOrderActions(status, index) {
        let actions = '';
        
        if (status === 'pending') {
            actions += `<button class="action-btn view-order-btn" data-action="view" data-index="${index}">
                <i class="fas fa-eye"></i>
                مشاهده جزئیات
            </button>`;
            actions += `<button class="action-btn cancel-order-btn" data-action="cancel" data-index="${index}">
                <i class="fas fa-times"></i>
                لغو سفارش
            </button>`;
        } else if (status === 'processing') {
            actions += `<button class="action-btn view-order-btn" data-action="view" data-index="${index}">
                <i class="fas fa-eye"></i>
                مشاهده جزئیات
            </button>`;
            actions += `<button class="action-btn track-order-btn" data-action="track" data-index="${index}">
                <i class="fas fa-truck"></i>
                پیگیری ارسال
            </button>`;
        } else if (status === 'shipped') {
            actions += `<button class="action-btn view-order-btn" data-action="view" data-index="${index}">
                <i class="fas fa-eye"></i>
                مشاهده جزئیات
            </button>`;
            actions += `<button class="action-btn track-order-btn" data-action="track" data-index="${index}">
                <i class="fas fa-truck"></i>
                پیگیری ارسال
            </button>`;
        } else if (status === 'delivered') {
            actions += `<button class="action-btn view-order-btn" data-action="view" data-index="${index}">
                <i class="fas fa-eye"></i>
                مشاهده جزئیات
            </button>`;
            actions += `<button class="action-btn reorder-btn" data-action="reorder" data-index="${index}">
                <i class="fas fa-redo"></i>
                سفارش مجدد
            </button>`;
        }
        
        return actions;
    }

    function addOrderActionListeners() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const index = parseInt(this.getAttribute('data-index'));
                handleOrderAction(action, index);
            });
        });
    }

    function handleOrderAction(action, index) {
        const order = orders[index];
        
        switch (action) {
            case 'view':
                showOrderDetails(order);
                break;
            case 'track':
                trackOrder(order);
                break;
            case 'reorder':
                reorderItems(order);
                break;
            case 'cancel':
                cancelOrder(index);
                break;
        }
    }

    function showOrderDetails(order) {
        const itemsList = order.items.map(item => 
            `${item.name} - ${formatPrice(item.price)} × ${item.quantity}`
        ).join('\n');
        
        alert(`جزئیات سفارش ${order.id}:\n\n${itemsList}\n\nمجموع: ${formatPrice(order.total)}\nوضعیت: ${getStatusText(order.status)}\nتاریخ: ${formatDate(order.date)}`);
    }

    function trackOrder(order) {
        alert(`پیگیری سفارش ${order.id}:\n\nوضعیت: ${getStatusText(order.status)}\n\nاین بخش در حال توسعه است. لطفاً بعداً مراجعه کنید.`);
    }

    function reorderItems(order) {
        if (confirm(`آیا می‌خواهید محصولات سفارش ${order.id} را دوباره سفارش دهید؟`)) {
            // Add items to cart
            let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
            
            order.items.forEach(item => {
                const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
                
                if (existingItemIndex !== -1) {
                    cart[existingItemIndex].quantity += item.quantity;
                } else {
                    cart.push({
                        id: Date.now() + Math.random(),
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: item.quantity
                    });
                }
            });
            
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            showNotification('محصولات به سبد خرید اضافه شدند!', 'success');
            
            // Update cart badge
            updateCartBadge();
        }
    }

    function cancelOrder(index) {
        const order = orders[index];
        if (confirm(`آیا مطمئن هستید که می‌خواهید سفارش ${order.id} را لغو کنید؟`)) {
            order.status = 'cancelled';
            renderOrders();
            updateStats();
            saveOrdersToStorage();
            showNotification('سفارش با موفقیت لغو شد', 'success');
        }
    }

    function updateStats() {
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const shippedOrders = orders.filter(order => order.status === 'shipped').length;
        const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
        
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('shippedOrders').textContent = shippedOrders;
        document.getElementById('deliveredOrders').textContent = deliveredOrders;
    }

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    function formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    function saveOrdersToStorage() {
        localStorage.setItem('userOrders', JSON.stringify(orders));
    }

    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const timeFilter = document.getElementById('timeFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    if (timeFilter) {
        timeFilter.addEventListener('change', applyFilters);
    }

    function applyFilters() {
        let filteredOrders = [...orders];
        
        // Status filter
        const statusValue = statusFilter.value;
        if (statusValue !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === statusValue);
        }
        
        // Time filter
        const timeValue = timeFilter.value;
        if (timeValue !== 'all') {
            const now = new Date();
            const timeLimits = {
                'week': 7,
                'month': 30,
                'quarter': 90,
                'year': 365
            };
            
            if (timeLimits[timeValue]) {
                const limitDate = new Date(now.getTime() - (timeLimits[timeValue] * 24 * 60 * 60 * 1000));
                filteredOrders = filteredOrders.filter(order => order.date >= limitDate);
            }
        }
        
        // Sort filter
        const sortValue = sortFilter.value;
        switch (sortValue) {
            case 'newest':
                filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'price-high':
                filteredOrders.sort((a, b) => b.total - a.total);
                break;
            case 'price-low':
                filteredOrders.sort((a, b) => a.total - b.total);
                break;
        }
        
        renderFilteredOrders(filteredOrders);
    }

    function renderFilteredOrders(filteredOrders) {
        const ordersList = document.getElementById('ordersList');
        const emptyOrdersMessage = document.getElementById('emptyOrdersMessage');
        
        if (filteredOrders.length === 0) {
            ordersList.style.display = 'none';
            emptyOrdersMessage.style.display = 'block';
            emptyOrdersMessage.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>نتیجه‌ای یافت نشد</h3>
                <p>با فیلترهای انتخاب شده سفارشی یافت نشد</p>
                <button onclick="resetFilters()" class="browse-products-btn">
                    <i class="fas fa-undo"></i>
                    بازنشانی فیلترها
                </button>
            `;
            return;
        }
        
        ordersList.style.display = 'flex';
        emptyOrdersMessage.style.display = 'none';
        
        ordersList.innerHTML = filteredOrders.map((order, index) => `
            <div class="order-item" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-number">${order.id}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                    <div class="order-status ${order.status}">${getStatusText(order.status)}</div>
                </div>
                <div class="order-content">
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item-detail">
                                <div class="order-item-image">
                                    <img src="${item.image}" alt="${item.name}">
                                </div>
                                <div class="order-item-info">
                                    <div class="order-item-name">${item.name}</div>
                                    <div class="order-item-price">${formatPrice(item.price)}</div>
                                    <div class="order-item-quantity">تعداد: ${item.quantity}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-summary">
                        <div class="order-total">مجموع: ${formatPrice(order.total)}</div>
                        <div class="order-actions">
                            ${getOrderActions(order.status, index)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        addOrderActionListeners();
    }

    window.resetFilters = function() {
        statusFilter.value = 'all';
        sortFilter.value = 'newest';
        timeFilter.value = 'all';
        renderOrders();
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

    // Initialize orders
    loadOrdersFromStorage();
    updateCartBadge();
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
