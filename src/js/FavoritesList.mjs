import { renderListWithTemplate, showMessage } from "./utils.mjs";
import { getFavorites, removeFavorite } from "./favoriteStorage.mjs";

export default class FavoritesList {
    constructor(type, cardTemplate, listElement, statusElement, emptyMessage) {
        this.type = type;
        this.cardTemplate = cardTemplate;
        this.listElement = listElement;
        this.statusElement = statusElement;
        this.emptyMessage = emptyMessage;
    }

    init() {
        this.render();
        this.listElement.addEventListener("click", this.handleRemove.bind(this));
    }

    // Adds the Remove button
    favoriteCardTemplate(item) {
        const removeButton = `<button class="remove-btn" data-id="${item.id}">Remove</button>`;
        return this.cardTemplate(item).replace("</li>", `${removeButton}</li>`);
    }

    render() {
        const favorites = getFavorites(this.type);

        if (favorites.length === 0) {
            this.listElement.innerHTML = "";
            showMessage(this.statusElement, this.emptyMessage);
            return;
        }

        this.statusElement.innerHTML = "";
        renderListWithTemplate((item) => this.favoriteCardTemplate(item), this.listElement, favorites, "afterbegin", true);
    }

    handleRemove(event) {
        const button = event.target.closest(".remove-btn");

        if (!button) {
            return;
        }

        removeFavorite(this.type, button.dataset.id);
        this.render();
    }
}