import BaseApi from "./BaseApi.mjs";

export default class ApiSports extends BaseApi {
    constructor() {
        super("https://v2.nba.api-sports.io", {
            "x-apisports-key": import.meta.env.VITE_API_SPORT_KEY,
        });
    }

    // API-Sports returns status 200 even for errors
    // and lists the problem in an "errors" field instead
    checkForErrors(data) {
        const errors = data.errors;
        const hasErrors = Array.isArray(errors)
            ? errors.length > 0
            : errors && Object.keys(errors).length > 0;

        if (hasErrors) {
            throw new Error(Object.values(errors).join(", "));
        }
    }

    // Used to match balldontlie teams to API-Sports team IDs
    async getTeams() {
        const data = await this.getData("/teams");
        return data.response;
    }

    // Player search
    async searchPlayers(name) {
        const data = await this.getData("/players", { search: name });
        return data.response;
    }

    // Player biography
    async getPlayer(playerId) {
        const data = await this.getData("/players", { id: playerId });
        return data.response[0];
    }

    // Team roster by season
    async getRoster(teamId, season) {
        const data = await this.getData("/players", { team: teamId, season });
        return data.response;
    }

    // Season stats (one entry per game; averages are calculated on the player page)
    async getPlayerStats(playerId, season) {
        const data = await this.getData("/players/statistics", { id: playerId, season });
        return data.response;
    }
}