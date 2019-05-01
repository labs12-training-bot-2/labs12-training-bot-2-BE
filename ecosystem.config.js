module.exports = {
  apps : [{
    name: 'TrainingBot API',
    script: 'index.js',
    instances: 'max',
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
