import {
    renderListWithTemplate,
    showLoading,
    showMessage,
    showError,
    formatSeason,
    renderSeasonOptions,
    setSeasonParam,
    SEASONS,
} from "./utils.mjs";
import { playerCardTemplate } from "./cards.mjs";

// balldontlie uses "East" / "West"
const CONFERENCE_NAMES = { East: "Eastern", West: "Western" };

// Team information
function teamDetailsTemplate(team) {
    return `
        <div><dt>City</dt><dd>${team.city || "N/A"}</dd></div>
        <div><dt>Conference</dt><dd>${CONFERENCE_NAMES[team.conference] || "N/A"}</dd></div>
        <div><dt>Division</dt><dd>${team.division || "N/A"}</dd></div>
        `;
}

export default class TeamDetails {
    constructor(teamId, season, teamSource, playerSource) {
        this.teamId = teamId;
        this.season = season;
        this.teamSource = teamSource;
        this.playerSource = playerSource;
        this.team = {};
        this.sportsTeam = null;
    }

    async init() {
        const teamStatus = document.querySelector("#team-status");

        if (!this.teamId) {
            showMessage(teamStatus, "No team selected. Browse the team directory to choose a team.");
            return;
        }

        showLoading(teamStatus, "Loading team...");

        // Team information
        try {
            this.team = await this.teamSource.getTeam(this.teamId);
        } catch (error) {
            showError(teamStatus, `Couldn't load this team. ${error.message}`);
            return;
        }

        teamStatus.innerHTML = "";
        this.renderTeamDetails();

        // Find the team to get its logo and roster
        const rosterStatus = document.querySelector("#roster-status");
        document.querySelector(".team-roster").hidden = false;
        showLoading(rosterStatus, "Loading roster...");

        try {
            const sportsTeams = await this.playerSource.getTeams();
            this.sportsTeam = sportsTeams.find((sportsTeam) => sportsTeam.name === this.team.full_name);
        } catch (error) {
            showError(rosterStatus, `Couldn't load the roster. ${error.message}`);
            return;
        }

        if (!this.sportsTeam) {
            showMessage(rosterStatus, "A roster isn't available for this team.");
            return;
        }

        this.renderLogo();
        this.setupSeasonSelect();
        this.loadRoster();
    }

    renderTeamDetails() {
        document.title = `${this.team.full_name} | The Stats Sheet`;
        document.querySelector(".team-name").textContent = this.team.full_name;
        document.querySelector(".team-details").innerHTML = teamDetailsTemplate(this.team);
    }

    renderLogo() {
        const logo = document.querySelector(".team-page-logo");

        // Show The Stats Sheet logo if the team's logo fails
        logo.onerror = () => {
            logo.onerror = null;
            logo.src = "/images/logo.png";
        };
        logo.src = this.sportsTeam.logo || "/images/logo.png";
        logo.hidden = false;
    }

    setupSeasonSelect() {
        const select = document.querySelector("#season-select");
        renderSeasonOptions(select, SEASONS, this.season);
        select.addEventListener("change", this.changeSeason.bind(this));
    }

    changeSeason(event) {
        this.season = Number(event.target.value);
        setSeasonParam(this.season);
        this.loadRoster();
    }

    async loadRoster() {
        const rosterStatus = document.querySelector("#roster-status");
        const rosterList = document.querySelector("#roster-list");

        rosterList.innerHTML = "";
        showLoading(rosterStatus, `Loading the ${formatSeason(this.season)} roster...`);

        try {
            const roster = await this.playerSource.getRoster(this.sportsTeam.id, this.season);
            const players = roster.filter((player) => player.leagues?.standard?.pos);

            if (players.length === 0) {
                showMessage(rosterStatus, `No roster found for the ${formatSeason(this.season)} season.`);
                return;
            }

            rosterStatus.innerHTML = "";
            renderListWithTemplate(playerCardTemplate, rosterList, players, "afterbegin", true);
        } catch (error) {
            showError(rosterStatus, `Couldn't load the roster. ${error.message}`);
        }
    }
}