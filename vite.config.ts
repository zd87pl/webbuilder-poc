import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";
  
  return {
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: isDevelopment,
      minify: isDevelopment ? false : "esbuild",
      cssMinify: !isDevelopment,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@mantine/core', '@mantine/hooks'],
          },
        },
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    esbuild: {
      jsx: "automatic",
      jsxImportSource: "react"
    },
    plugins: [
      react(),
      svgr({ include: ["src/**/*.svg", "./**/*.svg"] }),
      viteStaticCopy({
        targets: [
          { src: "./public/*", dest: "." },
          { src: "./assets/*", dest: "assets" },
          {
            src: "./public/assets/{*,}",
            dest: "assets",
          },
          { src: "src/assets/*", dest: "assets" },
        ],
        silent: true,
      }),
      tsconfigPaths(),
    ],
    resolve: {},
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      host: '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
      allowedHosts: ['all'],
    },
  };
});
