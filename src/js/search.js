import { loadHeaderFooter } from "./utils.mjs";
import ApiSports from "./ApiSports.mjs";
import PlayerSearch from "./PlayerSearch.mjs";

loadHeaderFooter();

const dataSource = new ApiSports();
const formElement = document.querySelector(".player-form");
const inputElement = document.getElementById("player-search");
const statusElement = document.getElementById("search-status");
const listElement = document.getElementById("search-results");

const playerSearch = new PlayerSearch(dataSource, formElement, inputElement, statusElement, listElement);
playerSearch.init();