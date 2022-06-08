module.exports = {
  apps: [
    {
      name: 'API',
      script: './dist/server.cjs',
      instances: 2,
      exec_mode: 'cluster',
    },
  ],
};
