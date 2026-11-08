// =========================================
// JENPOTZZ COSMETICS PLUS
// NAVIGATION, FILTERS, FAQ AND CONTACT DEMO
// =========================================

document.addEventListener("DOMContentLoaded", function () {
  // MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");

    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // CLOSE MOBILE MENU WITH ESCAPE
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // ACTIVE NAVIGATION LINK
  const pageSections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach(function (link) {
            const isActive = link.getAttribute("href") === "#" + currentId;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    pageSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // PRODUCT FILTERS
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach(function (filterButton) {
        const isActive = filterButton === button;

        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      productCards.forEach(function (card) {
        const category = card.dataset.category;
        const shouldShow =
          selectedFilter === "all" || category === selectedFilter;

        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // FAQ ACCORDION
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
      const isExpanded =
        question.getAttribute("aria-expanded") === "true";

      const answer = question.nextElementSibling;

      question.setAttribute("aria-expanded", String(!isExpanded));
      answer.hidden = isExpanded;
    });
  });

  // CONTACT FORM DEMO
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    formStatus.textContent =
      "Thank you! Your form works, but it is not connected to a message service yet.";

    contactForm.reset();
  });

  // CURRENT YEAR IN FOOTER
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();
});
