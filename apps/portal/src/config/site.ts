export type SiteConfig = {
  content: string;
  demoURL: string;
  videoURL: string;
  support: {
    email: string;
    phone: string;
  };
};

const siteConfig: SiteConfig = {
  content: process.env.SERVER_SITE_CONTENT || '',
  demoURL: `${process.env.SERVER_APP_NAMESPACE}/demo?genUser`,
  videoURL: process.env.SERVER_SITE_VIDEO || '',
  support: {
    email: '',
    phone: '',
  },
};

export default siteConfig;
