module.exports = {
  apps: [
    {
      name: 'API',
      script: './dist/server.js',
      instances: 2,
      exec_mode: 'cluster',
    },
  ],
};
