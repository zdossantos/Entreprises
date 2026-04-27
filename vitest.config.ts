import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./tests/js/setup.ts"],
        include: ["tests/js/**/*.{test,spec}.{js,ts}"],
        exclude: ["vendor/**", "node_modules/**"],
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./resources/js", import.meta.url)),
        },
    },
});
