const bgMusic = document.getElementById('bg-music');
const musicText = document.getElementById('music-text');
let musicStarted = false;

// Auto-play music on first user interaction (browser policy compliant)
function startAutoMusic() {
    if (!musicStarted && bgMusic) {
        bgMusic.play().then(() => {
            musicStarted = true;
            if (musicText) musicText.innerText = 'MUSIC: ON';
        }).catch(() => {});
    }
}
document.addEventListener('click', startAutoMusic, { once: true });

function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
        bgMusic.play();
        musicText.innerText = 'MUSIC: ON';
    } else {
        bgMusic.pause();
        musicText.innerText = 'MUSIC: OFF';
    }
}

// LOADING PROGRESS SIMULATION
let progress = 0;
const fill = document.getElementById('progress-fill');
const percent = document.getElementById('progress-percent');
const statusText = document.getElementById('loading-status');
const progressSection = document.getElementById('progress-section');
const ariseBtn = document.getElementById('arise-btn');

const stages = [
    { threshold: 25, text: "LOADING VIDEO & AUDIO STREAMS..." },
    { threshold: 55, text: "SYNCHRONIZING SHADOW MONARCH DATA..." },
    { threshold: 85, text: "CALIBRATING LEVEL 100 SYSTEM HUD..." },
    { threshold: 100, text: "SYSTEM AWAKENING COMPLETE." }
];

const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 4) + 1;
    if (progress > 100) progress = 100;

    fill.style.width = progress + '%';
    percent.innerText = progress + '%';

    const stage = stages.find(s => progress <= s.threshold);
    if (stage) statusText.innerText = stage.text;

    if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
            progressSection.classList.add('hidden');
            ariseBtn.classList.remove('hidden');
        }, 400);
    }
}, 80);

function ariseTrigger() {
    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        // Change 'shop.html' to whichever page you want to transition to!
        window.location.href = 'system.html';
    }, 800);
}

// CANVAS PARTICLES EFFECT
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2.5 + 1,
    speedY: -Math.random() * 1.2 - 0.3,
    opacity: Math.random()
}));

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.y += p.speedY;
        if (p.y < 0) p.y = canvas.height;
        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();



/* ==========================================
   GILBERTPRO FOOD HOUSE - SYSTEM SCRIPT v4.0
   ========================================== */

// Food Menu Database
const foodMenuItems = [
    {
        id: 1,
        name: "S-Rank Monarch Fried Chicken",
        category: "Chicken",
        price: 349,
        description: "Legendary crispy fried chicken seasoned with secret shadow spices and fiery herbs.",
        image: "ahchicks.jpg"
    },
    {
        id: 2,
        name: "Shadow Monarch Double Burger",
        category: "Burgers",
        price: 299,
        description: "Two juicy premium beef patties layered with melted dark cheese and signature sovereign sauce.",
        image: "burger.jpg"
    },
    {
        id: 3,
        name: "Abyssal Truffle Pasta",
        category: "Pasta",
        price: 279,
        description: "Al dente pasta drenched in rich creamy truffle sauce and grated parmesan mana crystals.",
        image: "pasta.jpg"
    },
    {
        id: 4,
        name: "Mana Crystal French Fries",
        category: "Sides",
        price: 149,
        description: "Golden crispy potato fries dusted with special sovereign herb salt and garlic aioli dip.",
        image: "fries.webp"
    },
    {
        id: 5,
        name: "Electric Blue Mana Potion",
        category: "Drinks",
        price: 119,
        description: "Refreshing citrus blue soda engineered to instantly replenish player stamina and focus.",
        image: "position.jpg"
    },
    {
        id: 6,
        name: "Hunter Supreme Combo",
        category: "Combo Meals",
        price: 499,
        description: "Complete raid meal: Monarch Fried Chicken, Mana Fries, Burger, and Electric Potion.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUmRpoguKhMxkLR13yyZ9vuXnaBrcwC0L-bmYcob86qg&s=10"
    },
    {
        id: 7,
        name: "Spicy Hellfire Chicken Wings",
        category: "Chicken",
        price: 269,
        description: "Crispy wings tossed in scorching demon-fire chili glaze. Extreme stamina boost.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Cybernetic Bacon Crunch Burger",
        category: "Burgers",
        price: 259,
        description: "Crispy smoked bacon, cheddar cheese, and crunchy onion rings atop a prime beef patty.",
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80"
    }
];

// Application State
let cart = [];
let orderCounter = 1;
let selectedOrderType = "Dine-In";

