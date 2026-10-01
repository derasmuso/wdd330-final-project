import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: "src",
    envDir: "../",          // .env is in the project root, not src/
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                search: resolve(__dirname, "src/pages/search.html"),
                player: resolve(__dirname, "src/pages/player.html"),
                directory: resolve(__dirname, "src/pages/directory.html"),
                team: resolve(__dirname, "src/pages/team.html"),
                favorites: resolve(__dirname, "src/pages/favorites.html"),
            },
        },
    },
});