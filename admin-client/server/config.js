module.exports = {
  env: process.env.NODE_ENV || 'development',
  name: process.env.SERVER_NAME || 'Intake24 Admin App',
  url: process.env.SERVER_URL || 'localhost',
  port: parseInt(process.env.SERVER_PORT || '3100', 10),
  static: process.env.SERVER_STATIC || 'dist',
  api: {
    host: process.env.SERVER_API_HOST || '',
  },
};
