window.GAMEHUB = window.GAMEHUB || {};

GAMEHUB.coins = {

    packages: [
        {
            id: "starter",
            name: "STARTER",
            coins: 20,
            price: 50,
            label: "STARTER PACK"
        },
        {
            id: "gamer",
            name: "GAMER",
            coins: 50,
            price: 100,
            label: "POPULAR"
        },
        {
            id: "pro",
            name: "PRO",
            coins: 120,
            price: 200,
            label: "BEST VALUE"
        },
        {
            id: "ultimate",
            name: "ULTIMATE",
            coins: 300,
            price: 450,
            label: "MEGA PACK"
        }
    ],

    getBalance: function() {
        return Number(GAMEHUB.storage.get("coinBalance", 0)) || 0;
    },

    saveBalance: function(balance) {
        return GAMEHUB.storage.save("coinBalance", balance);
    },

    getHistory: function() {
        const history = GAMEHUB.storage.getCoinHistory();
        return Array.isArray(history) ? history : [];
    },

    refreshDisplays: function() {
        this.render();

        if (GAMEHUB.profile) {
            GAMEHUB.profile.render();
        }
    },

    addCoins: function(amount, description, rewardId = null) {
        amount = Number(amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return false;
        }

        const history = this.getHistory();

        if (
            rewardId &&
            history.some(entry => entry.rewardId === rewardId)
        ) {
            alert("You have already claimed this reward!");
            return false;
        }

        const oldBalance = this.getBalance();
        const newBalance = oldBalance + amount;

        const entry = {
            id: "COIN-" + Date.now(),
            amount: amount,
            type: "Earned",
            description: description || "Coins earned",
            rewardId: rewardId,
            date: new Date().toLocaleString()
        };

        const updatedHistory = [...history, entry];

        const historySaved = GAMEHUB.storage.saveCoinHistory(
            updatedHistory
        );

        if (!historySaved) {
            alert("Unable to save coin history. Please try again.");
            return false;
        }

        const balanceSaved = this.saveBalance(newBalance);

        if (!balanceSaved) {
            GAMEHUB.storage.saveCoinHistory(history);
            alert("Unable to update coin balance. Please try again.");
            return false;
        }

        this.refreshDisplays();
        return true;
    },

    spendCoins: function(amount, description) {
        amount = Number(amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return false;
        }

        const oldBalance = this.getBalance();

        if (oldBalance < amount) {
            alert("Not enough GAMEHUB+ Coins!");
            return false;
        }

        const history = this.getHistory();

        const entry = {
            id: "COIN-" + Date.now(),
            amount: -amount,
            type: "Spent",
            description: description || "Coins spent",
            date: new Date().toLocaleString()
        };

        const updatedHistory = [...history, entry];

        const historySaved = GAMEHUB.storage.saveCoinHistory(
            updatedHistory
        );

        if (!historySaved) {
            alert("Unable to save coin history. Please try again.");
            return false;
        }

        const balanceSaved = this.saveBalance(oldBalance - amount);

        if (!balanceSaved) {
            GAMEHUB.storage.saveCoinHistory(history);
            alert("Unable to update coin balance. Please try again.");
            return false;
        }

        this.refreshDisplays();
        return true;
    },

    purchaseCoins: function(packageId) {
        if (!GAMEHUB.payment) {
            alert("Payment system is not available.");
            return;
        }

        GAMEHUB.payment.startCoinCheckout(packageId);
    },

    render: function() {
        const container = document.getElementById("coinStoreContainer");

        if (!container) return;

        const balance = this.getBalance();
        const history = this.getHistory();

        container.innerHTML = `
            <div class="coin-balance-card">
                <div class="coin-balance-icon">🪙</div>

                <span class="coin-store-label">
                    GAMEHUB+ WALLET
                </span>

                <h2>Your Coin Balance</h2>

                <div class="coin-balance">
                    ${balance.toLocaleString()} 🪙
                </div>

                <p>Available Demo Coins</p>
            </div>

            <section class="coin-promotions">

                <div class="coin-section-heading">
                    <span>🛒 COIN STORE</span>
                    <h2>Choose Your Coin Package</h2>
                    <p>Get more coins and enjoy more GAMEHUB+ rewards.</p>
                </div>

                <div class="coin-packages-grid">

                    ${this.packages.map(item => `
                        <article class="coin-package-card">

                            <span class="coin-package-label">
                                ${item.label}
                            </span>

                            <div class="coin-package-icon">
                                🪙
                            </div>

                            <h3>${item.name} PACK</h3>

                            <div class="coin-package-amount">
                                ${item.coins.toLocaleString()}
                                <small>COINS</small>
                            </div>

                            <div class="coin-package-price">
                                ₱${item.price.toFixed(2)}
                            </div>

                            <button class="btn-primary"
                                onclick="GAMEHUB.coins.purchaseCoins('${item.id}')">
                                PURCHASE NOW
                            </button>

                        </article>
                    `).join("")}

                </div>
            </section>

            <div class="coin-history">
                <h3>🧾 Coin History</h3>

                ${
                    history.length === 0
                    ? "<p>No coin transactions yet.</p>"
                    : history.slice().reverse().map(entry => `
                        <div class="coin-history-item">

                            <strong>
                                ${entry.amount > 0 ? "+" : ""}
                                ${Number(entry.amount)} Coins
                            </strong>

                            <p>
                                ${GAMEHUB.app.escapeHTML(entry.description)}
                            </p>

                            <small>
                                ${GAMEHUB.app.escapeHTML(entry.date)}
                            </small>

                        </div>
                    `).join("")
                }
            </div>
        `;
    }
};

console.log("GAMEHUB+ Coins System Loaded!");
