import { renderListWithTemplate, showLoading, showMessage, showError } from "./utils.mjs";
import { playerCardTemplate } from "./cards.mjs";

export default class PlayerSearch {
    constructor(dataSource, formElement, inputElement, statusElement, listElement) {
        this.dataSource = dataSource;
        this.formElement = formElement;
        this.inputElement = inputElement;
        this.statusElement = statusElement;
        this.listElement = listElement;
    }

    init() {
        this.formElement.addEventListener("submit", this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();

        const lastName = this.inputElement.value.trim();

        // Don't use an API request on an empty search
        if (!lastName) {
            return;
        }

        this.search(lastName);
    }

    async search(lastName) {
        this.listElement.innerHTML = "";
        showLoading(this.statusElement, "Searching players...");

        try {
            const playerResults = await this.dataSource.searchPlayers(lastName);
            const players = playerResults.filter((player) => player.leagues?.standard?.pos);

            if (players.length === 0) {
                showMessage(this.statusElement, "No players found with that last name. Check the spelling and try again.");
                return;
            }

            this.statusElement.innerHTML = "";
            renderListWithTemplate(playerCardTemplate, this.listElement, players, "afterbegin", true);
        } catch (error) {
            showError(this.statusElement, `Couldn't load search results. ${error.message}`);
        }
    }
}