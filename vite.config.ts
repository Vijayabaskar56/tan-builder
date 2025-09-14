import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
    }),
    viteReact(),
    devtools({
     enhancedLogs : {
      enabled : true,
     },
     editor : {
      name: 'VSCode',
       open: async (path, lineNumber, columnNumber) => {
         const { exec } = await import('node:child_process')
         exec(
           // or windsurf/cursor/webstorm
           `code -g "${(path).replaceAll('$', '\\$')}${lineNumber ? `:${lineNumber}` : ''}${columnNumber ? `:${columnNumber}` : ''}"`,
         )
       },
     }
    }),
  ],
});

export default config;
