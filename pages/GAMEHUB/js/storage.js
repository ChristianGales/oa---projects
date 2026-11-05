/* =====================================
   GAMEHUB+ STORAGE SYSTEM
   Demo Data Management
===================================== */

window.GAMEHUB = window.GAMEHUB || {};

GAMEHUB.storage = {

    prefix: "gamehub_plus_",

    // SAVE DATA
    save: function (key, value) {
        try {
            localStorage.setItem(
                this.prefix + key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {
            console.error("Storage save error:", error);
            return false;
        }
    },

    // GET DATA
    get: function (key, fallback = null) {
        try {
            const data = localStorage.getItem(
                this.prefix + key
            );

            return data === null
                ? fallback
                : JSON.parse(data);

        } catch (error) {
            console.error("Storage read error:", error);
            return fallback;
        }
    },

    // REMOVE DATA
    remove: function (key) {
        localStorage.removeItem(this.prefix + key);
    },

    // CLEAR GAMEHUB+ DATA
    clearAll: function () {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    },

    // ACCOUNT LIST
    getAccounts: function () {
        return this.get("accounts", []);
    },

    saveAccounts: function (accounts) {
        return this.save("accounts", accounts);
    },

    // CURRENT SESSION
    getSession: function () {
        return this.get("session", null);
    },

    saveSession: function (session) {
        return this.save("session", session);
    },

    clearSession: function () {
        this.remove("session");
    },

    // USER PROFILE
    getProfile: function () {
        return this.get("profile", null);
    },

    saveProfile: function (profile) {
        return this.save("profile", profile);
    },

    // CART
    getCart: function () {
        return this.get("cart", []);
    },

    saveCart: function (cart) {
        return this.save("cart", cart);
    },

    // ORDER HISTORY
    getOrders: function () {
        return this.get("orders", []);
    },

    saveOrders: function (orders) {
        return this.save("orders", orders);
    },

    // COIN HISTORY
    getCoinHistory: function () {
        return this.get("coinHistory", []);
    },

    saveCoinHistory: function (history) {
        return this.save("coinHistory", history);
    }

};

console.log("GAMEHUB+ Storage System Loaded!");
