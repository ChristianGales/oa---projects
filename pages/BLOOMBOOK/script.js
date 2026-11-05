/*
  BLOOM BOOKS — COMPLETE SERIES STORE

  Each product is a whole series or collection.
  Prices are in Philippine pesos (PHP).
  Harry Potter uses a verified retail reference.
  Other prices are editable planning estimates, not supplier quotes.
*/

const books = [
  {
    id: 1,
    title: "Harry Potter",
    author: "J.K. Rowling",
    category: "Fantasy",
    booksCount: 7,
    edition: "Paperback boxed set",
    price: 5499,
    oldPrice: null,
    priceType: "Retail reference",
    image: "images/Harry Potter.png",
    badge: "BESTSELLER"
  },
  {
    id: 2,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    booksCount: 3,
    edition: "Paperback trilogy set",
    price: 1649,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/The Lord of the Rings.png",
    badge: "FANTASY CLASSIC"
  },
  {
    id: 3,
    title: "Dune Saga",
    author: "Frank Herbert",
    category: "Science Fiction",
    booksCount: 6,
    edition: "Six-book main series",
    price: 4988,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/Dune Saga.png",
    badge: "SCI-FI FAVORITE"
  },
  {
    id: 4,
    title: "A Song of Ice and Fire",
    author: "George R.R. Martin",
    category: "Fantasy",
    booksCount: 5,
    edition: "Main novels collection",
    price: 3499,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/A Song of Fire and Ice.png",
    badge: "EPIC FANTASY"
  },
  {
    id: 5,
    title: "Red Rising",
    author: "Pierce Brown",
    category: "Science Fiction",
    booksCount: 6,
    edition: "Six-book collection",
    price: 3299,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/Red Rising.png",
    badge: "SPACE OPERA"
  },
  {
    id: 6,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    category: "Young Adult",
    booksCount: 4,
    edition: "Four-book collection",
    price: 2499,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/The Hunger Games.jpg",
    badge: "DYSTOPIAN FAVORITE"
  },
  {
    id: 7,
    title: "Percy Jackson and the Olympians",
    author: "Rick Riordan",
    category: "Young Adult",
    booksCount: 5,
    edition: "Original five-book series",
    price: 1899,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/Percy Jackson and the Olympians.png",
    badge: "MYTHICAL ADVENTURE"
  },
  {
    id: 8,
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    category: "Romantasy",
    booksCount: 5,
    edition: "Five-book collection",
    price: 3299,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/A Court of Thorns and Roses.jpg",
    badge: "ROMANTASY"
  },
  {
    id: 9,
    title: "Millennium Series",
    author: "Stieg Larsson",
    category: "Mystery",
    booksCount: 3,
    edition: "Original trilogy",
    price: 1999,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/Millennium Series.png",
    badge: "CRIME THRILLER"
  },
  {
    id: 10,
    title: "Outlander",
    author: "Diana Gabaldon",
    category: "Historical",
    booksCount: 9,
    edition: "Nine main novels",
    price: 5999,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/Outlander.webp",
    badge: "HISTORICAL ROMANCE"
  },
  {
    id: 11,
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    category: "Mystery",
    booksCount: 5,
    edition: "Five-book collection",
    price: 2499,
    oldPrice: null,
    priceType: "Estimate — verify edition",
    image: "images/The Thursday Murder Club.png",
    badge: "COZY MYSTERY"
  }
];

let activeCategory = "All";
let searchTerm = "";
let cart = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutDialog = document.getElementById("checkoutDialog");

function money(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  }).format(amount);
}

/* PRODUCT LISTING */

