window.GAMEHUB = window.GAMEHUB || {};

GAMEHUB.app = {
    authMode: "login",

    escapeHTML: function(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    },

    showMessage: function(message, success = false) {
        const box = document.getElementById("authMessage");
        if (!box) return;

        box.textContent = message;
        box.style.color = success ? "#4ade80" : "#ff6b6b";
    },

    setAuthMode: function(mode) {
        this.authMode = mode;

        const loginTab = document.getElementById("loginTab");
        const registerTab = document.getElementById("registerTab");
        const submit = document.getElementById("authSubmit");

        if (loginTab) loginTab.classList.toggle("active", mode === "login");
        if (registerTab) registerTab.classList.toggle("active", mode === "register");

        if (submit) {
            submit.textContent = mode === "login" ? "LOGIN" : "CREATE ACCOUNT";
        }

        this.showMessage(
            mode === "login" ? "Welcome back to GAMEHUB+!" : "Create your GAMEHUB+ demo account.",
            true
        );
    },

    getAuthFields: function() {
        const form = document.getElementById("authForm");
        if (!form) return {};

        const username = form.querySelector(
            '#username, #usernameInput, [name="username"], input[type="text"]'
        );

        const password = form.querySelector(
            '#password, #passwordInput, [name="password"], input[type="password"]'
        );

        return {
            username: username ? username.value.trim() : "",
            password: password ? password.value : ""
        };
    },

    handleAuth: function(event) {
        event.preventDefault();

        const fields = this.getAuthFields();
        const username = fields.username;
        const password = fields.password;

        if (!username || !password) {
            this.showMessage("Please enter your username and password.");
            return;
        }

        if (username.length < 3 || password.length < 4) {
            this.showMessage("Username must have 3 characters and password 4 characters minimum.");
            return;
        }

        const accounts = GAMEHUB.storage.getAccounts() || [];

        if (this.authMode === "register") {
            const exists = accounts.some(
                account => account.username.toLowerCase() === username.toLowerCase()
            );

            if (exists) {
                this.showMessage("That username is already registered.");
                return;
            }

            accounts.push({
                username: username,
                password: password
            });

            const saved = GAMEHUB.storage.saveAccounts(accounts);

if (!saved) {
    this.showMessage("Unable to create account. Please try again.");
    return;
}

this.setAuthMode("login");
this.showMessage("Account created! You can now log in.", true);
return;
        }

        const account = accounts.find(
            item =>
                item.username.toLowerCase() === username.toLowerCase() &&
                item.password === password
        );

        if (!account) {
            this.showMessage("Incorrect username or password.");
            return;
        }

        const sessionSaved = GAMEHUB.storage.saveSession({
    username: account.username,
    loggedIn: true
});

if (!sessionSaved) {
    this.showMessage("Unable to start your session. Please try again.");
    return;
}

const existingProfile = GAMEHUB.storage.getProfile() || {};

const profileSaved = GAMEHUB.storage.saveProfile({
    ...existingProfile,
    username: account.username,
    subscription: existingProfile.subscription || "Free"
});

if (!profileSaved) {
    GAMEHUB.storage.clearSession();
    this.showMessage("Unable to save your profile. Please try again.");
    return;
}

this.enterWebsite();
      
    },

    enterWebsite: function() {
        const auth = document.getElementById("authSection");
        const main = document.getElementById("mainWebsite");

        if (auth) auth.hidden = true;
        if (main) main.hidden = false;

        GAMEHUB.navigation.showPage("home");
        this.renderAll();
    },

    

renderGameCards: function(games) {
    return games.map(game => {
        const pricing = GAMEHUB.cart.getPricing(game);

        return `
            <article class="game-card">
                <img
                    src="${this.escapeHTML(game.image)}"
                    alt="${this.escapeHTML(game.name)}"
                    onerror="this.style.display='none'"
                >

                <div class="game-card-content">
                    <span class="game-status">
                        ${this.escapeHTML(game.status)}
                    </span>

                    <h3>${this.escapeHTML(game.name)}</h3>
                    <p>${this.escapeHTML(game.category)}</p>
                    <p>${this.escapeHTML(game.description)}</p>

                    ${pricing.discount > 0 ? `
                        <span class="game-status">
                            ${pricing.discount}% OFF
                        </span>
                        <p style="text-decoration:line-through;color:#999;">
                            ₱${pricing.originalPrice.toFixed(2)}
                        </p>
                    ` : ""}

                    <strong>
                        ₱${pricing.finalPrice.toFixed(2)}
                    </strong>

                    <div class="game-card-actions">
                        <button type="button" class="btn-primary"
                            onclick="GAMEHUB.cart.add('${this.escapeHTML(game.id)}')">
                            Add to Cart
                        </button>

                        <button type="button" class="btn-primary"
                            onclick="GAMEHUB.app.buyGame('${this.escapeHTML(game.id)}')">
                            Buy Now
                        </button>
                    </div>

                    <small class="game-ctto-note">CTTO Note</small>
                </div>
            </article>
        `;
    }).join("");
},



    renderHome: function() {
        const container = document.getElementById("featuredGames");
        if (!container) return;

        container.innerHTML = this.renderGameCards(
            GAMEHUB.getFeaturedGames()
        );
    },

  

getUserPlan: function() {
    const profile = GAMEHUB.storage.getProfile() || {};
    const subscription = profile.subscription || "Starter";

    return subscription === "Free"
        ? "Starter"
        : subscription;
},

hasGameAccess: function(game) {
    if (!game) return false;

    const planLevels = {
        Starter: 1,
        Pro: 2,
        Ultimate: 3
    };

    const userPlan = this.getUserPlan();
    const requiredPlan = game.requiredPlan || "Ultimate";

    return (planLevels[userPlan] || 0) >=
           (planLevels[requiredPlan] || 99);
},

requestGameAccess: function(gameId) {
    const game = GAMEHUB.getGameById(gameId);

    if (!game) {
        alert("Game not found.");
        return false;
    }

    if (this.hasGameAccess(game)) {
        return true;
    }

    const requiredPlan = game.requiredPlan || "Ultimate";

    const upgrade = confirm(
        "This game requires the " + requiredPlan +
        " subscription.\n\nWould you like to view the subscription plans?"
    );

    if (upgrade) {
        GAMEHUB.navigation.showPage("subscriptions");
    }

    return false;
},

buyGame: function(gameId) {
    GAMEHUB.payment.buyNowGame(gameId);
},



    renderGames: function() {
        const container = document.getElementById("gamesContainer");
        if (!container) return;

        container.innerHTML = this.renderGameCards(GAMEHUB.games);
    },

    

renderSubscriptions: function() {
    const container = document.getElementById("subscriptionContainer");
    if (!container) return;

    const plans = [
        {
            name: "Starter",
            price: 0,
            label: "BASIC ACCESS",
            description: "Start your gaming experience with basic access.",
            features: [
                "Access to Starter games",
                "Basic gaming experience",
                "No subscription payment required"
            ]
        },
        {
            name: "Pro",
            price: 149,
            label: "GAMER ACCESS",
            description: "Enjoy more games with your Pro membership.",
            features: [
                "Access to Pro games",
                "Includes Starter game access",
                "Premium member benefits"
            ]
        },
        {
            name: "Ultimate",
            price: 299,
            label: "FULL ACCESS",
            description: "Unlock the complete GAMEHUB+ game collection.",
            features: [
                "Access to Ultimate games",
                "Includes Pro and Starter games",
                "Premium member benefits"
            ]
        }
    ];

    container.innerHTML = `
        <div class="subscription-grid">
            ${plans.map(plan => `
                <article class="subscription-card subscription-${plan.name.toLowerCase()}">

                    <span class="subscription-label">
                        ${plan.label}
                    </span>

                    <h3>${plan.name}</h3>

                    <h2>
                        ₱${plan.price}
                        <small>${plan.price === 0 ? "/free" : "/demo"}</small>
                    </h2>

                    <p>${plan.description}</p>

                    <ul class="subscription-features">
                        ${plan.features.map(feature => `
                            <li>✓ ${feature}</li>
                        `).join("")}
                    </ul>

                    <button
                        type="button"
                        class="btn-primary"
                        onclick="GAMEHUB.app.selectPlan('${plan.name}')">

                        ${plan.price === 0 ? "Get Started" : "Subscribe Now"}

                    </button>

                </article>
            `).join("")}
        </div>
    `;
},


    
selectPlan: function(plan) {
    if (!["Starter", "Pro", "Ultimate"].includes(plan)) {
        return;
    }

    // STARTER PLAN
    if (plan === "Starter") {
        const updated = GAMEHUB.profile.update({
            subscription: "Starter"
        });

        if (!updated) return;

        alert("Starter plan successfully selected!");

        GAMEHUB.navigation.showPage("profile");
        return;
    }

    // PRO AND ULTIMATE CHECKOUT
    const price = plan === "Pro" ? 149 : 299;

    GAMEHUB.payment.startSubscriptionCheckout(
        plan,
        price
    );
},


 
renderMiniGames: function() {
    const container = document.getElementById("miniGamesContainer");
    if (!container) return;

    const activities = [
        {
            id: "quiz",
            name: "GAMING QUIZ",
            description: "Answer gaming questions and test your knowledge.",
            reward: 5,
            icon: "🎮",
            category: "BRAIN CHALLENGE"
        },
        {
            id: "basketball",
            name: "BASKETBALL SHOOTING",
            description: "Shoot the ball, score points, and beat the timer.",
            reward: 10,
            icon: "🏀",
            category: "SPORTS CHALLENGE"
        },
        {
            id: "puzzle",
            name: "PICTURE PUZZLE",
            description: "Arrange the mixed-up tiles in the correct order.",
            reward: 10,
            icon: "🧩",
            category: "PUZZLE CHALLENGE"
        }
    ];

    container.innerHTML = `
        <div class="mini-games-grid">
            ${activities.map(game => `
                <article class="mini-game-card">
                    <div class="mini-game-icon">${game.icon}</div>
                    <span class="mini-game-category">${game.category}</span>
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                    <div class="mini-game-reward">
                        🪙 ${game.reward} DEMO COINS
                    </div>
                    <button type="button"
                        class="btn-primary mini-game-play"
                        onclick="GAMEHUB.app.playMiniGame('${game.id}')">
                        PLAY NOW
                    </button>
                </article>
            `).join("")}
        </div>
    `;
},

miniGameTimer: null,
miniGameState: null,

playMiniGame: function(id) {
    const container = document.getElementById("miniGamesContainer");
    if (!container) return;

    if (this.miniGameTimer) {
        clearInterval(this.miniGameTimer);
        this.miniGameTimer = null;
    }

    if (id === "quiz") {
        this.miniGameState = {
            type: "quiz",
            index: 0,
            score: 0,
            questions: [
                {
                    question: "What does FPS stand for?",
                    choices: [
                        "First Person Shooter",
                        "Fast Player System",
                        "Final Play Score"
                    ],
                    answer: 0
                },
                {
                    question: "How many players are in a 5v5 match per team?",
                    choices: ["3", "5", "10"],
                    answer: 1
                },
                {
                    question: "Which device is commonly used to play console games?",
                    choices: ["Controller", "Printer", "Scanner"],
                    answer: 0
                }
            ]
        };

        this.renderQuizGame();
        return;
    }

    if (id === "basketball") {
        this.miniGameState = {
            type: "basketball",
            score: 0,
            shots: 0,
            time: 20,
            finished: false
        };

        this.renderBasketballGame();

        this.miniGameTimer = setInterval(() => {
            const state = this.miniGameState;
            if (!state || state.type !== "basketball") return;

            state.time--;

            const timer = document.getElementById("basketballTimer");
            if (timer) timer.textContent = state.time;

            if (state.time <= 0) {
                this.finishMiniGame(
                    "basketball",
                    state.score >= 10,
                    state.score
                );
            }
        }, 1000);

        return;
    }

    if (id === "puzzle") {
        const solved = [
            "🎮", "🕹️", "🎧",
            "🏆", "🔥", "🏀",
            "🎯", "👾", "⭐"
        ];

        const tiles = [...solved];

        do {
            for (let i = tiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
            }
        } while (tiles.every((tile, i) => tile === solved[i]));

        this.miniGameState = {
            type: "puzzle",
            solved: solved,
            tiles: tiles,
            selected: null,
            moves: 0
        };

        this.renderPuzzleGame();
    }
},

renderQuizGame: function() {
    const container = document.getElementById("miniGamesContainer");
    const state = this.miniGameState;
    if (!container || !state) return;

    const question = state.questions[state.index];

    container.innerHTML = `
        <div class="mini-game-screen">
            <div class="mini-game-screen-header">
                <button class="mini-game-back"
                    onclick="GAMEHUB.app.backToMiniGames()">
                    ← BACK
                </button>
                <span>🎮 GAMING QUIZ</span>
            </div>

            <div class="mini-game-inner-card">
                <span class="mini-game-category">
                    QUESTION ${state.index + 1} OF ${state.questions.length}
                </span>

                <h2>${question.question}</h2>

                <div class="mini-game-choices">
                    ${question.choices.map((choice, i) => `
                        <button class="mini-game-choice"
                            onclick="GAMEHUB.app.answerMiniQuiz(${i})">
                            ${choice}
                        </button>
                    `).join("")}
                </div>

                <div class="mini-game-score">
                    SCORE: ${state.score}
                </div>
            </div>
        </div>
    `;
},

answerMiniQuiz: function(choice) {
    const state = this.miniGameState;
    if (!state || state.type !== "quiz") return;

    if (choice === state.questions[state.index].answer) {
        state.score++;
    }

    state.index++;

    if (state.index >= state.questions.length) {
        this.finishMiniGame(
            "quiz",
            state.score === state.questions.length,
            state.score
        );
    } else {
        this.renderQuizGame();
    }
},

renderBasketballGame: function() {
    const container = document.getElementById("miniGamesContainer");
    const state = this.miniGameState;
    if (!container || !state) return;

    container.innerHTML = `
        <div class="mini-game-screen">
            <div class="mini-game-screen-header">
                <button class="mini-game-back"
                    onclick="GAMEHUB.app.backToMiniGames()">
                    ← BACK
                </button>
                <span>🏀 BASKETBALL SHOOTING</span>
            </div>

            <div class="mini-game-inner-card basketball-game">
                <div class="basketball-stats">
                    <div>
                        <small>SCORE</small>
                        <strong id="basketballScore">${state.score}</strong>
                    </div>
                    <div>
                        <small>TIME</small>
                        <strong id="basketballTimer">${state.time}</strong>
                    </div>
                    <div>
                        <small>SHOTS</small>
                        <strong id="basketballShots">${state.shots}</strong>
                    </div>
                </div>

                <div class="basketball-court">
                    <div class="basketball-hoop">🏀</div>
                    <div class="basketball-player">🏀</div>
                </div>

                <h2>MAKE YOUR SHOT!</h2>
                <p>Tap the shoot button before time runs out.</p>

                <button class="basketball-shoot"
                    onclick="GAMEHUB.app.shootBasketball()">
                    🏀 SHOOT!
                </button>

                <p class="mini-game-hint">
                    Reach 10 points to earn your demo coins!
                </p>
            </div>
        </div>
    `;
},

shootBasketball: function() {
    const state = this.miniGameState;
    if (!state || state.type !== "basketball" || state.time <= 0) return;

    state.shots++;

    // Each shot has a chance to score 2 points.
    if (Math.random() < 0.65) {
        state.score += 2;
    }

    const score = document.getElementById("basketballScore");
    const shots = document.getElementById("basketballShots");

    if (score) score.textContent = state.score;
    if (shots) shots.textContent = state.shots;

    if (state.score >= 10) {
        this.finishMiniGame("basketball", true, state.score);
    }
},

renderPuzzleGame: function() {
    const container = document.getElementById("miniGamesContainer");
    const state = this.miniGameState;
    if (!container || !state) return;

    container.innerHTML = `
        <div class="mini-game-screen">
            <div class="mini-game-screen-header">
                <button class="mini-game-back"
                    onclick="GAMEHUB.app.backToMiniGames()">
                    ← BACK
                </button>
                <span>🧩 PICTURE PUZZLE</span>
            </div>

            <div class="mini-game-inner-card">
                <span class="mini-game-category">3 × 3 PUZZLE</span>
                <h2>COMPLETE THE GAMING PICTURE</h2>
                <p>Tap two tiles to swap their positions.</p>

                <div class="puzzle-grid">
                    ${state.tiles.map((tile, i) => `
                        <button
                            class="puzzle-tile ${state.selected === i ? "selected" : ""}"
                            onclick="GAMEHUB.app.selectPuzzleTile(${i})">
                            ${tile}
                        </button>
                    `).join("")}
                </div>

                <div class="mini-game-score">
                    MOVES: ${state.moves}
                </div>

                <p class="mini-game-hint">
                    Arrange the gaming icons in the correct order.
                </p>
            </div>
        </div>
    `;
},

selectPuzzleTile: function(index) {
    const state = this.miniGameState;
    if (!state || state.type !== "puzzle") return;

    if (state.selected === null) {
        state.selected = index;
    } else {
        const first = state.selected;
        const second = index;

        if (first !== second) {
            [state.tiles[first], state.tiles[second]] =
                [state.tiles[second], state.tiles[first]];

            state.moves++;
        }

        state.selected = null;
    }

    this.renderPuzzleGame();

    if (state.tiles.every((tile, i) => tile === state.solved[i])) {
        this.finishMiniGame("puzzle", true, state.moves);
    }
},

finishMiniGame: function(id, won, score) {
    if (this.miniGameTimer) {
        clearInterval(this.miniGameTimer);
        this.miniGameTimer = null;
    }

    const container = document.getElementById("miniGamesContainer");
    if (!container) return;

    let reward = 0;

    if (won) {
        reward = id === "quiz" ? 5 : 10;

        const claimed = GAMEHUB.coins.addCoins(
            reward,
            "Mini-game reward: " + id,
            "minigame-" + id + "-" + Date.now()
        );

        if (claimed) {
            GAMEHUB.coins.render();
            GAMEHUB.profile.render();
        } else {
            reward = 0;
        }
    }

    container.innerHTML = `
        <div class="mini-game-screen">
            <div class="mini-game-inner-card mini-game-result">
                <div class="mini-game-result-icon">
                    ${won ? "🏆" : "🎮"}
                </div>

                <h2>${won ? "CHALLENGE COMPLETED!" : "GAME OVER!"}</h2>

                <p>
                    ${won
                        ? "Congratulations! You completed the challenge."
                        : "Good try! Play again and do better next time."}
                </p>

                <div class="mini-game-score">
                    FINAL SCORE: ${score}
                </div>

                ${reward > 0 ? `
                    <div class="mini-game-reward">
                        🪙 +${reward} DEMO COINS EARNED!
                    </div>
                ` : ""}

                <button class="btn-primary mini-game-play"
                    onclick="GAMEHUB.app.backToMiniGames()">
                    BACK TO MINI GAMES
                </button>
            </div>
        </div>
    `;
},

backToMiniGames: function() {
    if (this.miniGameTimer) {
        clearInterval(this.miniGameTimer);
        this.miniGameTimer = null;
    }

    this.miniGameState = null;
    this.renderMiniGames();
},


 
renderAbout: function() {
    const container = document.getElementById("aboutContainer");
    if (!container) return;

    container.innerHTML = `
        <!-- ABOUT HERO -->
        <section class="about-hero-card">
            <div class="about-hero-content">

                <span class="about-tag">
                    WELCOME TO GAMEHUB+
                </span>

                <h2>
                    ABOUT <span>GAMEHUB+</span>
                </h2>

                <p>
                    GAMEHUB+ is a sample gaming subscription
                    and promotional platform created to bring
                    games, membership plans, and exciting
                    gaming features into one place.
                </p>

                <div class="about-hero-highlight">
                    <span>🎮</span>
                    <div>
                        <h3>YOUR GAME. YOUR EXPERIENCE.</h3>
                        <p>
                            Discover games, explore subscriptions,
                            and enjoy the GAMEHUB+ experience.
                        </p>
                    </div>
                </div>

                <span class="about-project-note">
                    PROJECT DEMONSTRATION ONLY
                </span>

                <p class="about-disclaimer">
                    GAMEHUB+ is not an official partner or
                    distributor of the games displayed.
                </p>

            </div>
        </section>

        <!-- BUSINESS PROMOTIONAL SECTION -->
        <section class="about-promo-section">

            <div class="about-promo-image">
                <img
                    src="images/banners/gamehub-about-banner2.png"
                    alt="GAMEHUB+ Promotional Image"
                >
            </div>

            <div class="about-promo-content">

                <span class="about-tag">
                    DISCOVER GAMEHUB+
                </span>

                <h2>
                    LEVEL UP YOUR
                    <span>GAMING EXPERIENCE.</span>
                </h2>

                <p>
                    GAMEHUB+ is a gaming subscription platform
                    designed to bring games, membership plans,
                    and exciting gaming features together in
                    one convenient place.
                </p>

                <p>
                    Our goal is to make discovering games
                    and exploring gaming experiences easier
                    and more enjoyable for players.
                </p>

                <h3>WHY CHOOSE GAMEHUB+?</h3>

                <!-- EXPLORE DIFFERENT GAMES -->
                <div class="about-benefit-card">
                    <div class="about-benefit-image">
                        <img
                            src="images/banners/about-games.jpg"
                            alt="Different gaming titles"
                        >
                    </div>

                    <div class="about-benefit-content">
                        <h4>EXPLORE DIFFERENT GAMES</h4>
                        <div class="about-benefits-grid">
                        <p>
                            Discover different games and
                            gaming genres in one convenient
                            platform.
                        </p>
                    </div>
                </div>

                <!-- FLEXIBLE SUBSCRIPTION PLANS -->
                <div class="about-benefit-card">
                    <div class="about-benefit-image">
                        <img
                            src="images/banners/about-plans.jpeg"
                            alt="Gaming subscription plans"
                        >
                    </div>

                    <div class="about-benefit-content">
                        <h4>FLEXIBLE SUBSCRIPTION PLANS</h4>
                        <p>
                            Choose a membership plan that
                            fits your gaming preferences
                            and budget.
                        </p>
                    </div>
                </div>

                <!-- CONVENIENT GAMING HUB -->
                <div class="about-benefit-card">
                    <div class="about-benefit-image">
                        <img
                            src="images/banners/about-hub.jpeg"
                            alt="Gaming platform dashboard"
                        >
                    </div>

                    <div class="about-benefit-content">
                        <h4>CONVENIENT GAMING HUB</h4>
                        <p>
                            Explore games, subscriptions,
                            and gaming features in one place.
                        </p>
                    </div>
                </div>

                <!-- FUN GAMING ACTIVITIES -->
                <div class="about-benefit-card">
                    <div class="about-benefit-image">
                        <img
                            src="images/banners/about-activities.jpg"
                            alt="Gaming activities"
                        >
                    </div>

                    <div class="about-benefit-content">
                        <h4>FUN GAMING ACTIVITIES</h4>
                        <p>
                            Enjoy mini-games, interactive
                            activities, and fun challenges.
                        </p>
                    </div>
                </div>

                <!-- REWARDS EXPERIENCE -->
                <div class="about-benefit-card">
                    <div class="about-benefit-image">
                        <img
                            src="images/banners/about-rewards.jpeg"
                            alt="Gaming coins and rewards"
                        >
                    </div>
                    
                    </div>

                    <div class="about-benefit-content">
                        <h4>REWARDS EXPERIENCE</h4>
                        <p>
                            Explore the demo coins and
                            rewards features available
                            on the platform.
                        </p>
                    </div>
                </div>

                <div class="about-promo-footer">
                    <h3>READY TO PLAY?</h3>
                    <p>
                        Discover what GAMEHUB+ has to offer
                        and start exploring today!
                    </p>
                    <strong>YOUR GAME. YOUR EXPERIENCE.</strong>
                </div>

            </div>
        </section>
    `;
},



    renderAll: function() {
        this.renderHome();
        this.renderGames();
        this.renderSubscriptions();
        this.renderMiniGames();
        this.renderAbout();

        GAMEHUB.cart.render();
        GAMEHUB.payment.renderCheckout();
        GAMEHUB.coins.render();
        GAMEHUB.profile.render();
    },

    setupMusic: function() {
        const music = document.getElementById("backgroundMusic");
        const toggle = document.getElementById("musicToggle");
        const mute = document.getElementById("musicMute");

        if (!music) return;

        if (toggle) {
            toggle.addEventListener("click", async () => {
                if (music.paused) {
                    try {
                        await music.play();
                        toggle.textContent = "⏸ Pause Music";
                    } catch (error) {
                        toggle.textContent = "▶ Play Music";
                        alert("Music could not play. Check your music file.");
                    }
                } else {
                    music.pause();
                    toggle.textContent = "▶ Play Music";
                }
            });
        }

        if (mute) {
            mute.addEventListener("click", () => {
                music.muted = !music.muted;
                mute.textContent = music.muted ? "🔇" : "🔊";
            });
        }
    },

    init: function() {
        const form = document.getElementById("authForm");
    const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (passwordInput && togglePassword) {
    togglePassword.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";

        togglePassword.textContent = isHidden ? "🙈" : "👁";
        togglePassword.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );
        togglePassword.setAttribute(
            "aria-pressed",
            String(isHidden)
        );
    });
}
        if (form) {
            form.addEventListener("submit", event => this.handleAuth(event));
        }

        const loginTab = document.getElementById("loginTab");
        const registerTab = document.getElementById("registerTab");

        if (loginTab) {
            loginTab.addEventListener("click", () => this.setAuthMode("login"));
        }

        if (registerTab) {
            registerTab.addEventListener("click", () => this.setAuthMode("register"));
        }

        GAMEHUB.navigation.init();
        this.setupMusic();

        const session = GAMEHUB.storage.getSession();

        if (session && session.loggedIn) {
            this.enterWebsite();
        } else {
            const auth = document.getElementById("authSection");
            const main = document.getElementById("mainWebsite");

            if (auth) auth.hidden = false;
            if (main) main.hidden = true;
        }

        console.log("GAMEHUB+ Main App Loaded!");
    }
};

document.addEventListener("DOMContentLoaded", function() {
    GAMEHUB.app.init();
});

