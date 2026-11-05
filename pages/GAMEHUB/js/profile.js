window.GAMEHUB = window.GAMEHUB || {};

GAMEHUB.profile = {

    showLogoutConfirmation: false,

    getUser: function() {
        const profile = GAMEHUB.storage.getProfile();

        return profile && typeof profile === "object" && !Array.isArray(profile)
            ? profile
            : {};
    },

    getOrders: function() {
        const orders = GAMEHUB.storage.getOrders();

        return Array.isArray(orders)
            ? orders.filter(order => order && typeof order === "object")
            : [];
    },

    update: function(updatedData) {
        const profile = {
            ...this.getUser(),
            ...updatedData
        };

        const saved = GAMEHUB.storage.saveProfile(profile);

        if (!saved) {
            alert("Unable to save profile information. Storage may be full.");
            return false;
        }

        this.render();
        return true;
    },

    render: function() {
        const container = document.getElementById("profileContainer");

        if (!container) return;

        const profile = this.getUser();
        const session = GAMEHUB.storage.getSession();

        const username =
            profile.username || session?.username || "Player";

        const subscription = profile.subscription || "Free";
        const coins = GAMEHUB.coins.getBalance();
        const orders = this.getOrders();

        const avatar = profile.photo
            ? `<img class="profile-avatar-image"
                   src="${this.escapeHTML(profile.photo)}"
                   alt="Profile Picture">`
            : `<span class="profile-avatar-default">🎮</span>`;

        container.innerHTML = `
            <div class="profile-card">

                <div class="profile-gaming-banner">
                    <span class="profile-banner-tag">GAMEHUB+ PLAYER</span>
                    <span class="profile-banner-icon">🎮</span>
                </div>

                <div class="profile-main">

                    <div class="profile-avatar-frame">
                        <div class="profile-avatar">
                            ${avatar}
                        </div>
                    </div>

                    <h2 class="profile-username">
                        ${this.escapeHTML(username)}
                    </h2>

                    <p class="profile-subtitle">
                        GAMING ACCOUNT
                    </p>

                    <input
                        type="file"
                        id="profilePhotoInput"
                        class="profile-photo-input"
                        accept="image/png,image/jpeg,image/webp"
                        onchange="GAMEHUB.profile.changePhoto(this)"
                    >

                    <button class="btn-primary profile-photo-button"
                        onclick="document.getElementById('profilePhotoInput').click()">
                        📷 Change Profile Picture
                    </button>

                </div>

                <div class="profile-info">

                    <div class="profile-info-item">
                        <span>👤 USERNAME</span>
                        <strong>${this.escapeHTML(username)}</strong>
                    </div>

                    <div class="profile-info-item">
                        <span>👑 MEMBERSHIP</span>
                        <strong>${this.escapeHTML(subscription)}</strong>
                    </div>

                    <div class="profile-info-item">
                        <span>🪙 COIN BALANCE</span>
                        <strong>${coins} Coins</strong>
                    </div>

                    <div class="profile-info-item">
                        <span>📦 TOTAL ORDERS</span>
                        <strong>${orders.length} Orders</strong>
                    </div>

                </div>

                <div class="profile-actions">

                    <button class="btn-primary profile-orders-button"
                        onclick="GAMEHUB.profile.renderOrders()">
                        📋 View Order History
                    </button>

                    <button class="btn-danger profile-logout-button"
                        onclick="GAMEHUB.profile.logout()">
                         Log Out
                    </button>

                </div>

            </div>

            <div id="profileLogoutConfirmation" class="profile-logout-confirmation" hidden>

                <div class="profile-logout-dialog">

                    

                    <span class="profile-logout-label">
                        GAMEHUB+ ACCOUNT
                    </span>

                    <h2>Are You Sure?</h2>

                    <p>
                        Are you sure you want to log out
                        of your GAMEHUB+ account?
                    </p>

                    <div class="profile-logout-buttons">

                        <button class="profile-logout-yes"
                            onclick="GAMEHUB.profile.confirmLogout()">
                            YES, LOG OUT
                        </button>

                        <button class="profile-logout-no"
                            onclick="GAMEHUB.profile.cancelLogout()">
                            NO, CANCEL
                        </button>

                    </div>

                </div>

            </div>

            <div id="profileOrders"></div>
        `;

        this.renderOrders();
    },

    changePhoto: function(input) {
        const file = input.files && input.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a JPG, PNG, or WEBP image.");
            input.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Please choose an image smaller than 2MB.");
            input.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            this.update({
                photo: reader.result
            });
        };

        reader.onerror = () => {
            alert("Unable to read the selected image.");
        };

        reader.readAsDataURL(file);
    },

    renderOrders: function() {
        const container = document.getElementById("profileOrders");

        if (!container) return;

        const orders = this.getOrders();

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Orders Yet</h3>
                    <p>Your demo purchases will appear here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="order-history">

                <h3>📋 Order History</h3>

                ${orders.slice().reverse().map(order => {

                    const isSubscription =
                        order.type === "subscription";

                    const isCoins =
                        order.type === "coins";

                    const title = isSubscription
                        ? (order.plan || "Subscription Plan")
                        : isCoins
                            ? "Coin Purchase"
                            : "Game Purchase";

                    const details = isSubscription
                        ? `Plan: ${this.escapeHTML(order.plan || "Unknown")}`
                        : isCoins
                            ? `Package: ${this.escapeHTML(order.coinPackage?.name || "Coin Package")} - ${Number(order.coinPackage?.coins) || 0} Coins`
                            : (order.items || []).map(item =>
                                this.escapeHTML(item.name) +
                                " × " +
                                (Number(item.quantity) || 1)
                            ).join(", ");

                    return `
                        <div class="order-history-item">

                            <strong>
                                ${this.escapeHTML(order.id || "Unknown Order")}
                            </strong>

                            <h4>${title}</h4>

                            <p>${details}</p>

                            <p>
                                Payment:
                                ${this.escapeHTML(order.method || "Demo")}
                            </p>

                            <p>
                                Total:
                                ₱${(Number(order.total) || 0).toFixed(2)}
                            </p>

                            <small>
                                ${this.escapeHTML(order.date || "Date unavailable")}
                            </small>

                            <p class="demo-notice">
                                ${this.escapeHTML(order.status || "Demo Confirmation")}
                            </p>

                        </div>
                    `;
                }).join("")}

            </div>
        `;
    },

    logout: function() {
        const confirmation = document.getElementById(
            "profileLogoutConfirmation"
        );

        if (!confirmation) return;

        this.showLogoutConfirmation = true;
        confirmation.hidden = false;

        confirmation.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    },

    cancelLogout: function() {
        const confirmation = document.getElementById(
            "profileLogoutConfirmation"
        );

        if (confirmation) {
            confirmation.hidden = true;
        }

        this.showLogoutConfirmation = false;
    },

    confirmLogout: function() {
        if (!this.showLogoutConfirmation) return;

        GAMEHUB.storage.clearSession();

        this.showLogoutConfirmation = false;

        const main = document.getElementById("mainWebsite");
        const auth = document.getElementById("authSection");

        if (main) main.hidden = true;
        if (auth) auth.hidden = false;

        GAMEHUB.navigation.currentPage = "home";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    },

    escapeHTML: function(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }
};

console.log("GAMEHUB+ Profile System Loaded!");
