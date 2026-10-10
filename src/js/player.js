import { loadHeaderFooter, getParam, getSeasonParam, SEASONS } from "./utils.mjs";
import ApiSports from "./ApiSports.mjs";
import PlayerDetails from "./PlayerDetails.mjs";

loadHeaderFooter();

const dataSource = new ApiSports();
const playerId = getParam("id");
const season = getSeasonParam(SEASONS);

const player = new PlayerDetails(playerId, season, dataSource);
player.init();