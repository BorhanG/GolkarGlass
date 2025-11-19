// My Orders Page - Advanced Version (GolkarGlass)

document.addEventListener('DOMContentLoaded', function() {
    renderOrders();
    setupSidebar();
    setupFilters();
    animateOrderCards();
    setupSearch();
});

// Sample orders data (add more for demo)
const orders = [
    {
        id: 'ORD-20250831-001',
        date: '۱۴۰۴/۰۶/۰۹',
        status: 'تحویل شده',
        statusClass: '',
        total: 780000,
        address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
        payment: 'آنلاین',
        items: [
            { title: 'گلدان کریستال ایرانی', qty: 1, img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80' },
            { title: 'لیوان‌های شراب لوکس', qty: 2, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80' }
        ],
        canCancel: false,
        canTrack: true,
        canInvoice: true
    },
    {
        id: 'ORD-20250825-002',
        date: '۱۴۰۴/۰۶/۰۳',
        status: 'در انتظار پرداخت',
        statusClass: 'pending',
        total: 320000,
        address: 'اصفهان، خیابان چهارباغ، پلاک ۴۵',
        payment: 'در محل',
        items: [
            { title: 'کوزه آب دست‌ساز', qty: 1, img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80' }
        ],
        canCancel: true,
        canTrack: false,
        canInvoice: false
    },
    {
        id: 'ORD-20250810-003',
        date: '۱۴۰۴/۰۵/۲۰',
        status: 'لغو شده',
        statusClass: 'canceled',
        total: 0,
        address: 'شیراز، بلوار ستارخان، پلاک ۸۸',
        payment: 'آنلاین',
        items: [
            { title: 'دکانتر کریستال', qty: 1, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80' }
        ],
        canCancel: false,
        canTrack: false,
        canInvoice: false
    }
];

let filteredOrders = orders;

function renderOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;
    if (filteredOrders.length === 0) {
        container.innerHTML = `<div class="empty-orders-message">
            <i class="fas fa-box"></i>
            <h3>سفارشی یافت نشد</h3>
            <a href="../Product page/products.html" class="browse-products-btn">
                <i class="fas fa-shopping-bag"></i>
                مشاهده محصولات
            </a>
        </div>`;
        return;
    }
    container.innerHTML = filteredOrders.map((order, idx) => createOrderCard(order, idx)).join('');
}

function createOrderCard(order, idx) {
    return `<div class="order-card" style="animation-delay:${idx * 0.12}s">
        <div class="order-header">
            <span class="order-id">${order.id}</span>
            <span class="order-status ${order.statusClass}">${order.status}</span>
            <span class="order-date">${order.date}</span>
        </div>
        <div class="order-details-row">
            <span class="order-address"><i class='fas fa-map-marker-alt'></i> ${order.address}</span>
            <span class="order-payment"><i class='fas fa-credit-card'></i> ${order.payment}</span>
        </div>
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <img class="order-item-img" src="${item.img}" alt="${item.title}">
                    <span class="order-item-title">${item.title}</span>
                    <span class="order-item-qty">×${item.qty}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-total">جمع کل: ${formatPrice(order.total)}</div>
        <div class="order-actions">
            ${order.canTrack ? `<button class="order-btn track-btn"><i class="fas fa-truck"></i> پیگیری سفارش</button>` : ''}
            ${order.canInvoice ? `<button class="order-btn invoice-btn"><i class="fas fa-file-invoice"></i> دریافت فاکتور</button>` : ''}
            ${order.canCancel ? `<button class="order-btn cancel-btn"><i class="fas fa-times-circle"></i> لغو سفارش</button>` : ''}
            <button class="order-btn details-btn"><i class="fas fa-info-circle"></i> جزئیات</button>
        </div>
    </div>`;
}

function formatPrice(price) {
    if (!price) return '۰ تومان';
    return price.toLocaleString('fa-IR') + ' تومان';
}

function animateOrderCards() {
    setTimeout(() => {
        document.querySelectorAll('.order-card').forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('animated');
            }, 200 + i * 100);
        });
    }, 200);
}

function setupSidebar() {
    // ...same as before...
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebarMenu.classList.add('open');
            sidebarOverlay.classList.add('open');
            sidebarToggle.classList.add('hide');
            document.body.classList.add('sidebar-open');
        });
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebarMenu.classList.remove('open');
            sidebarOverlay.classList.remove('open');
            sidebarToggle.classList.remove('hide');
            document.body.classList.remove('sidebar-open');
        });
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebarMenu.classList.remove('open');
            sidebarOverlay.classList.remove('open');
            sidebarToggle.classList.remove('hide');
            document.body.classList.remove('sidebar-open');
        });
    }
}

function setupFilters() {
    const filterSelect = document.getElementById('orderFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const val = this.value;
            if (val === 'all') filteredOrders = orders;
            else filteredOrders = orders.filter(o => o.statusClass === val || (val === 'delivered' && o.statusClass === ''));
            renderOrders();
            animateOrderCards();
        });
    }
}

function setupSearch() {
    const searchInput = document.getElementById('orderSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const q = this.value.trim();
            if (!q) {
                filteredOrders = orders;
            } else {
                filteredOrders = orders.filter(o => o.id.includes(q) || o.items.some(i => i.title.includes(q)));
            }
            renderOrders();
            animateOrderCards();
        });
    }
}
