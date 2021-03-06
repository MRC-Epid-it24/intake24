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
    repo: '',
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
        text: 'Survey',
        link: '/survey/',
      },
      {
        text: 'Admin',
        link: '/admin/',
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: 'Data Dictionary',
        link: '/data-dictionary/',
      },
      {
        text: 'Developer resources',
        link: '/developer/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/MRC-Epid-it24/intake24',
      }
    ],
    sidebar: {
      '/overview/': [
        {
          title: 'Overview',
          collapsable: false,
          children: [
            '',
            'get-started',
          ]
        },
      ],
      '/config/': [
        {
          title: 'Configuration',
          collapsable: false,
          sidebarDepth: 2,
          children: [
            '',
            'api-server',
            'admin',
            'survey',
          ]
        },
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
      '/api/': [
        {
          title: 'Global',
          collapsable: false,
          children: [
            '',
            'authentication'
          ]
        },
        {
          title: 'Admin',
          collapsable: false,
          children: [
            'admin/languages',
            'admin/locales',
            'admin/schemes',
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
              'respondent/survey',
              'respondent/food-lookup',
              'respondent/food-data'
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
            'vm',
            'v3-survey',
            'portion-size',
            'technology-stack',
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
