window.GAMEHUB = window.GAMEHUB || {};

GAMEHUB.cart = {

    // GET CART ITEMS
    getItems: function() {
    const cart = GAMEHUB.storage.getCart();
    return Array.isArray(cart) ? cart : [];
},

    // ESCAPE HTML
    escapeHTML: function(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    },

    // GAME PRICING
    getPricing: function(game) {
        const originalPrice = Number(game.price) || 0;

        // Only apply a discount when a valid percentage is provided.
        const percentage = Number(game.discountPercent) || 0;
        const discountPercent = Math.min(100, Math.max(0, percentage));

        const discount = originalPrice * discountPercent / 100;
        const finalPrice = originalPrice - discount;

        return {
            discount: discountPercent,
            originalPrice: originalPrice,
            finalPrice: finalPrice
        };
    },

    // GET FINAL PRICE OF A CART ITEM
    getItemPrice: function(item) {
        const game = GAMEHUB.getGameById(item.id);

        if (game) {
            return this.getPricing(game).finalPrice;
        }

        return Number(item.price) || 0;
    },

    // CART SUBTOTAL
    getSubtotal: function() {
        return this.getItems().reduce((total, item) => {
            return total +
                (this.getItemPrice(item) * (Number(item.quantity) || 1));
        }, 0);
    },

    // REFRESH RELATED PAGES
    refreshRelatedPages: function() {
        this.render();

        if (GAMEHUB.payment) {
            GAMEHUB.payment.renderCheckout();
        }
    },

    // ADD GAME TO CART
    add: function(gameId) {
        const game = GAMEHUB.getGameById(gameId);

        if (!game) {
            alert("Game not found!");
            return false;
        }

        const cart = this.getItems();

        const existingItem = cart.find(item => item.id === gameId);

        if (existingItem) {
            alert("This game is already in your cart!");
            return false;
        }

        const pricing = this.getPricing(game);

        cart.push({
            id: game.id,
            name: game.name,
            price: pricing.originalPrice,
            image: game.image,
            quantity: 1
        });

        const saved = GAMEHUB.storage.saveCart(cart);

        if (!saved) {
            alert("Unable to save your cart. Please try again.");
            return false;
        }

        this.refreshRelatedPages();

        alert(game.name + " successfully added to your cart!");

        return true;
    },

    // REMOVE GAME
    remove: function(gameId) {
        const updatedCart = this.getItems().filter(
            item => item.id !== gameId
        );

        const saved = GAMEHUB.storage.saveCart(updatedCart);

        if (!saved) {
            alert("Unable to update your cart.");
            return false;
        }

        this.refreshRelatedPages();

        return true;
    },

    // CLEAR CART
    clear: function() {
        const saved = GAMEHUB.storage.saveCart([]);

        if (saved) {
            this.refreshRelatedPages();
        }

        return saved;
    },

    // BUY & DOWNLOAD CONFIRMATION COMPATIBILITY
    closeConfirmation: function() {
        // No separate confirmation modal is currently required.
        return true;
    },

    // RENDER CART
    render: function() {
        const container = document.getElementById("cartContainer");

        if (!container) return;

        const cart = this.getItems();

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Your Cart is Empty</h3>
                    <p>
                        Explore our game catalog and add
                        something you like!
                    </p>

                    <button
                        class="btn-primary"
                        data-page="games"
                    >
                        Explore Games
                    </button>
                </div>
            `;

            return;
        }

        container.innerHTML = `
            <div class="cart-list">

                ${cart.map(item => {
                    const name = this.escapeHTML(item.name);
                    const image = this.escapeHTML(item.image);
                    const price = this.getItemPrice(item);
                    const quantity = Number(item.quantity) || 1;

                    return `
                        <div class="cart-item">

                            <img
                                src="${image}"
                                alt="${name}"
                                onerror="this.style.display='none'"
                            >

                            <div class="cart-item-info">
                                <h3>${name}</h3>

                                <p>
                                    ₱${price.toFixed(2)}
                                </p>

                                <p>
                                    Quantity: ${quantity}
                                </p>
                            </div>

                            <button
                                class="btn-danger"
                                onclick="GAMEHUB.cart.remove('${this.escapeHTML(item.id)}')"
                            >
                                Remove
                            </button>

                        </div>
                    `;
                }).join("")}

            </div>

            <div class="cart-summary">

                <h3>ORDER SUMMARY</h3>

                <p>
                    Subtotal:
                    <strong>
                        ₱${this.getSubtotal().toFixed(2)}
                    </strong>
                </p>

                <button
                    class="btn-primary"
                    onclick="GAMEHUB.payment.startGameCheckout()"
                >
                    Proceed to Checkout
                </button>

                <button
                    class="btn-danger"
                    onclick="GAMEHUB.cart.clear()"
                >
                    Clear Cart
                </button>

            </div>
        `;
    }

};

console.log("GAMEHUB+ Cart System Loaded!");
