import { loadHeaderFooter } from "./utils.mjs";
import { playerCardTemplate, teamCardTemplate } from "./cards.mjs";
import FavoritesList from "./FavoritesList.mjs";

loadHeaderFooter();

const playerFavorites = new FavoritesList(
    "player",
    playerCardTemplate,
    document.getElementById("player-favorites"),
    document.getElementById("player-favorites-status"),
    "You haven't saved any players yet. Search for a player and select Add to Favorites.",
);

const teamFavorites = new FavoritesList(
    "team",
    teamCardTemplate,
    document.getElementById("team-favorites"),
    document.getElementById("team-favorites-status"),
    "You haven't saved any teams yet. Browse the team directory and select Add to Favorites.",
);

playerFavorites.init();
teamFavorites.init();