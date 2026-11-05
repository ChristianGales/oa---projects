/* =====================================
   GAMEHUB+ NAVIGATION SYSTEM
===================================== */

window.GAMEHUB = window.GAMEHUB || {};

GAMEHUB.navigation = {

    currentPage: "home",

    showPage: function (pageId) {

        const authSection = document.getElementById("authSection");
        const mainWebsite = document.getElementById("mainWebsite");

        // Require login before opening website pages
        const session = GAMEHUB.storage.getSession();

            if (!session || !session.loggedIn) {
            if (authSection) authSection.hidden = false;
            if (mainWebsite) mainWebsite.hidden = true;
            return;
        }

        const pages = document.querySelectorAll(".page-section");
        const targetPage = document.getElementById(pageId);

        if (!targetPage || !targetPage.classList.contains("page-section")) {
            console.warn("Page not found:", pageId);
            return;
        }

        pages.forEach(page => {
            page.hidden = true;
            page.classList.remove("active");
        });

        targetPage.hidden = false;
        targetPage.classList.add("active");

        this.currentPage = pageId;

        // Update active navigation button
        document.querySelectorAll("[data-page]").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === pageId
            );
        });

        // Refresh page-specific content
        if (pageId === "profile" && GAMEHUB.profile) {
            GAMEHUB.profile.render();
        }

        if (pageId === "cart" && GAMEHUB.cart) {
            GAMEHUB.cart.render();
        }

        if (pageId === "checkout" && GAMEHUB.payment) {
            GAMEHUB.payment.renderCheckout();
        }

        if (pageId === "coins" && GAMEHUB.coins) {
            GAMEHUB.coins.render();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    },

    openHome: function () {
        this.showPage("home");
    },

    init: function () {

        // Prevent duplicate navigation listeners
        if (this.initialized) return;

        this.initialized = true;

        // Event delegation supports dynamically generated buttons
        document.addEventListener("click", event => {

            const button = event.target.closest("[data-page]");

            if (!button) return;

            const pageId = button.dataset.page;

            this.showPage(pageId);

        });

    }

};

console.log("GAMEHUB+ Navigation Loaded!");
