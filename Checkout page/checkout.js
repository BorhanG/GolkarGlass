document.addEventListener("DOMContentLoaded", function () {
  const addressList = document.getElementById("addressList");
  const addressForm = document.getElementById("addressForm");
  const cancelAddress = document.getElementById("cancelAddress");
  const orderItemsEl = document.getElementById("orderItems");
  const summarySubtotal = document.getElementById("summarySubtotal");
  const summaryTotal = document.getElementById("summaryTotal");
  const placeOrderBtn = document.getElementById("placeOrder");

  // Load cart from localStorage
  function loadCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
      return cart;
    } catch (e) {
      return [];
    }
  }

  function formatPrice(price) {
    return price.toLocaleString("fa-IR") + " تومان";
  }

  // Render order items
  function renderOrder() {
    const cart = loadCart();
    if (!orderItemsEl) return;
    orderItemsEl.innerHTML = "";
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * (item.quantity || 1);
      const node = document.createElement("div");
      node.className = "order-item";
      node.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="meta">
          <div class="title">${item.name}</div>
          <div class="qty">تعداد: ${item.quantity || 1}</div>
        </div>
        <div class="price">${formatPrice(
          item.price * (item.quantity || 1)
        )}</div>
      `;
      orderItemsEl.appendChild(node);
    });
    summarySubtotal.textContent = formatPrice(subtotal);
    summaryTotal.textContent = formatPrice(subtotal);
  }

  // ---------------- CARD SYSTEM ----------------
  (() => {
    const savedCardsContainer = document.getElementById("savedCards");
    const cardModal = document.getElementById("cardModal");
    const cardOverlay = document.getElementById("cardOverlay");
    const cardForm = document.getElementById("cardForm");
    const cardNumberInput = document.getElementById("cardNumber");
    const cardNameInput = document.getElementById("cardName");
    const saveCardInput = document.getElementById("saveCard");
    const addCardBtn = document.getElementById("addCardBtn");
    const cancelCard = document.getElementById("cancelCard");

    if (!savedCardsContainer) {
      console.warn("savedCards container not found — card system disabled.");
      return;
    }

    // Demo cards for first load
    if (!localStorage.getItem("savedCards")) {
      const demo = [
        { number: "1111222233334444", name: "Demo Card 1" },
        { number: "5555666677778888", name: "Demo Card 2" },
      ];
      localStorage.setItem("savedCards", JSON.stringify(demo));
    }

    function loadSavedCards() {
      try {
        return JSON.parse(localStorage.getItem("savedCards") || "[]");
      } catch {
        return [];
      }
    }

    function saveSavedCards(list) {
      localStorage.setItem("savedCards", JSON.stringify(list));
    }

    function showToast(msg, type = "info") {
      const t = document.createElement("div");
      t.className = `toast ${type}`;
      t.textContent = msg;
      t.style.cssText =
        "position:fixed;left:20px;bottom:20px;padding:12px 16px;border-radius:10px;color:#fff;z-index:9999;transform:translateY(20px);opacity:0;transition:all .28s";
      t.style.background =
        type === "success"
          ? "#27ae60"
          : type === "error"
          ? "#e74c3c"
          : "#3498db";
      document.body.appendChild(t);
      requestAnimationFrame(() => {
        t.style.opacity = "1";
        t.style.transform = "none";
      });
      setTimeout(() => {
        t.style.opacity = "0";
        t.style.transform = "translateY(20px)";
        setTimeout(() => t.remove(), 300);
      }, 2600);
    }

    function formatCard(number) {
      return number.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1-");
    }

    function renderSavedCards() {
      const cards = loadSavedCards();
      savedCardsContainer.innerHTML = "";
      if (!cards.length) {
        savedCardsContainer.innerHTML =
          '<div class="muted">هیچ کارت ذخیره شده‌ای وجود ندارد</div>';
        return;
      }
      cards.forEach((card, idx) => {
        const el = document.createElement("div");
        el.className = "saved-card";
        el.innerHTML = `
        <div class="meta">
          <img src="/Checkout page/card.png" alt="Card Icon" class="card-logo" />
          <div class="label">${formatCard(card.number)} — ${card.name}</div>
        </div>
        <div class="actions">
          <button data-idx="${idx}" class="btn ghost use-card" title="انتخاب کارت">
            <i class="fa-solid fa-circle-check"></i>
          </button>
          <button data-idx="${idx}" class="btn ghost edit-card" title="ویرایش کارت">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button data-idx="${idx}" class="btn ghost delete-card" title="حذف کارت">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
        savedCardsContainer.appendChild(el);
      });
      attachCardActions();
    }

    function attachCardActions() {
      // Use card
      savedCardsContainer.querySelectorAll(".use-card").forEach((btn) => {
        btn.onclick = () => {
          const idx = btn.dataset.idx;
          localStorage.setItem("selectedCard", idx);
          showToast("کارت انتخاب شد", "success");
        };
      });

      // Edit card
      savedCardsContainer.querySelectorAll(".edit-card").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx, 10);
          const cards = loadSavedCards();
          const card = cards[idx];
          if (!card) return;

          cardNumberInput.value = formatCard(card.number);
          cardNameInput.value = card.name;
          saveCardInput.checked = true;

          cardForm.dataset.editingIdx = idx;
          cardModal.classList.add("show");
          cardOverlay.classList.add("show");
          cardOverlay.classList.remove("dis_none");
        };
      });

      // Delete card
      savedCardsContainer.querySelectorAll(".delete-card").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx, 10);
          if (confirm("آیا از حذف این کارت مطمئن هستید؟")) {
            const cards = loadSavedCards();
            cards.splice(idx, 1);
            saveSavedCards(cards);
            renderSavedCards();
            showToast("کارت حذف شد", "success");
          }
        };
      });
    }

    // Card input dash formatting
    cardNumberInput.addEventListener("input", (e) => {
      let cursorPos = e.target.selectionStart;
      let digits = e.target.value.replace(/\D/g, "").slice(0, 16);

      // Count how many dashes there will be before the cursor
      let prevDashes = (e.target.value.slice(0, cursorPos).match(/-/g) || [])
        .length;

      // Format with dashes
      let formatted = digits.replace(/(\d{4})(?=\d)/g, "$1-");
      e.target.value = formatted;

      // Count new dashes before the cursor
      let newDashes = (formatted.slice(0, cursorPos).match(/-/g) || []).length;

      // Adjust cursor for the added dash
      cursorPos = cursorPos + (newDashes - prevDashes);
      e.target.selectionStart = e.target.selectionEnd = cursorPos;
    });

    // Open new card modal
    if (addCardBtn) {
      addCardBtn.addEventListener("click", () => {
        cardForm.reset();
        delete cardForm.dataset.editingIdx;
        cardModal.classList.add("show");
        cardOverlay.classList.add("show");
        cardOverlay.classList.remove("dis_none");
      });
    }

    // Close modal
    const closeModal = () => {
      cardModal.classList.remove("show");
      cardOverlay.classList.remove("show");
      setTimeout(() => cardOverlay.classList.add("dis_none"), 300);
    };
    if (cancelCard) cancelCard.addEventListener("click", closeModal);
    if (cardOverlay) cardOverlay.addEventListener("click", closeModal);

    // Submit card form
    cardForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawNumber = cardNumberInput.value.replace(/\D/g, "");
      const name = cardNameInput.value.trim();
      const save = saveCardInput.checked;

      if (rawNumber.length !== 16) {
        showToast("لطفا شماره کارت 16 رقمی را وارد کنید", "error");
        return;
      }
      if (!name) {
        showToast("لطفا نام صاحب کارت را وارد کنید", "error");
        return;
      }

      let cards = loadSavedCards();
      const editingIdx = cardForm.dataset.editingIdx;

      if (editingIdx !== undefined) {
        cards[editingIdx] = { number: rawNumber, name };
        showToast("کارت ویرایش شد", "success");
        delete cardForm.dataset.editingIdx;
      } else if (save) {
        cards.push({ number: rawNumber, name });
        showToast("کارت جدید ذخیره شد", "success");
      }

      saveSavedCards(cards);
      renderSavedCards();
      cardForm.reset();
      closeModal();
    });

    // Initial render
    renderSavedCards();

    // Expose for debugging
    window.renderSavedCards = renderSavedCards;
  })();

  // Addresses (simple local storage)
  function loadAddresses() {
    try {
      return JSON.parse(localStorage.getItem("userAddresses") || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveAddresses(list) {
    localStorage.setItem("userAddresses", JSON.stringify(list));
  }

  function renderAddresses() {
    const addrs = loadAddresses();
    addressList.innerHTML = "";
    if (addrs.length === 0) {
      addressList.innerHTML =
        '<div class="address-empty">هیچ آدرسی ثبت نشده است</div>';
      return;
    }

    addrs.forEach((a, idx) => {
      const el = document.createElement("div");
      el.className = "address-item";
      el.dataset.idx = idx;
      el.innerHTML = `
      <div class="address-info">
        <strong>${a.fullName} — ${a.phone}</strong>
        <p>${a.street}, ${a.city}</p>
      </div>
      <div class="address-actions">
        <button class="edit-btn" title="ویرایش"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" title="حذف"><i class="fas fa-trash"></i></button>
      </div>
    `;

      // Select address
      el.addEventListener("click", (e) => {
        if (e.target.closest(".edit-btn") || e.target.closest(".delete-btn"))
          return; // prevent selecting when editing/deleting
        document
          .querySelectorAll(".address-item")
          .forEach((i) => i.classList.remove("selected"));
        el.classList.add("selected");
        localStorage.setItem("selectedAddress", idx);
      });

      addressList.appendChild(el);
    });

    // Restore selected state
    const selected = localStorage.getItem("selectedAddress");
    if (selected !== null && addressList.children[selected])
      addressList.children[selected].classList.add("selected");

    attachAddressActions();
  }
  function attachAddressActions() {
    // Delete
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.closest(".address-item").dataset.idx);
        const list = loadAddresses();
        if (confirm("آیا از حذف این آدرس مطمئن هستید؟")) {
          list.splice(idx, 1);
          saveAddresses(list);
          renderAddresses();
          showToast("آدرس حذف شد", "success");
        }
      });
    });

    // Edit
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.closest(".address-item").dataset.idx);
        const list = loadAddresses();
        const addr = list[idx];
        if (!addr) return;

        // Fill form with existing data
        document.querySelector("input[name='fullName']").value = addr.fullName;
        document.querySelector("input[name='phone']").value = addr.phone;
        document.querySelector("input[name='street']").value = addr.street;
        document.querySelector("input[name='city']").value = addr.city;

        // Save which address is being edited
        addressForm.dataset.editingIdx = idx;

        // Show modal
        modal.classList.add("show");
        overlay.classList.add("show");
        overlay.classList.remove("dis_none");
      });
    });
  }

  // pre-select first
  const selected = localStorage.getItem("selectedAddress");
  if (selected !== null && addressList.children[selected])
    addressList.children[selected].classList.add("selected");

  // Modal handlers
  const addUserButton = document.getElementById("addAddressBtn");
  const modal = document.querySelector(".modal-main");
  const overlay = document.querySelector(".modal_back");
  const cancel = document.getElementById("cancelAddress");

  addUserButton.addEventListener("click", () => {
    modal.classList.add("show");
    overlay.classList.add("show");
    overlay.classList.remove("dis_none");
  });

  cancel.addEventListener("click", () => {
    modal.classList.remove("show");
    overlay.classList.remove("show");
  });

  overlay.addEventListener("click", () => {
    modal.classList.remove("show");
    overlay.classList.remove("show");
    setTimeout(() => overlay.classList.add("dis_none"), 300); // waits for fade-out
  });

  addressForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new FormData(addressForm);
    const addr = {
      fullName: data.get("fullName"),
      phone: data.get("phone"),
      street: data.get("street"),
      city: data.get("city"),
    };

    const list = loadAddresses();
    const editingIdx = addressForm.dataset.editingIdx;

    if (editingIdx !== undefined) {
      // Update existing address
      list[editingIdx] = addr;
      delete addressForm.dataset.editingIdx;
      showToast("آدرس ویرایش شد", "success");
    } else {
      // Add new
      list.push(addr);
      showToast("آدرس جدید ذخیره شد", "success");
    }

    saveAddresses(list);
    addressForm.reset();
    modal.classList.remove("show");
    overlay.classList.remove("show");
    setTimeout(() => overlay.classList.add("dis_none"), 300);
    renderAddresses();
  });

  // Place order
  placeOrderBtn.addEventListener("click", () => {
    const selectedAddress = localStorage.getItem("selectedAddress");
    if (selectedAddress === null) {
      showToast("لطفا یک آدرس انتخاب کنید", "error");
      return;
    }
    const payment = document.querySelector(
      'input[name="payment"]:checked'
    ).value;

    // If card payment and card entry visible, do minimal validation
    if (payment === "card") {
      const selectedCard = localStorage.getItem("selectedCard");
      if (!selectedCard) {
        // check if new card filled
        const num = document.getElementById("cardNumber").value.trim();
        if (num.length < 12) {
          showToast("لطفا اطلاعات کارت را وارد کنید", "error");
          return;
        }
      }
    }

    // Simulate payment flow with nicer animation
    placeOrderBtn.disabled = true;
    placeOrderBtn.classList.add("show-animate");
    placeOrderBtn.textContent = "در حال پردازش پرداخت...";

    setTimeout(() => {
      // save card if requested
      const saveCard = document.getElementById("saveCard");
      if (saveCard && saveCard.checked) {
        const list = loadSavedCards();
        const num = (document.getElementById("cardNumber") || {}).value || "";
        list.push({
          last4: num.slice(-4),
          name:
            (document.getElementById("cardName") || {}).value || "ذخیره شده",
          brand: "VC",
        });
        saveSavedCards(list);
      }

      // pretend success
      localStorage.removeItem("shoppingCart");
      showToast("پرداخت با موفقیت انجام شد — سفارش ثبت شد", "success");
      setTimeout(() => {
        window.location.href = "/Checkout page/checkout-success.html";
      }, 1200);
    }, 1800);
  });

  // Payment method toggle shows card entry
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const cardEntry = document.getElementById("cardEntry");
      if (
        document.querySelector('input[name="payment"]:checked').value === "card"
      ) {
        cardEntry.classList.remove("hidden");
      } else {
        cardEntry.classList.add("hidden");
      }
    });
  });

  // promo code application (very basic)
  // create promo UI if not present
  const promoRow = document.createElement("div");
  promoRow.className = "promo-row";
  promoRow.innerHTML =
    '<input id="promoCode" placeholder="کد تخفیف"><button class="apply-btn">اعمال</button>';
  document.querySelector(".order-summary .card")?.prepend(promoRow);
  promoRow.querySelector(".apply-btn").addEventListener("click", () => {
    const code = document.getElementById("promoCode").value.trim();
    if (code === "GG10") {
      showToast("تخفیف 10% اعمال شد", "success"); /* no real calc for demo */
    } else showToast("کد نامعتبر است", "error");
  });

  // Toast
  function showToast(msg, type = "info") {
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.textContent = msg;
    t.style.cssText =
      "position:fixed;left:20px;bottom:20px;padding:12px 16px;border-radius:10px;color:#fff;z-index:9999;transform:translateY(20px);opacity:0;transition:all .28s";
    t.style.background =
      type === "success" ? "#27ae60" : type === "error" ? "#e74c3c" : "#3498db";
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "none";
    });
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(20px)";
      setTimeout(() => t.remove(), 300);
    }, 2600);
  }

  // Initialize
  renderOrder();
  renderAddresses();
  window.renderSavedCards();
});
