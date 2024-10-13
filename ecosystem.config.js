module.exports = {
  apps: [
    {
      name: "sme-be-app",
      exec_mode: 'cluster',
      instances: 'max',
      script: "ts-node",
      args: "--transpile-only app.ts",
      watch: true,
    },
  ],
};
