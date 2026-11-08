// ======================================================
// GILBERTPRO FOOD HOUSE - SYSTEM SCRIPT (shop.js)
// ======================================================

// 1. PRODUCTS DATA WITH LOCAL IMAGES (5 ITEMS INCLUDED)
const shopProducts = [
    {
        id: 1,
        name: "Shadow Monarch Pasta",
        category: "Pasta",
        price: 180,
        desc: "S-Rank Italian pasta with rich garlic sauce for maximum mana restore.",
        img: "pasta.jpg"
    },
    {
        id: 2,
        name: "Lambo Supreme Meal",
        category: "chicken",
        price: 250,
        desc: "High-tier monarch food provision for ultimate physical stamina.",
        img: "ahchicks.jpg"
    },
    {
        id: 3,
        name: "Phantom Energy Elixir",
        category: "Drinks",
        price: 90,
        desc: "Refreshing blue sparkling potion infused with shadow essence.",
        img: "position.jpg"
    },
    {
        id: 4,
        name: "Position Stat Booster",
        category: "burgers",
        price: 120,
        desc: "Crispy side dish designed to instantly boost agility and strength.",
        img: "burgercy.jpg"
    },
    {
        id: 5,
        name: "Takum-Fries Master Drift Treat",
        category: "Fries",
        price: 199,
        desc: "Artisan Crstal fries  crafted with special hunter-grade ingredients.",
        img: "fries.webp"

    
    }
];

// Global States
let cart = [];
let selectedConsumptionProtocol = "Dine-In";
let pendingOrderData = null;

// Audio Elements
const aiRingtone = document.getElementById("aiRingtone");

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    hideLoader();
    renderFoodGrid("all");
    setupCategoryTabs();
    setupCartDrawer();
    setupCheckoutModal();
    setupVehicleTabs();
    setupMissionForm();
    setupReceiptModal();
});

