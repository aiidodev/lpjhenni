/**
 * PM2 — na VPS, na pasta do projecto (ex.: /var/www/lpjhenni):
 *   npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 * Reinício: pm2 restart lpjhenni
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
