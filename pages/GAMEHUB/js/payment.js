window.GAMEHUB = window.GAMEHUB || {};

GAMEHUB.payment = {

    selectedMethod: "GCash",
    processing: false,

    checkoutType: "game",
    selectedPlan: null,
    planPrice: 0,
    selectedCoinPackage: null,

    selectMethod: function(method) {
        if (!["GCash", "Maya"].includes(method)) return;

        this.selectedMethod = method;
        this.render();
    },

    escapeHTML: function(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    },

    getLinePrice: function(item) {
        if (GAMEHUB.cart && GAMEHUB.cart.getItemPrice) {
            return GAMEHUB.cart.getItemPrice(item);
        }

        return Number(item.price) || 0;
    },

    renderCheckout: function() {
        const container = document.getElementById("checkoutContainer");
        if (!container) return;

        // COIN CHECKOUT
        if (this.checkoutType === "coins") {
            const pack = this.selectedCoinPackage;

            if (!pack) return;

            container.innerHTML = `
                <div class="checkout-card">
                    <h2>Coin Purchase Summary</h2>

                    <div class="checkout-item">
                        <span>${this.escapeHTML(pack.name)} Package</span>
                        <strong>${pack.coins} Coins</strong>
                    </div>

                    <div class="checkout-total">
                        <span>Total Amount</span>
                        <strong>₱${pack.price.toFixed(2)}</strong>
                    </div>

                    <p class="demo-notice">
                        This is a simulated GAMEHUB+ coin purchase.
                    </p>

                    <button class="btn-primary"
                        onclick="GAMEHUB.payment.openPayment()">
                        Continue to Payment
                    </button>

                    <button class="btn-danger"
                        onclick="GAMEHUB.payment.cancelCoinCheckout()">
                        Cancel
                    </button>
                </div>
            `;
            return;
        }

        // SUBSCRIPTION CHECKOUT
        if (this.checkoutType === "subscription") {
            container.innerHTML = `
                <div class="checkout-card">
                    <h2>Subscription Order Summary</h2>

                    <div class="checkout-item">
                        <span>${this.escapeHTML(this.selectedPlan)}</span>
                        <strong>₱${this.planPrice.toFixed(2)}</strong>
                    </div>

                    <div class="checkout-total">
                        <span>Total Amount</span>
                        <strong>₱${this.planPrice.toFixed(2)}</strong>
                    </div>

                    <p class="demo-notice">
                        This is a simulated subscription purchase.
                    </p>

                    <button class="btn-primary"
                        onclick="GAMEHUB.payment.openPayment()">
                        Continue to Payment
                    </button>

                    <button class="btn-danger"
                        onclick="GAMEHUB.payment.cancelSubscriptionCheckout()">
                        Cancel
                    </button>
                </div>
            `;
            return;
        }

        // GAME CHECKOUT
        const cart = GAMEHUB.cart.getItems();

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Your cart is empty!</h3>
                    <p>Add a game before proceeding to checkout.</p>

                    <button class="btn-primary"
                        onclick="GAMEHUB.navigation.showPage('games')">
                        Explore Games
                    </button>
                </div>
            `;
            return;
        }

        const total = GAMEHUB.cart.getSubtotal();

        container.innerHTML = `
            <div class="checkout-card">
                <h2>Order Summary</h2>

                ${cart.map(item => {
                    const price = this.getLinePrice(item);
                    const quantity = Number(item.quantity) || 1;

                    return `
                        <div class="checkout-item">
                            <div>
                                <span>
                                    ${this.escapeHTML(item.name)}
                                    × ${quantity}
                                </span>
                            </div>

                            <strong>
                                ₱${(price * quantity).toFixed(2)}
                            </strong>
                        </div>
                    `;
                }).join("")}

                <div class="checkout-total">
                    <span>Total Amount</span>
                    <strong>₱${total.toFixed(2)}</strong>
                </div>

                <p class="demo-notice">
                    This is a simulated demo checkout.
                </p>

                <button class="btn-primary"
                    onclick="GAMEHUB.payment.openPayment()">
                    Continue to Payment
                </button>
            </div>
        `;
    },

    startSubscriptionCheckout: function(plan, price) {
        if (!["Pro", "Ultimate"].includes(plan)) return false;

        const expectedPrice = plan === "Pro" ? 149 : 299;

        if (Number(price) !== expectedPrice) return false;

        this.checkoutType = "subscription";
        this.selectedPlan = plan;
        this.planPrice = expectedPrice;
        this.selectedCoinPackage = null;
        this.processing = false;

        GAMEHUB.navigation.showPage("checkout");
        this.renderCheckout();

        return true;
    },

    startCoinCheckout: function(packageId) {
        const pack = GAMEHUB.coins.packages.find(
            item => item.id === packageId
        );

        if (!pack) {
            alert("Coin package not found.");
            return false;
        }

        this.checkoutType = "coins";
        this.selectedCoinPackage = pack;
        this.selectedPlan = null;
        this.planPrice = 0;
        this.processing = false;

        GAMEHUB.navigation.showPage("checkout");
        this.renderCheckout();

        return true;
    },

    cancelCoinCheckout: function() {
        this.checkoutType = "game";
        this.selectedCoinPackage = null;
        this.processing = false;

        GAMEHUB.navigation.showPage("coins");
        GAMEHUB.coins.render();
    },

    startGameCheckout: function() {
        this.checkoutType = "game";
        this.selectedPlan = null;
        this.planPrice = 0;
        this.selectedCoinPackage = null;
        this.processing = false;

        GAMEHUB.navigation.showPage("checkout");
        this.renderCheckout();

        return true;
    },

    buyNowGame: function(gameId) {
        if (this.processing) return false;

        const game = GAMEHUB.games.find(
            item => String(item.id) === String(gameId)
        );

        if (!game) {
            alert("Game not found. Please try again.");
            return false;
        }

        const pricing = GAMEHUB.cart.getPricing(game);
        const price = Number(pricing.finalPrice);

        if (!Number.isFinite(price) || price < 0) {
            alert("Invalid game price.");
            return false;
        }

        const orders = GAMEHUB.storage.getOrders();

        if (!Array.isArray(orders)) {
            alert("Unable to read order history.");
            return false;
        }

        const order = {
            id: "GH-" + Date.now(),
            type: "game",
            plan: null,
            items: [{
                ...game,
                price: price,
                quantity: 1
            }],
            total: price,
            method: "Demo Buy Now",
            status: "Demo Confirmation",
            date: new Date().toLocaleString()
        };

        orders.push(order);

        if (!GAMEHUB.storage.saveOrders(orders)) {
            alert("Unable to save your demo order.");
            return false;
        }

        this.renderConfirmation(order);
        GAMEHUB.navigation.showPage("orderConfirmation");

        if (GAMEHUB.profile) {
            GAMEHUB.profile.render();
        }

        return true;
    },

    cancelSubscriptionCheckout: function() {
        this.checkoutType = "game";
        this.selectedPlan = null;
        this.planPrice = 0;
        this.selectedCoinPackage = null;
        this.processing = false;

        GAMEHUB.navigation.showPage("subscriptions");
    },

    openPayment: function() {
        if (this.checkoutType === "subscription") {
            if (!this.selectedPlan || this.planPrice <= 0) {
                alert("Invalid subscription order.");
                return;
            }
        } else if (this.checkoutType === "coins") {
            if (!this.selectedCoinPackage) {
                alert("Invalid coin package.");
                return;
            }
        } else if (GAMEHUB.cart.getItems().length === 0) {
            alert("Your cart is empty!");
            return;
        }

        this.processing = false;

        GAMEHUB.navigation.showPage("payment");
        this.render();
    },

    
render: function() {
    const container = document.getElementById("paymentContainer");
    if (!container) return;

    const total = this.checkoutType === "subscription"
        ? this.planPrice
        : this.checkoutType === "coins"
            ? this.selectedCoinPackage.price
            : GAMEHUB.cart.getSubtotal();

    container.innerHTML = `
        <div class="payment-card">
            <h2>Select Payment Method</h2>

            <p class="payment-total">
                Total: <strong>₱${total.toFixed(2)}</strong>
            </p>

            <div class="payment-methods">

                <button
                    class="payment-option gcash-option ${this.selectedMethod === "GCash" ? "active" : ""}"
                    onclick="GAMEHUB.payment.selectMethod('GCash')">
                    GCash
                </button>

                <button
                    class="payment-option maya-option ${this.selectedMethod === "Maya" ? "active" : ""}"
                    onclick="GAMEHUB.payment.selectMethod('Maya')">
                    Maya
                </button>

            </div>

            <div class="payment-instructions">

                <h3>${this.selectedMethod} Demo Payment</h3>

                <p>
                    This is a sample payment screen for the
                    GAMEHUB+ school project.
                </p>

                <div class="qr-placeholder">

                    <img
                        src="images/gcash-qr.svg"
                        alt="GCash QR Code"
                        class="payment-qr-image"
                        style="width:220px;height:220px;object-fit:contain;background:#ffffff;padding:10px;border-radius:12px;"
                        onerror="this.parentElement.innerHTML='<p>Unable to load QR code. Please check the image filename and path.</p>'">

                    <span>GCASH QR CODE</span>

                </div>

                <p>
                    The same GCash QR image is displayed for both
                    payment options. Maya compatibility is not guaranteed.
                </p>

                <p class="demo-notice">
                    DEMO ONLY: Do not send real money.
                    This system does not verify actual payments.
                </p>

                <button class="btn-primary"
                    ${this.processing ? "disabled" : ""}
                    onclick="GAMEHUB.payment.confirmDemoPayment()">
                    ${this.processing ? "Processing..." : "Confirm Demo Payment"}
                </button>

            </div>
        </div>
    `;
},


    confirmDemoPayment: function() {
        if (this.processing) return;

        if (!["GCash", "Maya"].includes(this.selectedMethod)) {
            alert("Please select a valid payment method.");
            return;
        }

        const isSubscription = this.checkoutType === "subscription";
        const isCoinPurchase = this.checkoutType === "coins";
        const coinPackage = this.selectedCoinPackage;

        const cart = (isSubscription || isCoinPurchase)
            ? []
            : GAMEHUB.cart.getItems();

        if (isSubscription) {
            if (
                !this.selectedPlan ||
                !["Pro", "Ultimate"].includes(this.selectedPlan) ||
                this.planPrice !== (this.selectedPlan === "Pro" ? 149 : 299)
            ) {
                alert("Invalid subscription order.");
                return;
            }
        } else if (isCoinPurchase) {
            if (
                !coinPackage ||
                !GAMEHUB.coins.packages.some(
                    item => item.id === coinPackage.id
                )
            ) {
                alert("Invalid coin purchase.");
                return;
            }
        } else if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        this.processing = true;

        const orderItems = cart.map(item => ({
            ...item,
            price: this.getLinePrice(item),
            quantity: Number(item.quantity) || 1
        }));

        const total = isSubscription
            ? this.planPrice
            : isCoinPurchase
                ? coinPackage.price
                : orderItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );

        const order = {
            id: "GH-" + Date.now(),
            type: isSubscription
                ? "subscription"
                : isCoinPurchase
                    ? "coins"
                    : "game",

            plan: isSubscription ? this.selectedPlan : null,

            coinPackage: isCoinPurchase ? {
                id: coinPackage.id,
                name: coinPackage.name,
                coins: coinPackage.coins
            } : null,

            items: orderItems,
            total: total,
            method: this.selectedMethod,
            status: "Demo Confirmation",
            date: new Date().toLocaleString()
        };

        const orders = GAMEHUB.storage.getOrders();

        if (!Array.isArray(orders)) {
            this.processing = false;
            alert("Unable to read order history. Please try again.");
            this.render();
            return;
        }

        orders.push(order);

        if (!GAMEHUB.storage.saveOrders(orders)) {
            this.processing = false;
            alert("Unable to save your demo order. Please try again.");
            this.render();
            return;
        }

        // UPDATE SUBSCRIPTION
        if (isSubscription) {
            const profile = GAMEHUB.profile.getUser();

            profile.subscription = this.selectedPlan;

            if (!GAMEHUB.storage.saveProfile(profile)) {
                const rollback = orders.filter(
                    item => item.id !== order.id
                );

                GAMEHUB.storage.saveOrders(rollback);

                this.processing = false;
                alert("Unable to update your subscription. Please try again.");
                this.render();
                return;
            }

        // ADD COINS AFTER SUCCESSFUL DEMO PAYMENT
        } else if (isCoinPurchase) {

            const successful = GAMEHUB.coins.addCoins(
                coinPackage.coins,
                "Coin purchase: " + coinPackage.name + " package",
                order.id
            );

            if (!successful) {
                const rollback = orders.filter(
                    item => item.id !== order.id
                );

                GAMEHUB.storage.saveOrders(rollback);

                this.processing = false;
                alert("Coin purchase could not be completed.");
                this.render();
                return;
            }

        // CLEAR GAME CART
        } else {

            if (!GAMEHUB.cart.clear()) {
                const rollback = orders.filter(
                    item => item.id !== order.id
                );

                GAMEHUB.storage.saveOrders(rollback);

                this.processing = false;
                alert("Unable to complete the order. Your cart could not be cleared.");
                this.render();
                return;
            }
        }

        this.renderConfirmation(order);

        if (GAMEHUB.profile) {
            GAMEHUB.profile.render();
        }

        this.processing = false;

        if (isSubscription || isCoinPurchase) {
            this.checkoutType = "game";
            this.selectedPlan = null;
            this.planPrice = 0;
            this.selectedCoinPackage = null;
        }

        GAMEHUB.navigation.showPage("orderConfirmation");
    },

    renderConfirmation: function(order) {
        const container = document.getElementById(
            "orderConfirmationContainer"
        );

        if (!container) return;

        const isSubscription = order.type === "subscription";
        const isCoinPurchase = order.type === "coins";

        const game = order.items && order.items[0];

        const gameImage = game && game.image
            ? this.escapeHTML(game.image)
            : "";

        const background = gameImage
            ? `background-image: linear-gradient(
                rgba(0,0,0,0.78),
                rgba(0,0,0,0.88)
            );`
            : "";

        container.innerHTML = `
            <div class="confirmation-card game-confirmation-card"
                 style="${background}">

                ${gameImage ? `
                    <img class="confirmation-bg-image"
                         src="${gameImage}"
                         alt=""
                         aria-hidden="true">
                ` : ""}

                <div class="confirmation-icon">✓</div>

                <h2>
                    ${isCoinPurchase
                        ? "Coin Purchase Successful!"
                        : "Demo Order Confirmed!"}
                </h2>

                <p>
                    ${isCoinPurchase
                        ? "Your GAMEHUB+ Demo Coins have been added to your balance."
                        : "Your sample GAMEHUB+ order has been recorded."}
                </p>

                <div class="order-details">

                    <p>
                        <strong>Order ID:</strong>
                        ${this.escapeHTML(order.id)}
                    </p>

                    ${isSubscription ? `
                        <p>
                            <strong>Subscription:</strong>
                            ${this.escapeHTML(order.plan)}
                        </p>
                    ` : ""}

                    ${isCoinPurchase ? `
                        <p>
                            <strong>Package:</strong>
                            ${this.escapeHTML(order.coinPackage.name)}
                        </p>

                        <p>
                            <strong>Coins Received:</strong>
                            ${Number(order.coinPackage.coins)} 🪙
                        </p>
                    ` : ""}

                    ${!isSubscription && !isCoinPurchase ? `
                        <p>
                            <strong>Game:</strong>
                            ${this.escapeHTML(game ? game.name : "Game")}
                        </p>
                    ` : ""}

                    <p>
                        <strong>Payment Method:</strong>
                        ${this.escapeHTML(order.method)}
                    </p>

                    <p>
                        <strong>Total:</strong>
                        ₱${Number(order.total).toFixed(2)}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${this.escapeHTML(order.date)}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        Demo Confirmation
                    </p>
                </div>

                <p class="demo-notice">
                    This is not proof of real payment.
                </p>

                ${!isSubscription && !isCoinPurchase ? `
                    <button class="btn-primary"
                        type="button"
                        onclick="GAMEHUB.payment.showDownloadSuccess('${this.escapeHTML(order.id)}')">
                        Download
                    </button>
                ` : ""}

                ${isCoinPurchase ? `
                    <button class="btn-primary"
                        type="button"
                        onclick="GAMEHUB.navigation.showPage('coins'); GAMEHUB.coins.render()">
                        View Coin Balance
                    </button>
                ` : ""}

                <button class="btn-primary"
                    type="button"
                    onclick="GAMEHUB.navigation.showPage('home')">
                    Back to Home
                </button>
            </div>
        `;
    },

    showDownloadSuccess: function(orderId) {
        const orders = GAMEHUB.storage.getOrders();

        if (!Array.isArray(orders)) return;

        const order = orders.find(item => item.id === orderId);

        if (!order || order.type !== "game") return;

        const game = order.items && order.items[0];

        if (!game) return;

        const catalogGame = GAMEHUB.getGameById(game.id);

        if (!GAMEHUB.app.requestGameAccess(game.id)) {
            return;
        }

        const image = game.image
            ? this.escapeHTML(game.image)
            : "";

        const background = image
            ? `background-image: linear-gradient(
                rgba(0,0,0,0.82),
                rgba(0,0,0,0.92)
            ), url('${image}');`
            : "";

        const container = document.getElementById(
            "orderConfirmationContainer"
        );

        if (!container) return;

        container.innerHTML = `
            <div class="confirmation-card game-confirmation-card"
                 style="${background}">

                <div class="confirmation-icon">✓</div>

                <h2>Download Successful!</h2>

                <p>
                    You successfully download the game.
                </p>

                <h3>${this.escapeHTML(game.name)}</h3>

                <button class="btn-primary"
                    type="button"
                    onclick="GAMEHUB.navigation.showPage('home')">
                    OK
                </button>

            </div>
        `;
    }

};

console.log("GAMEHUB+ Payment System Loaded!");
