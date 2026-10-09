import { renderListWithTemplate, showLoading, showError } from "./utils.mjs";
import { teamCardTemplate } from "./cards.mjs";

export default class TeamList {
    constructor(dataSource, logoSource, eastElement, westElement, statusElement) {
        this.dataSource = dataSource;
        this.logoSource = logoSource;
        this.eastElement = eastElement;
        this.westElement = westElement;
        this.statusElement = statusElement;
    }

    async init() {
        showLoading(this.statusElement, "Loading teams...");
        try {
            const teams = await this.dataSource.getTeams();
            const teamsLogos = await this.addLogos(teams);
            const eastTeams = teamsLogos.filter(team => team.conference === "East");
            const westTeams = teamsLogos.filter(team => team.conference === "West");

            this.statusElement.innerHTML = "";
            this.renderTeams(eastTeams, this.eastElement);
            this.renderTeams(westTeams, this.westElement);
        } catch (error) {
            showError(this.statusElement, `Couldn't load teams. Please try again later. ${error.message}`);
        }
    }

    async addLogos(teams) {
        try {
            const logoTeams = await this.logoSource.getTeams();

            return teams.map((team) => {
                const match = logoTeams.find((logoTeam) => logoTeam.name === team.full_name);
                return { ...team, logo: match?.logo };
            });
        } catch {
            // Shows the teams without the logo if the API fails
            return teams;
        }
    }

    renderTeams(teams, element) {
        renderListWithTemplate(teamCardTemplate, element, teams, "afterbegin", true);
    }
}