// --- PARTICLES EFFECT ---
function initParticles() {
    const container = document.getElementById("particlesContainer");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 25; i++) {
        const p = document.createElement("div");
        p.className = "particle-dot";
        const size = Math.random() * 4 + 2;
        p.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 210, 255, 0.5);
            box-shadow: 0 0 8px #00d2ff;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatUp ${Math.random() * 6 + 4}s linear infinite;
        `;
        container.appendChild(p);
    }
}

// --- LOADER ---
function hideLoader() {
    const loader = document.getElementById("systemLoader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 400);
        }, 800);
    }
}

// --- RENDER FOOD MENU ---
function renderFoodGrid(filterCategory = "all") {
    const grid = document.getElementById("foodGrid");
    if (!grid) return;
    
    grid.innerHTML = "";
    const filtered = filterCategory === "all" 
        ? shopProducts 
        : shopProducts.filter(item => item.category.toLowerCase() === filterCategory.toLowerCase());

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #8ab4f8; padding: 40px; font-family: 'Orbitron';">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: #ff0055; margin-bottom: 10px;"></i>
                <p>NO PROVISIONS FOUND IN THIS CATEGORY.</p>
            </div>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <div class="food-card-img-wrapper" style="width:100%; height:180px; overflow:hidden; position:relative; border-bottom:1px solid rgba(0,210,255,0.2);">
                <img src="${item.img}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.3s ease;" 
                     onerror="this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500';">
                <span style="position:absolute; top:10px; right:10px; background:rgba(6,11,25,0.85); border:1px solid #00d2ff; color:#00d2ff; padding:2px 8px; font-size:0.75rem; font-family:'Orbitron'; border-radius:4px;">
                    ${item.category.toUpperCase()}
                </span>
            </div>
            <div class="food-card-body" style="padding: 15px;">
                <h4 style="font-family:'Orbitron'; color:#fff; font-size:1.1rem; margin-bottom:6px;">${item.name}</h4>
                <p style="color:#8ab4f8; font-size:0.88rem; margin-bottom:15px; min-height:40px;">${item.desc}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-family:'Orbitron'; color:#00ff88; font-weight:700; font-size:1.2rem;">₱${item.price.toFixed(2)}</span>
                    <button type="button" class="system-btn primary-btn" onclick="addToCart(${item.id})" style="padding: 8px 14px; font-size:0.8rem;">
                        <i class="fa-solid fa-plus"></i> ADD ITEM
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- CATEGORY TABS ---
function setupCategoryTabs() {
    const tabs = document.querySelectorAll(".cat-btn");
    tabs.forEach(btn => {
        btn.addEventListener("click", () => {
            tabs.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const cat = btn.getAttribute("data-category");
            renderFoodGrid(cat);
        });
    });
}

// --- CART LOGIC ---
function addToCart(productId) {
    const product = shopProducts.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(c => c.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    openCartDrawer();
}

function updateQuantity(productId, change) {
    const item = cart.find(c => c.id === productId);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== productId);
    }
    updateCartUI();
}

function updateCartUI() {
    const cartBadge = document.getElementById("cartBadge");
    const container = document.getElementById("cartItemsContainer");
    const subtotalEl = document.getElementById("cartSubtotal");
    const totalEl = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("proceedCheckoutBtn");

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    if (cartBadge) cartBadge.textContent = totalQty;
    if (subtotalEl) subtotalEl.textContent = `₱${totalPrice.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${totalPrice.toFixed(2)}`;

    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-box-open" style="font-size:2.5rem; color:#8ab4f8; margin-bottom:10px;"></i>
                <p>No provisions selected yet.</p>
            </div>`;
        return;
    }

    container.innerHTML = "";
    cart.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.className = "cart-item-row";
        itemRow.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:12px; margin-bottom:10px; background:rgba(0,210,255,0.05); border:1px solid rgba(0,210,255,0.2); border-radius:6px;";
        itemRow.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${item.img}" style="width:45px; height:45px; object-fit:cover; border-radius:4px;" onerror="this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100';">
                <div>
                    <h5 style="font-family:'Orbitron'; color:#fff; font-size:0.88rem; margin:0;">${item.name}</h5>
                    <span style="color:#00ff88; font-size:0.8rem; font-family:'Orbitron';">₱${(item.price * item.qty).toFixed(2)}</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <button type="button" onclick="updateQuantity(${item.id}, -1)" class="system-btn" style="padding:2px 8px; font-size:0.75rem;">-</button>
                <span style="font-family:'Orbitron'; color:#fff; font-size:0.9rem;">${item.qty}</span>
                <button type="button" onclick="updateQuantity(${item.id}, 1)" class="system-btn" style="padding:2px 8px; font-size:0.75rem;">+</button>
            </div>
        `;
        container.appendChild(itemRow);
    });
}

function openCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");
    if (drawer) drawer.classList.add("active");
    if (overlay) overlay.classList.add("active");
}

function closeCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");
    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
}

function setupCartDrawer() {
    const btn = document.getElementById("cartTriggerBtn");
    const closeBtn = document.getElementById("closeCartBtn");
    const overlay = document.getElementById("cartOverlay");

    if (btn) btn.addEventListener("click", openCartDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
    if (overlay) overlay.addEventListener("click", closeCartDrawer);
}

// --- CHECKOUT & MODAL STEPS ---
function setupCheckoutModal() {
    const proceedBtn = document.getElementById("proceedCheckoutBtn");
    const modal = document.getElementById("checkoutModal");
    const closeBtn = document.getElementById("closeCheckoutModal");
    const typeCards = document.querySelectorAll(".type-card");
    const backBtn = document.getElementById("backToTypeBtn");

    if (proceedBtn) {
        proceedBtn.addEventListener("click", () => {
            closeCartDrawer();
            if (modal) modal.classList.add("active");
            switchCheckoutStep(1);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            if (modal) modal.classList.remove("active");
        });
    }

    typeCards.forEach(card => {
        card.addEventListener("click", () => {
            typeCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedConsumptionProtocol = card.getAttribute("data-type");
            
            // Adjust fields
            const takeoutFields = document.getElementById("takeoutFields");
            const dineInFields = document.getElementById("dineInFields");

            if (selectedConsumptionProtocol === "Takeout") {
                if (takeoutFields) takeoutFields.style.display = "block";
                if (dineInFields) dineInFields.style.display = "none";
                setTakeoutRequired(true);
            } else {
                if (takeoutFields) takeoutFields.style.display = "none";
                if (dineInFields) dineInFields.style.display = "block";
                setTakeoutRequired(false);
            }

            switchCheckoutStep(2);
        });
    });

    if (backBtn) {
        backBtn.addEventListener("click", () => switchCheckoutStep(1));
    }
}

function setTakeoutRequired(isRequired) {
    const nameInput = document.getElementById("fullName");
    const addrInput = document.getElementById("address");
    const contactInput = document.getElementById("contact");
    const vehicleInputs = document.querySelectorAll('input[name="selectedVehicle"]');

    if (nameInput) nameInput.required = isRequired;
    if (addrInput) addrInput.required = isRequired;
    if (contactInput) contactInput.required = isRequired;
    if (vehicleInputs.length > 0) vehicleInputs[0].required = isRequired;
}

function switchCheckoutStep(stepNumber) {
    const step1 = document.getElementById("orderTypeStep");
    const step2 = document.getElementById("checkoutFormStep");

    if (stepNumber === 1) {
        if (step1) step1.classList.add("active");
        if (step2) step2.classList.remove("active");
    } else {
        if (step1) step1.classList.remove("active");
        if (step2) step2.classList.add("active");
    }
}

// --- VEHICLE SELECTION TABS ---
function setupVehicleTabs() {
    const vehTabs = document.querySelectorAll(".veh-tab");
    const motoGrid = document.getElementById("motorcycleGrid");
    const carGrid = document.getElementById("carGrid");

    vehTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            vehTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const target = tab.getAttribute("data-vehtab");
            if (target === "motorcycle") {
                if (motoGrid) motoGrid.classList.add("active-vgrid");
                if (carGrid) carGrid.classList.remove("active-vgrid");
            } else {
                if (motoGrid) motoGrid.classList.remove("active-vgrid");
                if (carGrid) carGrid.classList.add("active-vgrid");
            }
        });
    });
}

// --- MISSION FORM SUBMIT ---
function setupMissionForm() {
    const form = document.getElementById("missionForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("fullName").value.trim() || "Shadow Hunter";
        const address = document.getElementById("address").value.trim() || "Stronghold Base";
        const contact = document.getElementById("contact").value.trim() || "N/A";
        
        let vehicle = "System Express";
        const selectedVehInput = document.querySelector('input[name="selectedVehicle"]:checked');
        if (selectedVehInput) vehicle = selectedVehInput.value;

        pendingOrderData = {
            protocol: selectedConsumptionProtocol,
            customerName: name,
            address: address,
            contact: contact,
            vehicle: vehicle,
            items: [...cart],
            total: cart.reduce((sum, i) => sum + (i.price * i.qty), 0),
            date: new Date().toLocaleString()
        };

        // Close Checkout Modal
        const checkoutModal = document.getElementById("checkoutModal");
        if (checkoutModal) checkoutModal.classList.remove("active");

        // TRIGGER AI DISPATCH CALL
        triggerAiCall(pendingOrderData.customerName);
    });
}

// --- AI DISPATCH VOICE CALL LOGIC ---
function triggerAiCall(userName = "Gilbert") {
    const aiCallModal = document.getElementById("aiCallModal");
    const callStatusText = document.getElementById("callStatusText");
    const answerBtn = document.getElementById("answerCallBtn");
    const declineBtn = document.getElementById("declineCallBtn");

    if (aiCallModal) aiCallModal.classList.add("active");

    // Play Ringtone Audio (Recording.m4a)
    if (aiRingtone) {
        aiRingtone.currentTime = 0;
        aiRingtone.play().catch(e => console.log("Audio play blocked by browser:", e));
    }

    if (callStatusText) {
        callStatusText.textContent = `Incoming secure voice-link for ${userName}...`;
    }

    // ACCEPT BUTTON CLICK
    if (answerBtn) {
        answerBtn.onclick = () => {
            if (aiRingtone) aiRingtone.pause();

            if (callStatusText) {
                callStatusText.textContent = "DISPATCH CONNECTED: Speaking...";
            }

            // Web Speech Voice Output
            if ('speechSynthesis' in window) {
                const speech = new SpeechSynthesisUtterance(
                    `Greetings Monarch ${userName}. Your food provisions are confirmed and deployment is now active. Stand by for arrival.`
                );
                speech.rate = 1.0;
                speech.pitch = 0.85;
                window.speechSynthesis.speak(speech);
            }

            setTimeout(() => {
                if (aiCallModal) aiCallModal.classList.remove("active");
                displayReceipt();
            }, 4000);
        };
    }

    // DECLINE BUTTON CLICK
    if (declineBtn) {
        declineBtn.onclick = () => {
            if (aiRingtone) aiRingtone.pause();
            if (aiCallModal) aiCallModal.classList.remove("active");
            displayReceipt();
        };
    }
}

// --- RECEIPT SYSTEM ---
function displayReceipt() {
    if (!pendingOrderData) return;

    const receiptModal = document.getElementById("receiptModal");
    const content = document.getElementById("receiptContent");
    if (!content) return;

    let itemsHtml = "";
    pendingOrderData.items.forEach(item => {
        itemsHtml += `
            <div style="display:flex; justify-style:space-between; margin-bottom:6px; font-size:0.9rem;">
                <span>${item.name} x${item.qty}</span>
                <span style="font-family:'Orbitron'; color:#00ff88;">₱${(item.price * item.qty).toFixed(2)}</span>
            </div>`;
    });

    content.innerHTML = `
        <div style="font-family:'Orbitron'; font-size:0.8rem; color:#8ab4f8; margin-bottom:15px; border-bottom:1px dashed rgba(0,210,255,0.3); padding-bottom:10px;">
            <p><strong>TIMESTAMP:</strong> ${pendingOrderData.date}</p>
            <p><strong>PROTOCOL:</strong> <span style="color:#00d2ff;">${pendingOrderData.protocol.toUpperCase()}</span></p>
            ${pendingOrderData.protocol === "Takeout" ? `
                <p><strong>RECIPIENT:</strong> ${pendingOrderData.customerName}</p>
                <p><strong>CONTACT:</strong> ${pendingOrderData.contact}</p>
                <p><strong>ADDRESS:</strong> ${pendingOrderData.address}</p>
                <p><strong>DEPLOYED VEHICLE:</strong> <span style="color:#00ff88;">${pendingOrderData.vehicle}</span></p>
            ` : `<p><strong>STATUS:</strong> Preparing for In-House Service</p>`}
        </div>
        <div style="margin-bottom:15px;">
            <h5 style="font-family:'Orbitron'; color:#fff; margin-bottom:10px;">PROVISIONS MANIFEST:</h5>
            ${itemsHtml}
        </div>
        <div style="border-top:1px solid #00d2ff; padding-top:10px; display:flex; justify-content:space-between; font-family:'Orbitron'; font-size:1.1rem; color:#fff;">
            <span>GRAND TOTAL:</span>
            <span style="color:#00ff88; font-weight:800;">₱${pendingOrderData.total.toFixed(2)}</span>
        </div>
    `;

    if (receiptModal) receiptModal.classList.add("active");
    
    // Clear cart after checkout
    cart = [];
    updateCartUI();
}

function setupReceiptModal() {
    const receiptModal = document.getElementById("receiptModal");
    const printBtn = document.getElementById("printReceiptBtn");
    const newOrderBtn = document.getElementById("newOrderBtn");

    if (printBtn) {
        printBtn.addEventListener("click", () => window.print());
    }

    if (newOrderBtn) {
        newOrderBtn.addEventListener("click", () => {
            if (receiptModal) receiptModal.classList.remove("active");
            window.location.hash = "#hero";
        });
    }
}