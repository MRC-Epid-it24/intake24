require('dotenv').config();
const { description } = require('../../package')

module.exports = {

  base: process.env.BASE_URL || '/',

  dest: process.env.OUTPUT_DIR || 'dist',

  port: 8300,

  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Intake24 NG Documentation',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'MRC-Epid-it24/intake24',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Overview',
        link: '/overview/',
      },
      {
        text: 'Configuration',
        link: '/config/',
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: 'Survey',
        link: '/survey/',
      },
      {
        text: 'Admin',
        link: '/admin/',
      },
      {
        text: 'Data Dictionary',
        link: '/data-dictionary/',
      },
      {
        text: 'Developer resources',
        link: '/developer/',
      },
    ],
    sidebar: {
      '/overview/': [
        {
          title: 'Overview',
          collapsable: false,
          children: [
            '',
            'requirements',
            'installation',
          ]
        },
      ],
      '/config/': [
        {
          title: 'Configuration',
          collapsable: false,
          children: [
            '',
          ]
        },
        {
          title: 'API server',
          collapsable: false,
          children: [
            'api-server/application',
            'api-server/acl',
            'api-server/cache',
            'api-server/database',
            'api-server/filesystem',
            'api-server/log',
            'api-server/mail',
            'api-server/queue',
            'api-server/security',
            'api-server/services',
          ]
        },
        {
          title: 'Admin client',
          collapsable: false,
          children: [
            'admin/global',
          ]
        },
        {
          title: 'Survey client',
          collapsable: false,
          children: [
            'survey/global',
          ]
        },
      ],
      '/deployment/': [
        {
          title: 'Deployment',
          collapsable: false,
          children: [
            '',
          ]
        },
      ],
      '/api/': [
        {
          title: 'Global',
          collapsable: false,
          children: [
            '',
            'authentication',
            'subscriptions'
          ]
        },
        {
          title: 'Admin',
          collapsable: false,
          children: [
            'admin/user/profile',
            'admin/user/jobs',
            'admin/images/as-served-sets',
            'admin/images/as-served-images',
            'admin/images/guides',
            'admin/images/maps',
            'admin/jobs',
            'admin/languages',
            'admin/locales',
            'admin/nutrient-tables',
            'admin/schemes',
            'admin/scheme-questions',
            'admin/sign-in-logs',
            'admin/surveys',
            'admin/tasks',
            'admin/users',
            'admin/roles',
            'admin/permissions',
          ]
        },
        {
          title: 'Respondent',
          collapsable: false,
          children: [
              'respondent/surveys-public',
              'respondent/surveys-respondent',
              'respondent/food-lookup',
              'respondent/food-data'
          ]
        }
      ],
      '/survey/': [
        {
          title: 'Survey',
          collapsable: false,
          children: [
            ''
          ]
        }
      ],
      '/admin/': [
        {
          title: 'Admin',
          collapsable: false,
          children: [
            '',
            'nutritionist-dictionary',
          ]
        }
      ],
      '/data-dictionary/': [
        {
          title: 'Data Dictionary',
          collapsable: false,
          children: [
            '',
            'survey',
            'admin'
          ]
        }
      ],
      '/developer/': [
        {
          title: 'Developer resources',
          collapsable: false,
          children: [
            '',
            'getting-started',
            'technology-stack',
            'testing',
            'vm',
            'v3-survey',
            'portion-size',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
