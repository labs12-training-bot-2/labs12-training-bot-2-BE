module.exports = {
  apps : [{
    name: "Training Bot API",
    script: "index.js",
    instances: "max",
    exec_mode: "cluster",
    autorestart: true,
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  },
  {
    name: "Training Bot Notification Job",
    script: "./jobs/notifications/index.js",
    watch: true,
    instances: 1,
    autorestart: true
  }]
};