function renderProducts() {
  let filtered = books.filter(book => {
    const matchesCategory =
      activeCategory === "All" ||
      book.category === activeCategory;

    const searchable =
      `${book.title} ${book.author} ${book.category} ${book.edition}`
        .toLowerCase();

    return matchesCategory && searchable.includes(searchTerm);
  });

  const sort = document.getElementById("sortSelect").value;

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (!filtered.length) {
    productGrid.innerHTML = `
      <div class="empty-message">
        <h3>No series found 💗</h3>
        <p>Try another title, author, or category.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filtered.map(book => `
    <article class="product">
      <div class="book-cover">
        <span class="sale-badge">${book.badge}</span>

        <button
          class="favorite"
          data-favorite="${book.id}"
          aria-label="Favorite ${book.title}"
          type="button"
        >♡</button>

        <img
          class="real-book-cover"
          src="${book.image}"
          alt="${book.title} complete series set"
          loading="lazy"
          onerror="this.hidden=true; this.nextElementSibling.hidden=false"
        >

        <div class="image-placeholder" hidden>
          <span>📚</span>
          <strong>${book.title}</strong>
          <small>Add your set photo</small>
        </div>
      </div>

      <div class="product-info">
        <span class="genre">${book.category}</span>

        <h3>${book.title}</h3>
        <p class="author">by ${book.author}</p>

        <p class="set-count">📚 Complete set · ${book.booksCount} books</p>
        <p class="edition">${book.edition}</p>

        <div class="price-row">
          <span class="price">${money(book.price)}</span>
        </div>

        <p class="price-note">${book.priceType}</p>

        <button
          class="add-button"
          data-add="${book.id}"
          type="button"
        >
          🛍️ Add Complete Set
        </button>
      </div>
    </article>
  `).join("");
}

/* CATEGORY FILTERS */

function setCategory(category) {
  activeCategory = category;

  document.querySelectorAll(".category").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === category
    );
  });

  renderProducts();
}

document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});

document.querySelectorAll("[data-nav-category]").forEach(link => {
  link.addEventListener("click", () => {
    setCategory(link.dataset.navCategory);
  });
});

document.querySelectorAll("[data-footer-category]").forEach(link => {
  link.addEventListener("click", () => {
    setCategory(link.dataset.footerCategory);
  });
});

/* SEARCH AND SORT */

document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();

  document.getElementById("books").scrollIntoView({
    behavior: "smooth"
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
});

document.getElementById("sortSelect").addEventListener("change", renderProducts);

/* FAVORITES AND CART */

productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
  }

  if (favoriteButton) {
    const isFavorite = favoriteButton.textContent === "♥";
    favoriteButton.textContent = isFavorite ? "♡" : "♥";
    favoriteButton.style.color = isFavorite ? "" : "deeppink";
  }
});

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  renderCart();
}

function renderCart() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cart.reduce((sum, item) => {
    const book = books.find(book => book.id === item.id);
    return sum + book.price * item.quantity;
  }, 0);

  cartCount.textContent = quantity;
  cartTotal.textContent = money(total);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-message">
        <p style="font-size:40px">🛍️</p>
        <h3>Your book bag is empty!</h3>
        <p>Add a complete series to get started.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const book = books.find(book => book.id === item.id);

    return `
      <div class="cart-item">
        <div>
          <h4>${book.title}</h4>
          <p>${book.booksCount}-book set</p>
          <p>${money(book.price)} per set</p>

          <div class="quantity-controls">
            <button data-minus="${book.id}" aria-label="Remove one set">−</button>
            <span>${item.quantity} set(s)</span>
            <button data-plus="${book.id}" aria-label="Add one set">+</button>
          </div>
        </div>

        <button class="remove-item" data-remove="${book.id}">
          Remove
        </button>
      </div>
    `;
  }).join("");
}

cartItems.addEventListener("click", event => {
  const minus = event.target.closest("[data-minus]");
  const plus = event.target.closest("[data-plus]");
  const remove = event.target.closest("[data-remove]");

  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (plus) changeQuantity(Number(plus.dataset.plus), 1);

  if (remove) {
    const id = Number(remove.dataset.remove);
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }
});

/* CART PANEL */

document.getElementById("openCart").addEventListener("click", () => {
  cartOverlay.classList.add("open");
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartOverlay.classList.remove("open");
});

cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) {
    cartOverlay.classList.remove("open");
  }
});

/* DEMO CHECKOUT — NO REAL PAYMENT */

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your book bag is empty! Add a series first. 💗");
    return;
  }

  const total = cart.reduce((sum, item) => {
    const book = books.find(book => book.id === item.id);
    return sum + book.price * item.quantity;
  }, 0);

  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("checkoutSummary").textContent =
    `${quantity} complete series set(s), totaling ${money(total)}. ` +
    "Demo only: no payment will be collected.";

  cartOverlay.classList.remove("open");
  checkoutDialog.showModal();
});

document.getElementById("cancelCheckout").addEventListener("click", () => {
  checkoutDialog.close();
});

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const customer = formData.get("customer").trim();

  alert(
    `Thank you, ${customer}! 💗 This is a demo only. ` +
    "No order was submitted and no payment was taken."
  );

  checkoutDialog.close();
  event.target.reset();
});

/* INITIALIZE */

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();