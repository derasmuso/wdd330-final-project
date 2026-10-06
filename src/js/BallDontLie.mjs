import BaseApi from "./BaseApi.mjs";

export default class BallDontLie extends BaseApi {
    constructor() {
        super("https://api.balldontlie.io/v1", {
            Authorization: import.meta.env.VITE_BALLDONTLIE_KEY,
        });
    }

    // Team directory
    async getTeams() {
        const data = await this.getData("/teams");
        return data.data;
    }

    // Team information
    async getTeam(teamId) {
        const data = await this.getData(`/teams/${teamId}`);
        return data.data;
    }
}