// DOM Elements
const systemLoader = document.getElementById("systemLoader");
const particlesContainer = document.getElementById("particlesContainer");
const foodGrid = document.getElementById("foodGrid");
const categoryTabs = document.getElementById("categoryTabs");
const cartTriggerBtn = document.getElementById("cartTriggerBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartBadge = document.getElementById("cartBadge");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const proceedCheckoutBtn = document.getElementById("proceedCheckoutBtn");

// Checkout & Receipt Modals
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutModal = document.getElementById("closeCheckoutModal");
const orderTypeStep = document.getElementById("orderTypeStep");
const checkoutFormStep = document.getElementById("checkoutFormStep");
const backToTypeBtn = document.getElementById("backToTypeBtn");
const typeCards = document.querySelectorAll(".type-card");
const missionForm = document.getElementById("missionForm");
const takeoutFields = document.getElementById("takeoutFields");
const dineInFields = document.getElementById("dineInFields");
const vehTabs = document.querySelectorAll(".veh-tab");
const motorcycleGrid = document.getElementById("motorcycleGrid");
const carGrid = document.getElementById("carGrid");

const receiptModal = document.getElementById("receiptModal");
const receiptContent = document.getElementById("receiptContent");
const printReceiptBtn = document.getElementById("printReceiptBtn");
const newOrderBtn = document.getElementById("newOrderBtn");

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    if (systemLoader) {
        systemLoader.style.display = "none";
    }

    createParticles();
    renderFoodMenu("all");
    setupEventListeners();
});

// Generate Floating Background Particles
function createParticles() {
    if (!particlesContainer) return;
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const size = Math.random() * 4 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDuration = `${Math.random() * 8 + 6}s`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(p);
    }
}

