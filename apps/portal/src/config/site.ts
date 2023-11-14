export type SiteConfig = {
  content: string;
  demoURL: string;
  videoURL: string;
  support: {
    email: string;
    phone: string;
  };
  googleAnalyticsId?: string;
};

const siteConfig: SiteConfig = {
  content: process.env.SITE_CONTENT || '',
  demoURL: process.env.SITE_DEMO || '',
  videoURL: process.env.SITE_VIDEO || '',
  support: {
    email: process.env.SITE_EMAIL || '',
    phone: process.env.SITE_PHONE || '',
  },
  googleAnalyticsId: process.env.SITE_GOOGLE_ANALYTICS_ID,
};

export default siteConfig;
