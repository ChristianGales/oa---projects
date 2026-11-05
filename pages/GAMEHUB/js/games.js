window.GAMEHUB = window.GAMEHUB || {};

GAMEHUB.games = [
    {
        id: "valorant",
        name: "VALORANT",
        category: "Tactical Shooter",
        price: 99,
        image: "images/games/valorant.jpg",
        description: "Experience tactical 5v5 battles with unique agents and competitive gameplay.",
        featured: true,
        status: "Popular",
        requiredPlan: "Ultimate"
    },
    {
        id: "call-of-duty-mobile",
        name: "Call of Duty: Mobile",
        category: "Action / FPS",
        price: 99,
        image: "images/games/cod-mobile.jpg",
        description: "Jump into intense multiplayer battles and exciting battle royale action.",
        featured: true,
        status: "Trending",
        requiredPlan: "Ultimate"
    },
    {
        id: "mobile-legends",
        name: "Mobile Legends: Bang Bang",
        category: "MOBA",
        price: 79,
        image: "images/games/mobile-legends.jpg",
        description: "Team up with friends and compete in fast-paced 5v5 MOBA matches.",
        featured: true,
        status: "Best Seller",
        requiredPlan: "Pro"
    },
    {
        id: "pubg-mobile",
        name: "PUBG Mobile",
        category: "Battle Royale",
        price: 99,
        image: "images/games/pubg-mobile.jpg",
        description: "Enter the battlefield, collect equipment, and fight to become the last player standing.",
        featured: true,
        status: "Popular",
        requiredPlan: "Ultimate"
    },
    {
        id: "genshin-impact",
        name: "Genshin Impact",
        category: "Adventure RPG",
        price: 129,
        image: "images/games/genshin-impact.jpg",
        description: "Explore a beautiful fantasy world filled with adventures and discoveries.",
        featured: false,
        status: "Featured",
        requiredPlan: "Ultimate"
    },
    {
        id: "minecraft",
        name: "Minecraft",
        category: "Sandbox",
        price: 99,
        image: "images/games/minecraft.jpg",
        description: "Build, explore, and create your own world with endless possibilities.",
        featured: false,
        status: "Popular",
        requiredPlan: "Pro"
    },
    {
        id: "roblox",
        name: "Roblox",
        category: "Adventure",
        price: 79,
        image: "images/games/roblox.jpg",
        description: "Discover millions of experiences and enjoy games created by the community.",
        featured: false,
        status: "Trending",
        requiredPlan: "Starter"
    },
    {
        id: "league-of-legends",
        name: "League of Legends",
        category: "MOBA",
        price: 99,
        image: "images/games/league-of-legends.jpg",
        description: "Master champions and compete in strategic team-based battles.",
        featured: false,
        status: "Featured",
        requiredPlan: "Ultimate"
    }
];

GAMEHUB.getGameById = function(id) {
    return GAMEHUB.games.find(game => game.id === id) || null;
};

GAMEHUB.getFeaturedGames = function() {
    return GAMEHUB.games.filter(game => game.featured);
};

console.log("GAMEHUB+ Games Catalog Loaded!");
