import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// keys for player and team
const FAVORITE_KEYS = {
    player: "favoritePlayers",
    team: "favoriteTeams",
};

// List all saved favorites
export function getFavorites(type) {
    return getLocalStorage(FAVORITE_KEYS[type]) || [];
}

// Check if a team or player is already saved
export function isFavorite(type, id) {
    return getFavorites(type).some((item) => String(item.id) === String(id));
}

// Add a player or team
export function addFavorite(type, item) {
    if (isFavorite(type, item.id)) {
        return;
    }

    const favorites = getFavorites(type);
    favorites.push(item);
    setLocalStorage(FAVORITE_KEYS[type], favorites);
}

// Remove a player or team
export function removeFavorite(type, id) {
    const favorites = getFavorites(type).filter((item) => String(item.id) !== String(id));
    setLocalStorage(FAVORITE_KEYS[type], favorites);
}

// Button that adds or removes a player or team
export function setupFavoriteButton(button, type, item) {
    function updateButton() {
        const saved = isFavorite(type, item.id);
        button.textContent = saved ? "★ Remove from Favorites" : "☆ Add to Favorites";
        button.classList.toggle("is-favorite", saved);
    }

    button.addEventListener("click", () => {
        if (isFavorite(type, item.id)) {
            removeFavorite(type, item.id);
        } else {
            addFavorite(type, item);
        }
        updateButton();
    });

    updateButton();
    button.hidden = false;
}