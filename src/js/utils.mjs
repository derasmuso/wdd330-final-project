export function renderWithTemplate(template, parentElement, data, callback) {
    parentElement.innerHTML = template;

    if (callback) {
        callback(data);
    }
}

export async function loadTemplate(path) {
    const res = await fetch(path);

    const template = await res.text();

    return template;
}

export async function loadHeaderFooter() {
    const headerTemplate = await loadTemplate("/partials/header.html");
    const footerTemplate = await loadTemplate("/partials/footer.html");
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);

    function setActiveNavLink() {
        const current = window.location.pathname === "/" ? "/index.html" : window.location.pathname;

        document.querySelectorAll(".nav-links a").forEach((link) => {
            if (link.pathname === current) {
                link.classList.add("active");
            }
        });
    }
    setActiveNavLink();

    const navbutton = document.querySelector(".ham-btn");
    const navBar = document.querySelector(".nav-links");

    navbutton.addEventListener("click", () => {
        navbutton.classList.toggle("show");
        navBar.classList.toggle("show");
    });
}

export function getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
    const htmlStrings = list.map(template);
    if (clear) {
        parentElement.innerHTML = "";
    }
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// 2023 = 2023-24
export function formatSeason(season) {
    const nextYear = String(Number(season) + 1).slice(-2);
    return `${season}-${nextYear}`;
}

// formatPercent(9, 20) = 45.0%
export function formatPercent(made, attempted) {
    if (!attempted) {
        return "0.0%";
    }
    return `${((made / attempted) * 100).toFixed(1)}%`;
}

const AVERAGE_STATS = ["points", "totReb", "assists", "steals", "blocks", "turnovers", "min"];
const SHOOTING_STATS = ["fgm", "fga", "tpm", "tpa", "ftm", "fta"];

// Turns game-by-game stats into per-game averages for the season
export function calculateSeasonAverages(games) {
    // Skip games where the player didn't play
    const played = games.filter((game) => parseFloat(game.min) > 0);

    // Add up every stat across all games
    const totals = {};
    played.forEach((game) => {
        [...AVERAGE_STATS, ...SHOOTING_STATS].forEach((stat) => {
            totals[stat] = (totals[stat] || 0) + (parseFloat(game[stat]) || 0);
        });
    });

    // Divide each total by games played
    const averages = { games: played.length };
    AVERAGE_STATS.forEach((stat) => {
        averages[stat] = played.length ? (totals[stat] / played.length).toFixed(1) : "0.0";
    });

    // Shooting percentages come from season totals
    averages.fgPct = formatPercent(totals.fgm, totals.fga);
    averages.tpPct = formatPercent(totals.tpm, totals.tpa);
    averages.ftPct = formatPercent(totals.ftm, totals.fta);

    return averages;
}

// Shows a spinner while data loads
export function showLoading(element, message = "Loading...") {
    element.innerHTML = `
        <div class="loading">
            <span class="spinner"></span>
            <p>${message}</p>
        </div>
    `;
}

// Shows a message when no player is found
export function showMessage(element, message) {
    element.innerHTML = `<p class="message">${message}</p>`;
}

// Shows an error
export function showError(element, message = "Something went wrong. Please try again.") {
    element.innerHTML = `<p class="message-error">${message}</p>`;
}

// retrieve from localStorage
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// save to localStorage
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// remove from localStorage
export function removeLocalStorage(key) {
    localStorage.removeItem(key);
}