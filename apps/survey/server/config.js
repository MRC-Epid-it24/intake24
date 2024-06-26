export default {
  env: process.env.NODE_ENV || 'development',
  name: process.env.SERVER_NAME || 'Intake24 Survey',
  url: process.env.SERVER_URL || 'localhost',
  port: Number.parseInt(process.env.SERVER_PORT || '3300', 10),
  static: process.env.SERVER_STATIC || 'dist',
  api: {
    host: process.env.SERVER_API_HOST || '',
    cdn: process.env.SERVER_IMG_CDN || '',
  },
};
