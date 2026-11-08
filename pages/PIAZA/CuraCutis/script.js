
/* =========================
   GLOW HAVEN SKINCARE
   JavaScript
========================= */

// PRODUCT DATABASE
// Update product information here.

const products = [
    {
        id: 1,
        name: "Gentle Facial Cleanser",
        category: "cleanser",
        description: "A refreshing cleanser for your daily routine.",
        price: 399,
        oldPrice: 499,
        discount: "20%",
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Hydrating Face Cream",
        category: "moisturizer",
        description: "Helps keep your skin soft and moisturized.",
        price: 550,
        oldPrice: null,
        discount: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Glow Boost Serum",
        category: "serum",
        description: "A lightweight serum for a radiant appearance.",
        price: 680,
        oldPrice: 800,
        discount: "15%",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Daily Sun Protection",
        category: "sunscreen",
        description: "A daily sunscreen for your skincare routine.",
        price: 450,
        oldPrice: null,
        discount: "NEW",
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Vitamin C Brightening Serum",
        category: "serum",
        description: "A brightening serum for your daily routine.",
        price: 720,
        oldPrice: 850,
        discount: "15%",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Daily Moisture Lotion",
        category: "moisturizer",
        description: "Lightweight moisture for everyday skincare.",
        price: 480,
        oldPrice: null,
        discount: "NEW",
        image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80"
    }
];


// SHOP STATE

let cart = [];


// HELPER

function formatPrice(price) {
    return "₱" + price.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// DISPLAY PRODUCTS

function displayProducts(list) {
    const productGrid = document.getElementById("productGrid");
    const noResults = document.getElementById("noResults");
    const resultCount = document.getElementById("resultCount");

    productGrid.innerHTML = "";

    resultCount.textContent =
        `${list.length} product${list.length !== 1 ? "s" : ""} found`;

    noResults.hidden = list.length !== 0;

    list.forEach(product => {
        const card = document.createElement("article");

        card.className = "product-card";

        const oldPriceHTML = product.oldPrice
            ? `<del>${formatPrice(product.oldPrice)}</del>`
            : "";

        card.innerHTML = `
            <div class="product-image">
                <span class="discount">${product.discount}</span>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy">
            </div>

            <div class="product-info">
                <p class="category">
                    ${product.category.toUpperCase()}
                </p>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="price">
                    <strong>${formatPrice(product.price)}</strong>
                    ${oldPriceHTML}
                </div>

                <button
                    class="add-cart"
                    data-product-id="${product.id}">
                    Add to Cart +
                </button>
            </div>
        `;

        productGrid.appendChild(card);
    });
}


// SEARCH AND FILTER

function filterProducts() {
    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const categoryValue = document
        .getElementById("categoryFilter")
        .value;

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryValue === "all" ||
            product.category === categoryValue;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

document
    .getElementById("searchInput")
    .addEventListener("input", filterProducts);

document
    .getElementById("categoryFilter")
    .addEventListener("change", filterProducts);

document
    .getElementById("clearSearch")
    .addEventListener("click", () => {
        document.getElementById("searchInput").value = "";
        document.getElementById("categoryFilter").value = "all";

        filterProducts();
    });


// ADD TO CART

document
    .getElementById("productGrid")
    .addEventListener("click", event => {

        const button = event.target.closest(".add-cart");

        if (!button) return;

        const productId = Number(button.dataset.productId);

        addToCart(productId);
    });

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    openCart();

}


// UPDATE CART

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartSubtotal = document.getElementById("cartSubtotal");

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartSubtotal.textContent = formatPrice(subtotal);

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is currently empty.
            </p>
        `;

        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h3>${item.name}</h3>

                <p>${formatPrice(item.price)}</p>

                <div class="quantity-controls">
                    <button
                        data-action="decrease"
                        data-id="${item.id}">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}">
                        +
                    </button>
                </div>
            </div>

            <button
                class="remove-item"
                data-action="remove"
                data-id="${item.id}">
                Remove
            </button>
        `;

        cartItems.appendChild(cartItem);
    });
}


// CART QUANTITY AND REMOVE

document
    .getElementById("cartItems")
    .addEventListener("click", event => {

        const button = event.target.closest("button");

        if (!button) return;

        const productId = Number(button.dataset.id);
        const action = button.dataset.action;

        const item = cart.find(product => product.id === productId);

        if (!item) return;

        if (action === "increase") {
            item.quantity++;
        }

        if (action === "decrease") {
            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(product => product.id !== productId);
            }
        }

        if (action === "remove") {
            cart = cart.filter(product => product.id !== productId);
        }

        updateCart();
    });


// CART DRAWER

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("show");
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("show");
}

document.getElementById("openCart").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


// CHECKOUT

const checkoutModal = document.getElementById("checkoutModal");

document
    .getElementById("checkoutButton")
    .addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your cart is empty. Please add products first.");
            return;
        }

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        document.getElementById("checkoutTotal").textContent =
            formatPrice(total);

        closeCart();

        checkoutModal.classList.add("show");
    });

document
    .getElementById("closeCheckout")
    .addEventListener("click", () => {
        checkoutModal.classList.remove("show");
    });


// PLACE ORDER

document
    .getElementById("checkoutForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const customerName = document
            .getElementById("customerName")
            .value
            .trim();

        const customerEmail = document
            .getElementById("customerEmail")
            .value
            .trim();

        const customerPhone = document
            .getElementById("customerPhone")
            .value
            .trim();

        const customerAddress = document
            .getElementById("customerAddress")
            .value
            .trim();

        const paymentMethod = document
            .querySelector('input[name="payment"]:checked')
            .value;

        const orderTotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const orderNumber =
            "GH-" + Date.now().toString().slice(-8);

        // DEMO ORDER DATA
        // A real store must send this to a secure backend.

        const order = {
            orderNumber,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            paymentMethod,
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: orderTotal,
            date: new Date().toISOString()
        };

        console.log("Demo order:", order);

        document.getElementById("successMessage").textContent =
            `Your demo order ${orderNumber} has been created. ` +
            `Total: ${formatPrice(orderTotal)}. ` +
            `Payment method: ${paymentMethod}.`;

        checkoutModal.classList.remove("show");

        document.getElementById("successModal").classList.add("show");

        cart = [];

        updateCart();

        document.getElementById("checkoutForm").reset();
    });


// CONTINUE SHOPPING

document
    .getElementById("continueShopping")
    .addEventListener("click", () => {

        document.getElementById("successModal").classList.remove("show");

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });
    });


// CONTACT FORM

document
    .getElementById("contactForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        const name = document
            .getElementById("contactName")
            .value
            .trim();

        document.getElementById("contactStatus").textContent =
            `Thank you, ${name}! Your message is ready. ` +
            `A real contact system needs an email service or backend.`;

        event.target.reset();
    });


// INITIALIZE WEBSITE

displayProducts(products);

updateCart();
