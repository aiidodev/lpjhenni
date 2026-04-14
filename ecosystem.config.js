/**
 * Cópia em .js para PM2 (`pm2 start` sem argumentos procura ecosystem.config.js).
 * Conteúdo igual a ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: "lpjhenni",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start --hostname 0.0.0.0 --port 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
