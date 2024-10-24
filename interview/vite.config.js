// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


//minIO server 

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/minio': {
//         target: 'http://62.146.178.245:9000',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/minio/, '')
//       }
//     }
//   }
// })


//micro frontend working 

// vite.config.js in todo-components
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "todo-components",
      filename: "remoteEntry.js",
      exposes: {
        "./Home": "./src/pages/Home",
        "./StartInterview": "./src/pages/StartInterview",
        "./FetchInterview": "./src/pages/FetchInterview",
      },
      // shared: ["react"],
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});