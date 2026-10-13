import {
    showLoading,
    showMessage,
    showError,
    calculateSeasonAverages,
    formatSeason,
    renderSeasonOptions,
    setSeasonParam,
    SEASONS,
} from "./utils.mjs";
import { setupFavoriteButton } from "./favoriteStorage.mjs";

const STAT_COLUMNS = [
    { key: "games", label: "GP", title: "Games played" },
    { key: "min", label: "MIN", title: "Minutes per game" },
    { key: "points", label: "PTS", title: "Points per game" },
    { key: "totReb", label: "REB", title: "Rebounds per game" },
    { key: "assists", label: "AST", title: "Assists per game" },
    { key: "steals", label: "STL", title: "Steals per game" },
    { key: "blocks", label: "BLK", title: "Blocks per game" },
    { key: "turnovers", label: "TOV", title: "Turnovers per game" },
    { key: "fgPct", label: "FG%", title: "Field goal percentage" },
    { key: "tpPct", label: "3P%", title: "Three-point percentage" },
    { key: "ftPct", label: "FT%", title: "Free throw percentage" },
];

// Formatted players height 
function formatHeight(height) {
    return height?.feets ? `${height.feets}'${height.inches || 0}"` : "N/A";
}

// Formatted players birthday
function formatBirthDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

// Player bio
function playerDetailsTemplate(player) {
    const standard = player.leagues?.standard;
    return `
        <div><dt>Position</dt><dd>${standard?.pos || "N/A"}</dd></div>
        <div><dt>Jersey</dt><dd>${standard?.jersey ? `#${standard.jersey}` : "N/A"}</dd></div>
        <div><dt>Height</dt><dd>${formatHeight(player.height)}</dd></div>
        <div><dt>Weight</dt><dd>${player.weight?.pounds ? `${player.weight.pounds} lbs` : "N/A"}</dd></div>
        <div><dt>Born</dt><dd>${formatBirthDate(player.birth?.date)}</dd></div>
        <div><dt>Country</dt><dd>${player.birth?.country || "N/A"}</dd></div>
        <div><dt>College</dt><dd>${player.college || "N/A"}</dd></div>
        `;
}

function statsTableTemplate(averages, season) {
    return `
        <div class="table-wrapper">
            <table class="stats-table">
                <caption>Per-game averages for the ${formatSeason(season)} season</caption>
                <thead>
                    <tr>
                        ${STAT_COLUMNS.map((column) => `<th scope="col"><abbr title="${column.title}">${column.label}</abbr></th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ${STAT_COLUMNS.map((column) => `<td>${averages[column.key]}</td>`).join("")}
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

export default class PlayerDetails {
    constructor(playerId, season, dataSource) {
        this.playerId = playerId;
        this.season = season;
        this.dataSource = dataSource;
        this.player = {};
    }

    async init() {
        const playerStatus = document.querySelector("#player-status");

        if (!this.playerId) {
            showMessage(playerStatus, "No player selected. Search for a player to see their profile.");
            return;
        }

        showLoading(playerStatus, "Loading player...");

        try {
            this.player = await this.dataSource.getPlayer(this.playerId);
        } catch (error) {
            showError(playerStatus, `Couldn't load this player. ${error.message}`);
            return;
        }

        if (!this.player) {
            showMessage(playerStatus, "Player not found. Search for a player to see their profile.");
            return;
        }

        playerStatus.innerHTML = "";
        this.renderPlayerDetails();
        this.setupSeasonSelect();
        this.loadStats();
    }

    renderPlayerDetails() {
        const name = `${this.player.firstname} ${this.player.lastname}`;

        document.title = `${name} | The Stats Sheet`;
        document.querySelector(".player-name").textContent = name;
        document.querySelector(".player-details").innerHTML = playerDetailsTemplate(this.player);
        document.querySelector(".player-stats").hidden = false;
        setupFavoriteButton(document.querySelector("#favorite-btn"), "player", this.player);
    }

    setupSeasonSelect() {
        const select = document.querySelector("#season-select");
        renderSeasonOptions(select, SEASONS, this.season);
        select.addEventListener("change", this.changeSeason.bind(this));
    }

    changeSeason(event) {
        this.season = Number(event.target.value);
        setSeasonParam(this.season);
        this.loadStats();
    }

    async loadStats() {
        const statsStatus = document.querySelector("#stats-status");
        const statsTable = document.querySelector("#stats-table");

        statsTable.innerHTML = "";
        showLoading(statsStatus, "Loading stats...");

        try {
            const games = await this.dataSource.getPlayerStats(this.playerId, this.season);
            const averages = calculateSeasonAverages(games);

            if (averages.games === 0) {
                showMessage(statsStatus, `No stats for the ${formatSeason(this.season)} season. This player may not have played that year.`);
                return;
            }

            statsStatus.innerHTML = "";
            statsTable.innerHTML = statsTableTemplate(averages, this.season);
        } catch (error) {
            showError(statsStatus, `Couldn't load stats. ${error.message}`);
        }
    }
}
