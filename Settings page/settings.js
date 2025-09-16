// Settings Page - GolkarGlass

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar logic (reuse from other pages)
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

    // Settings form logic
    const form = document.getElementById('settingsForm');
    // Helper: Save/load arrays (addresses/cards)
    function saveList(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }
    function loadList(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
    // Helper: Save/load all settings
    function saveSettings(data) { localStorage.setItem('settingsInfo', JSON.stringify(data)); }
    function loadSettings() { try { return JSON.parse(localStorage.getItem('settingsInfo')) || {}; } catch { return {}; } }

    // Helper: safely call global site theme setter (wait briefly if footer.js hasn't loaded yet)
    function callSetSiteTheme(theme) {
        if (!theme) return;
        var attempts = 0;
        var maxAttempts = 10; // ~1 second (10 * 100ms)
        var iv = setInterval(function() {
            attempts++;
            if (window.setSiteTheme && typeof window.setSiteTheme === 'function') {
                try { window.setSiteTheme(theme); } catch(e){}
                clearInterval(iv);
                return;
            }
            if (attempts >= maxAttempts) { clearInterval(iv); }
        }, 100);
    }

    // --- Addresses ---
    function renderAddresses() {
        const list = document.getElementById('addressesList');
        if (!list) return;
        const addresses = loadList('addressesList');
        list.innerHTML = addresses.map((a,i) => `<span class="address-item">${a}<button class="remove-address-btn" data-idx="${i}">حذف</button></span>`).join('') || '<span style="color:#888">آدرسی ذخیره نشده است</span>';
        list.querySelectorAll('.remove-address-btn').forEach(btn => {
            btn.onclick = function() {
                addresses.splice(+btn.dataset.idx,1); saveList('addressesList',addresses); renderAddresses();
            };
        });
    }
    if (document.querySelector('.settings-add-address-btn')) {
        document.querySelector('.settings-add-address-btn').onclick = function() {
            const val = document.getElementById('newAddress').value.trim();
            if(val) { let arr=loadList('addressesList'); arr.push(val); saveList('addressesList',arr); renderAddresses(); document.getElementById('newAddress').value=''; }
        };
    }
    renderAddresses();

    // --- Cards ---
    function renderCards() {
        const list = document.getElementById('cardsList');
        if (!list) return;
        const cards = loadList('cardsList');
        list.innerHTML = cards.map((c,i) => `<span class="card-item">${c}<button class="remove-card-btn" data-idx="${i}">حذف</button></span>`).join('') || '<span style="color:#888">کارتی ذخیره نشده است</span>';
        list.querySelectorAll('.remove-card-btn').forEach(btn => {
            btn.onclick = function() {
                cards.splice(+btn.dataset.idx,1); saveList('cardsList',cards); renderCards();
            };
        });
    }
    if (document.querySelector('.settings-add-card-btn')) {
        document.querySelector('.settings-add-card-btn').onclick = function() {
            const val = document.getElementById('newCard').value.trim();
            if(val) { let arr=loadList('cardsList'); arr.push(val); saveList('cardsList',arr); renderCards(); document.getElementById('newCard').value=''; }
        };
    }
    renderCards();

    // --- Password Change ---
    if (document.querySelector('.settings-password-btn')) {
        document.querySelector('.settings-password-btn').onclick = function() {
            const oldP = form.oldPassword.value, newP = form.newPassword.value, confP = form.confirmPassword.value;
            if (!oldP || !newP || !confP) return showSettingsNotification('همه فیلدهای رمز را پر کنید','error');
            if (newP !== confP) return showSettingsNotification('رمز جدید و تکرار آن یکسان نیست','error');
            // Demo: just show success
            showSettingsNotification('رمز عبور با موفقیت تغییر کرد!','success');
            form.oldPassword.value = form.newPassword.value = form.confirmPassword.value = '';
        };
    }

    // --- Delete Account ---
    if (document.querySelector('.settings-delete-btn')) {
        document.querySelector('.settings-delete-btn').onclick = function() {
            if(confirm('آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟')) {
                localStorage.clear();
                showSettingsNotification('حساب شما حذف شد!','error');
                setTimeout(()=>window.location.href='../Login page/login.html', 1500);
            }
        };
    }

    // --- Save/Load All Settings ---
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Save settings to localStorage (demo)
            const data = {
                currency: form.currency.value,
                theme: form.theme.value,
                notifications: form.notifications.value,
                language: form.language.value,
                notifLang: form.notifLang.value,
                fontSize: form.fontSize.value,
                highContrast: form.highContrast.checked,
                profilePublic: form.profilePublic.checked,
                orderHistoryPublic: form.orderHistoryPublic.checked,
                emailMarketing: form.emailMarketing.checked,
                smsMarketing: form.smsMarketing.checked
            };
            saveSettings(data);
            showSettingsNotification('تنظیمات با موفقیت ذخیره شد!', 'success');
            // Apply global theme site-wide through shared theme manager (wait if manager not loaded yet)
            callSetSiteTheme(data.theme);
            // Demo: font size
            document.body.style.fontSize = data.fontSize === 'large' ? '1.25rem' : data.fontSize === 'xlarge' ? '1.5rem' : '';
            // Demo: high contrast
            if (data.highContrast) {
                document.body.style.filter = 'contrast(1.3)';
            } else {
                document.body.style.filter = '';
            }
        });
        // Load settings if exists
        const data = loadSettings();
        Object.keys(data).forEach(key => {
            if (form[key] !== undefined) {
                if (form[key].type === 'checkbox') form[key].checked = !!data[key];
                else form[key].value = data[key];
            }
        });
        // Demo: apply theme/font/contrast
        // Initialize current theme through shared theme manager (if exists)
        callSetSiteTheme(data.theme || 'light');
        if (data.fontSize === 'large') document.body.style.fontSize = '1.25rem';
        if (data.fontSize === 'xlarge') document.body.style.fontSize = '1.5rem';
        if (data.highContrast) document.body.style.filter = 'contrast(1.3)';
    }
    // Logout button
    const logoutBtn = document.querySelector('.settings-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showSettingsNotification('شما خارج شدید!', 'info');
            setTimeout(()=>window.location.href='../Login page/login.html', 1200);
        });
    }
});

function showSettingsNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = 'settings-demo-notification ' + type;
    n.textContent = msg;
    n.style.cssText = 'position:fixed;top:120px;right:20px;background:#d4af37;color:#fff;padding:1rem 1.5rem;border-radius:10px;z-index:10000;box-shadow:0 5px 15px rgba(0,0,0,0.2);font-family:Vazirmatn,sans-serif;font-weight:500;max-width:300px;transition:opacity 0.3s;opacity:1;';
    document.body.appendChild(n);
    setTimeout(()=>{n.style.opacity=0;setTimeout(()=>n.remove(),300);},2000);
}