// Render Food Menu
function renderFoodMenu(category) {
    if (!foodGrid) return;
    foodGrid.innerHTML = "";
    const filtered = category === "all" 
        ? foodMenuItems 
        : foodMenuItems.filter(item => item.category === category);

    if (filtered.length === 0) {
        foodGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No provisions found in this sector.</p>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <div class="food-img-wrap">
                <span class="food-category-tag">${item.category}</span>
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="food-info">
                <h4 class="food-title">${item.name}</h4>
                <p class="food-desc">${item.description}</p>
                <div class="food-footer">
                    <span class="food-price">₱${item.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        <i class="fa-solid fa-plus"></i> ADD TO CART
                    </button>
                </div>
            </div>
        `;
        foodGrid.appendChild(card);
    });
}

// Event Listeners Setup
function setupEventListeners() {
    if (categoryTabs) {
        categoryTabs.addEventListener("click", (e) => {
            if (e.target.classList.contains("cat-btn")) {
                document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");
                renderFoodMenu(e.target.getAttribute("data-category"));
            }
        });
    }

    if (cartTriggerBtn) cartTriggerBtn.addEventListener("click", () => toggleCart(true));
    if (closeCartBtn) closeCartBtn.addEventListener("click", () => toggleCart(false));
    if (cartOverlay) {
        cartOverlay.addEventListener("click", () => {
            toggleCart(false);
            closeAllModals();
        });
    }

    if (proceedCheckoutBtn) {
        proceedCheckoutBtn.addEventListener("click", () => {
            if (cart.length === 0) return;
            toggleCart(false);
            if (checkoutModal) checkoutModal.classList.add("active");
            if (orderTypeStep) orderTypeStep.classList.add("active");
            if (checkoutFormStep) checkoutFormStep.classList.remove("active");
        });
    }

    if (closeCheckoutModal) {
        closeCheckoutModal.addEventListener("click", () => {
            if (checkoutModal) checkoutModal.classList.remove("active");
        });
    }

    typeCards.forEach(card => {
        card.addEventListener("click", () => {
            typeCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedOrderType = card.getAttribute("data-type");

            if (orderTypeStep) orderTypeStep.classList.remove("active");
            if (checkoutFormStep) checkoutFormStep.classList.add("active");

            if (selectedOrderType === "Takeout") {
                if (takeoutFields) takeoutFields.style.display = "block";
                if (dineInFields) dineInFields.style.display = "none";
                const fn = document.getElementById("fullName");
                const addr = document.getElementById("address");
                const cont = document.getElementById("contact");
                if (fn) fn.required = true;
                if (addr) addr.required = true;
                if (cont) cont.required = true;
                document.querySelectorAll('input[name="selectedVehicle"]').forEach(input => {
                    input.required = true;
                });
            } else {
                if (takeoutFields) takeoutFields.style.display = "none";
                if (dineInFields) dineInFields.style.display = "block";
                const fn = document.getElementById("fullName");
                const addr = document.getElementById("address");
                const cont = document.getElementById("contact");
                if (fn) fn.required = false;
                if (addr) addr.required = false;
                if (cont) cont.required = false;
                document.querySelectorAll('input[name="selectedVehicle"]').forEach(input => {
                    input.required = false;
                    input.checked = false;
                });
            }
        });
    });

    if (backToTypeBtn) {
        backToTypeBtn.addEventListener("click", () => {
            if (checkoutFormStep) checkoutFormStep.classList.remove("active");
            if (orderTypeStep) orderTypeStep.classList.add("active");
        });
    }

    vehTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            vehTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const targetTab = tab.getAttribute("data-vehtab");
            if (targetTab === "motorcycle") {
                if (motorcycleGrid) motorcycleGrid.classList.add("active-vgrid");
                if (carGrid) carGrid.classList.remove("active-vgrid");
            } else {
                if (carGrid) carGrid.classList.add("active-vgrid");
                if (motorcycleGrid) motorcycleGrid.classList.remove("active-vgrid");
            }
        });
    });

    if (missionForm) {
        missionForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let vehicleChoice = "N/A (Dine-In)";
            if (selectedOrderType === "Takeout") {
                const selectedVehInput = document.querySelector('input[name="selectedVehicle"]:checked');
                if (!selectedVehInput) {
                    alert("SYSTEM WARNING: Please select a deployment vehicle.");
                    return;
                }
                vehicleChoice = selectedVehInput.value;
            }

            const fullNameVal = document.getElementById("fullName") ? document.getElementById("fullName").value : "Valued Hunter";
            const addressVal = document.getElementById("address") ? document.getElementById("address").value : "GilbertPro Stronghold";
            const contactVal = document.getElementById("contact") ? document.getElementById("contact").value : "N/A";

            generateReceipt({
                orderNo: orderCounter++,
                type: selectedOrderType,
                name: fullNameVal || "Valued Hunter",
                address: addressVal || "GilbertPro Stronghold",
                contact: contactVal || "N/A",
                vehicle: vehicleChoice,
                items: [...cart],
                total: calculateTotal()
            });

            cart = [];
            updateCartUI();
            if (checkoutModal) checkoutModal.classList.remove("active");
            if (receiptModal) receiptModal.classList.add("active");
        });
    }

    if (printReceiptBtn) {
        printReceiptBtn.addEventListener("click", () => {
            window.print();
        });
    }

    if (newOrderBtn) {
        newOrderBtn.addEventListener("click", () => {
            if (receiptModal) receiptModal.classList.remove("active");
            if (missionForm) missionForm.reset();
        });
    }
}

// Cart Logic
function toggleCart(open) {
    if (!cartDrawer || !cartOverlay) return;
    if (open) {
        cartDrawer.classList.add("active");
        cartOverlay.classList.add("active");
    } else {
        cartDrawer.classList.remove("active");
        cartOverlay.classList.remove("active");
    }
}

function addToCart(id) {
    const item = foodMenuItems.find(f => f.id === id);
    if (!item) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    updateCartUI();
    toggleCart(true);
}

function updateQuantity(id, change) {
    const index = cart.findIndex(c => c.id === id);
    if (index !== -1) {
        cart[index].qty += change;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateCartUI() {
    if (!cartBadge || !cartItemsContainer) return;
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-box-open"></i>
                <p>No provisions selected yet.</p>
            </div>
        `;
        if (cartSubtotal) cartSubtotal.textContent = "₱0.00";
        if (cartTotal) cartTotal.textContent = "₱0.00";
        if (proceedCheckoutBtn) proceedCheckoutBtn.disabled = true;
        return;
    }

    if (proceedCheckoutBtn) proceedCheckoutBtn.disabled = false;
    cartItemsContainer.innerHTML = "";

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item-row";
        row.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <span class="cart-item-price">₱${item.price} x ${item.qty}</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="cart-item-qty">${item.qty}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(row);
    });

    const sub = calculateTotal();
    if (cartSubtotal) cartSubtotal.textContent = `₱${sub.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `₱${sub.toFixed(2)}`;
}

// Generate Receipt Function
function generateReceipt(data) {
    if (!receiptContent) return;
    const now = new Date();
    const dateTimeStr = now.toLocaleString();

    let itemsHtml = "";
    data.items.forEach(i => {
        itemsHtml += `
            <tr>
                <td>${i.name} (x${i.qty})</td>
                <td>₱${(i.price * i.qty).toFixed(2)}</td>
            </tr>
        `;
    });

    let instructionMsg = data.type === "Dine-In" 
        ? "PLEASE PROCEED TO THE GILBERTPRO CASHIER." 
        : "PLEASE WAIT FOR YOUR GILBERTPRO ORDER CONFIRMATION.";

    receiptContent.innerHTML = `
        <div class="receipt-meta">
            <span>ORDER NO. ${data.orderNo}</span>
            <span>${dateTimeStr}</span>
        </div>
        
        <table class="receipt-items-table">
            <thead>
                <tr>
                    <th>PROVISION ITEM</th>
                    <th>SUBTOTAL</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>

        <div class="receipt-total-section">
            <div class="receipt-total-row">
                <span>TOTAL AMOUNT:</span>
                <span>₱${data.total.toFixed(2)}</span>
            </div>
        </div>

        <div class="receipt-details-box">
            <p>Protocol: <span>${data.type}</span></p>
            <p>Recipient: <span>${data.name}</span></p>
            <p>Coordinates: <span>${data.address}</span></p>
            <p>Contact: <span>${data.contact}</span></p>
            <p>Deployment Unit: <span>${data.vehicle}</span></p>
        </div>

        <div class="receipt-instruction-msg">
            ${instructionMsg}
        </div>
    `;
}

function closeAllModals() {
    if (checkoutModal) checkoutModal.classList.remove("active");
    if (receiptModal) receiptModal.classList.remove("active");
}




document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    
    // Kunin kung naka-on ang music mula sa nakaraang page
    const musicState = localStorage.getItem('galesMusicPlaying');
    
    if (musicState === 'true') {
        bgMusic.play().catch(err => {
            console.log("Auto-play blocked, waiting for user interaction.");
        });
    }
});