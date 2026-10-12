import { loadHeaderFooter, getParam, getSeasonParam, SEASONS } from "./utils.mjs";
import BallDontLie from "./BallDontLie.mjs";
import ApiSports from "./ApiSports.mjs";
import TeamDetails from "./TeamDetails.mjs";

loadHeaderFooter();

const teamSource = new BallDontLie();
const playerSource = new ApiSports();
const teamId = getParam("id");
const season = getSeasonParam(SEASONS);

const team = new TeamDetails(teamId, season, teamSource, playerSource);
team.init();