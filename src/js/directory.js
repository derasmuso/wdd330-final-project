import { loadHeaderFooter } from "./utils.mjs";
import BallDontLie from "./BallDontLie.mjs";
import ApiSports from "./ApiSports.mjs";
import TeamList from "./TeamList.mjs";

loadHeaderFooter();

const dataSource = new BallDontLie();
const logoSource = new ApiSports();
const eastElement = document.getElementById("east");
const westElement = document.getElementById("west");
const statusElement = document.getElementById("directory-status");

const teamList = new TeamList(dataSource, logoSource, eastElement, westElement, statusElement);
teamList.init();