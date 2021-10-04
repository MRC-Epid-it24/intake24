module.exports = {
  env: process.env.NODE_ENV || 'development',
  name: process.env.SERVER_NAME || 'Intake24 Survey App',
  url: process.env.SERVER_URL || 'localhost',
  port: parseInt(process.env.SERVER_PORT || '3300', 10),
  static: process.env.SERVER_STATIC || 'dist',
  api: {
    host: process.env.SERVER_API_HOST || '',
  },
  app: {
    namespace: process.env.SERVER_APP_NAMESPACE || '',
    static: process.env.SERVER_APP_STATIC || 'dist',
  },
  site: {
    enable: process.env.SERVER_SITE_ENABLED === 'true',
    content: process.env.SERVER_SITE_CONTENT || '',
    demoURL: `${process.env.SERVER_APP_NAMESPACE}/demo?genUser`,
    videoURL: process.env.SERVER_SITE_VIDEO || '',
    support: {
      email: '',
      phone: '',
    },
  },
};
