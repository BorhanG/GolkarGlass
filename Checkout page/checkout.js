document.addEventListener('DOMContentLoaded', function(){
  const addressList = document.getElementById('addressList');
  const addAddressBtn = document.getElementById('addAddressBtn');
  const modal = document.getElementById('modal');
  const addressForm = document.getElementById('addressForm');
  const cancelAddress = document.getElementById('cancelAddress');
  const orderItemsEl = document.getElementById('orderItems');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryTotal = document.getElementById('summaryTotal');
  const placeOrderBtn = document.getElementById('placeOrder');

  // Load cart from localStorage
  function loadCart(){
    try{
      const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
      return cart;
    }catch(e){
      return [];
    }
  }

  function formatPrice(price){
    return price.toLocaleString('fa-IR') + ' تومان';
  }

  // Render order items
  function renderOrder(){
    const cart = loadCart();
    if(!orderItemsEl) return;
    orderItemsEl.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item=>{
      subtotal += item.price * (item.quantity||1);
      const node = document.createElement('div');
      node.className = 'order-item';
      node.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="meta">
          <div class="title">${item.name}</div>
          <div class="qty">تعداد: ${item.quantity || 1}</div>
        </div>
        <div class="price">${formatPrice(item.price * (item.quantity||1))}</div>
      `;
      orderItemsEl.appendChild(node);
    });
    summarySubtotal.textContent = formatPrice(subtotal);
    summaryTotal.textContent = formatPrice(subtotal);
  }

  // Saved cards (simple local storage emulation)
  function loadSavedCards(){
    try{ return JSON.parse(localStorage.getItem('savedCards') || '[]'); }catch(e){return []}
  }
  function saveSavedCards(list){ localStorage.setItem('savedCards', JSON.stringify(list)); }

  function renderSavedCards(){
    const container = document.getElementById('savedCards');
    if(!container) return;
    const cards = loadSavedCards();
    container.innerHTML = '';
    if(cards.length===0){ container.innerHTML = '<div class="muted">کارت ذخیره شده‌ای وجود ندارد</div>'; return; }
    cards.forEach((c, idx)=>{
      const el = document.createElement('div');
      el.className = 'saved-card';
      el.innerHTML = `<div class="meta"><div class="chip">${c.brand||'VB'}</div><div class="label">**** **** **** ${c.last4} — ${c.name}</div></div><div class="actions"><button data-idx="${idx}" class="btn ghost use-card">انتخاب</button></div>`;
      container.appendChild(el);
    });
    // attach listeners
    container.querySelectorAll('.use-card').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const idx = btn.dataset.idx; localStorage.setItem('selectedCard', idx); showToast('کارت انتخاب شد', 'success');
      });
    });
  }

  // Addresses (simple local storage)
  function loadAddresses(){
    try{ return JSON.parse(localStorage.getItem('userAddresses') || '[]'); }catch(e){return []}
  }
  function saveAddresses(list){ localStorage.setItem('userAddresses', JSON.stringify(list)); }

  function renderAddresses(){
    const addrs = loadAddresses();
    addressList.innerHTML = '';
    if(addrs.length===0){
      addressList.innerHTML = '<div class="address-empty">هیچ آدرسی ثبت نشده است</div>';
      return;
    }
    addrs.forEach((a, idx)=>{
      const el = document.createElement('div');
      el.className = 'address-item';
      el.dataset.idx = idx;
      el.innerHTML = `<div class="address-name">${a.fullName} — ${a.phone}</div><div class="address-details">${a.street}, ${a.city}</div>`;
      el.addEventListener('click', ()=>{
        document.querySelectorAll('.address-item').forEach(i=>i.classList.remove('selected'));
        el.classList.add('selected');
        localStorage.setItem('selectedAddress', idx);
      });
      addressList.appendChild(el);
    });

    // pre-select first
    const selected = localStorage.getItem('selectedAddress');
    if(selected!==null && addressList.children[selected]) addressList.children[selected].classList.add('selected');
  }

  // Modal handlers
  const addBack=document.querySelector(".modal_back");
  addAddressBtn.addEventListener('click', ()=>{ modal.classList.remove('hidden'); });
  addAddressBtn.addEventListener('click', ()=>{ modal.classList.add('show'); });
  addAddressBtn.addEventListener('click', ()=>{ addBack.classList.remove('hidden'); });
  addAddressBtn.addEventListener('click', ()=>{ addBack.classList.add('show'); });
  cancelAddress.addEventListener('click', ()=>{ modal.classList.add('hidden'); });
  cancelAddress.addEventListener('click', ()=>{ modal.classList.remove('show'); });

  addressForm.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(addressForm);
    const addr = {
      fullName: data.get('fullName'),
      phone: data.get('phone'),
      street: data.get('street'),
      city: data.get('city')
    };
    const list = loadAddresses();
    list.push(addr);
    saveAddresses(list);
    addressForm.reset();
    modal.classList.add('hidden');
    renderAddresses();
    showToast('آدرس جدید ذخیره شد', 'success');
  });

  // Place order
  placeOrderBtn.addEventListener('click', ()=>{
    const selectedAddress = localStorage.getItem('selectedAddress');
    if(selectedAddress===null){ showToast('لطفا یک آدرس انتخاب کنید', 'error'); return; }
    const payment = document.querySelector('input[name="payment"]:checked').value;

    // If card payment and card entry visible, do minimal validation
    if(payment==='card'){
      const selectedCard = localStorage.getItem('selectedCard');
      if(!selectedCard){
        // check if new card filled
        const num = document.getElementById('cardNumber').value.trim();
        if(num.length < 12){ showToast('لطفا اطلاعات کارت را وارد کنید', 'error'); return; }
      }
    }

    // Simulate payment flow with nicer animation
    placeOrderBtn.disabled = true;
    placeOrderBtn.classList.add('show-animate');
    placeOrderBtn.textContent = 'در حال پردازش پرداخت...';

    setTimeout(()=>{
      // save card if requested
      const saveCard = document.getElementById('saveCard');
      if(saveCard && saveCard.checked){
        const list = loadSavedCards();
        const num = (document.getElementById('cardNumber')||{}).value || '';
        list.push({last4: num.slice(-4), name: (document.getElementById('cardName')||{}).value||'ذخیره شده', brand:'VC'});
        saveSavedCards(list);
      }

      // pretend success
      localStorage.removeItem('shoppingCart');
      showToast('پرداخت با موفقیت انجام شد — سفارش ثبت شد', 'success');
      setTimeout(()=>{
        window.location.href = '/Checkout page/checkout-success.html';
      },1200);
    },1800);
  });

  // Payment method toggle shows card entry
  document.querySelectorAll('input[name="payment"]').forEach(radio=>{
    radio.addEventListener('change', ()=>{
      const cardEntry = document.getElementById('cardEntry');
      if(document.querySelector('input[name="payment"]:checked').value === 'card'){
        cardEntry.classList.remove('hidden');
      } else {
        cardEntry.classList.add('hidden');
      }
    });
  });

  // promo code application (very basic)
  // create promo UI if not present
  const promoRow = document.createElement('div'); promoRow.className='promo-row'; promoRow.innerHTML = '<input id="promoCode" placeholder="کد تخفیف"><button class="apply-btn">اعمال</button>';
  document.querySelector('.order-summary .card')?.prepend(promoRow);
  promoRow.querySelector('.apply-btn').addEventListener('click', ()=>{
    const code = document.getElementById('promoCode').value.trim();
    if(code === 'GG10'){ showToast('تخفیف 10% اعمال شد', 'success'); /* no real calc for demo */ }
    else showToast('کد نامعتبر است', 'error');
  });

  // Toast
  function showToast(msg, type='info'){
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    t.style.cssText = 'position:fixed;left:20px;bottom:20px;padding:12px 16px;border-radius:10px;color:#fff;z-index:9999;transform:translateY(20px);opacity:0;transition:all .28s';
    t.style.background = type==='success'?'#27ae60':type==='error'?'#e74c3c':'#3498db';
    document.body.appendChild(t);
    requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='none'; });
    setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(20px)'; setTimeout(()=>t.remove(),300); },2600);
  }

  // Initialize
  renderOrder();
  renderAddresses();
  renderSavedCards();

});