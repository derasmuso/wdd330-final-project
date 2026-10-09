// Player card
export function playerCardTemplate(player) {
    const position = player.leagues?.standard?.pos || "N/A";
    const jersey = player.leagues?.standard?.jersey;

    return `
        <li class="card player-card">
            <a href="/pages/player.html?id=${player.id}">
                <h3>${player.firstname} ${player.lastname}</h3>
                <p class="card-detail">${position}${jersey ? ` · #${jersey}` : ""}</p>
                <p class="card-detail">${player.college || "No college listed"}</p>
            </a>
        </li>
    `;
}

// Team card
export function teamCardTemplate(team) {
    return `
        <li class="card team-card">
            <a href="/pages/team.html?id=${team.id}">
                <img src="${team.logo || "/images/logo.png"}" alt="" class="team-logo" loading="lazy" onerror="this.onerror=null; this.src='/images/logo.png';">
                <h3>${team.full_name}</h3>
                <p class="card-detail">${team.division} Division</p>
            </a>
        </li>
    `;
}