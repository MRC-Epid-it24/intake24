import { defineConfig } from 'vitepress';
import { description } from '../../package.json';

export default defineConfig({
  title: 'Intake24',
  description,
  lang: 'en',

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  vite: { server: { port: 8400 } },

  themeConfig: {
    repo: 'MRC-Epid-it24/intake24',
    // logo: '/logo.svg',
    docsDir: 'docs',
    editLinks: false,
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
        text: 'Admin',
        link: '/admin/',
      },
      {
        text: 'Survey',
        link: '/survey/',
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
          text: 'Overview',
          collapsable: false,
          children: [
            {
              text: 'Introduction',
              link: '/overview/',
            },
            {
              text: 'Requirements',
              link: '/overview/requirements',
            },
            {
              text: 'Get started',
              link: '/overview/get-started',
            },
          ],
        },
        // TODO: extract to own section
        {
          text: 'CLI',
          collapsable: false,
          children: [
            {
              text: 'Introduction',
              link: '/overview/cli/',
            },
            {
              text: 'Generate .env files',
              link: '/overview/cli/generate-env',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Configuration',
          collapsable: false,
          children: [
            {
              text: 'Introduction',
              link: '/config/',
            },
          ],
        },
        {
          text: 'API server',
          collapsable: false,
          children: [
            {
              text: 'Application',
              link: '/config/api/application',
            },
            {
              text: 'ACL',
              link: '/config/api/acl',
            },
            {
              text: 'Cache',
              link: '/config/api/cache',
            },
            {
              text: 'Database',
              link: '/config/api/database',
            },
            {
              text: 'Filesystem',
              link: '/config/api/filesystem',
            },
            {
              text: 'Logging',
              link: '/config/api/log',
            },
            {
              text: 'Mail',
              link: '/config/api/mail',
            },
            {
              text: 'Queue',
              link: '/config/api/queue',
            },
            {
              text: 'Rate limiter',
              link: '/config/api/rate-limiter',
            },
            {
              text: 'Security',
              link: '/config/api/security',
            },
            {
              text: 'Services',
              link: '/config/api/services',
            },
            {
              text: 'Session',
              link: '/config/api/session',
            },
          ],
        },
        {
          text: 'Admin client',
          collapsable: false,
          children: [
            {
              text: 'Introduction',
              link: '/config/admin/',
            },
          ],
        },
        {
          text: 'Survey client',
          collapsable: false,
          children: [
            {
              text: 'Introduction',
              link: '/config/survey/',
            },
          ],
        },
      ],
      '/api/': [
        {
          text: 'Global',
          collapsable: false,
          children: [
            {
              text: 'Introduction',
              link: '/api/',
            },
            {
              text: 'Authentication',
              link: '/api/authentication',
            },
            {
              text: 'Password recovery',
              link: '/api/password',
            },
            {
              text: 'Internationalization',
              link: '/api/i18n',
            },
            {
              text: 'Subscriptions',
              link: '/api/subscriptions',
            },
          ],
        },
        {
          text: 'Admin',
          collapsable: false,
          children: [
            {
              text: 'Authentication',
              link: '/api/admin/authentication',
            },
            {
              text: 'User profile',
              link: '/api/admin/user/profile',
            },
            {
              text: 'User jobs',
              link: '/api/admin/user/jobs',
            },
            {
              text: 'Food groups',
              link: '/api/admin/food-groups',
            },
            {
              text: 'As served sets',
              link: '/api/admin/images/as-served-sets',
            },
            {
              text: 'As served images',
              link: '/api/admin/images/as-served-images',
            },
            {
              text: 'Guide images',
              link: '/api/admin/images/guides',
            },
            {
              text: 'Image maps',
              link: '/api/admin/images/maps',
            },
            {
              text: 'Jobs',
              link: '/api/admin/jobs',
            },
            {
              text: 'Languages',
              link: '/api/admin/languages',
            },
            {
              text: 'Locales',
              link: '/api/admin/locales',
            },
            {
              text: 'Nutrient tables',
              link: '/api/admin/nutrient-tables',
            },
            {
              text: 'Feedback schemes',
              link: '/api/admin/feedback-schemes',
            },
            {
              text: 'Permissions',
              link: '/api/admin/permissions',
            },
            {
              text: 'Roles',
              link: '/api/admin/roles',
            },
            {
              text: 'Securables',
              link: '/api/admin/securables',
            },
            {
              text: 'Sign-in logs',
              link: '/api/admin/sign-in-logs',
            },
            {
              text: 'Survey schemes',
              link: '/api/admin/survey-schemes',
            },
            {
              text: 'Survey scheme questions',
              link: '/api/admin/survey-scheme-questions',
            },
            {
              text: 'Surveys',
              link: '/api/admin/surveys/surveys',
            },
            {
              text: 'Survey respondents',
              link: '/api/admin/surveys/respondents',
            },
            {
              text: 'Survey submissions',
              link: '/api/admin/surveys/submissions',
            },
            {
              text: 'Survey data export',
              link: '/api/admin/surveys/data-export',
            },
            {
              text: 'Tasks',
              link: '/api/admin/tasks',
            },
            {
              text: 'Users',
              link: '/api/admin/users',
            },
          ],
        },
        {
          text: 'Survey',
          collapsable: false,
          children: [
            {
              text: 'Authentication',
              link: '/api/survey/authentication',
            },
            {
              text: 'Surveys - public',
              link: '/api/survey/surveys-public',
            },
            {
              text: 'Surveys - respondent',
              link: '/api/survey/surveys-respondent',
            },
            {
              text: 'Food database lookup',
              link: '/api/survey/food-lookup',
            },
            {
              text: 'Portion size data',
              link: '/api/survey/food-data',
            },
            {
              text: 'Feedback',
              link: '/api/survey/feedback',
            },
            {
              text: 'User',
              link: '/api/survey/user',
            },
          ],
        },
      ],
      '/admin/': [
        {
          text: 'Admin',
          collapsable: false,
          children: [
            {
              text: 'Introduction',
              link: '/admin/',
            },
            {
              text: 'Nutritionist dictionary',
              link: '/admin/nutritionist-dictionary',
            },
          ],
        },
        {
          text: 'Localization',
          children: [
            {
              text: 'Languages',
              link: '/admin/localization/languages',
            },
            {
              text: 'Locales',
              link: '/admin/localization/locales',
            },
          ],
        },
        {
          text: 'Images',
          children: [
            {
              text: 'Introduction',
              link: '/admin/images/',
            },
            {
              text: 'As served sets',
              link: '/admin/images/as-served-sets',
            },
            {
              text: 'Image maps',
              link: '/admin/images/image-maps',
            },
            {
              text: 'Guide images',
              link: '/admin/images/guide-images',
            },
          ],
        },
        {
          text: 'Surveys MGMT',
          children: [
            {
              text: 'Feedback schemes',
              link: '/admin/surveys/feedback-schemes',
            },
            {
              text: 'Survey schemes',
              link: '/admin/surveys/survey-schemes',
            },
            {
              text: 'Survey scheme questions',
              link: '/admin/surveys/survey-scheme-questions',
            },
            {
              text: 'Surveys',
              link: '/admin/surveys/',
            },
          ],
        },
        {
          text: 'Access control list',
          children: [
            {
              text: 'Introduction',
              link: '/admin/acl/',
            },
            {
              text: 'Resources',
              link: '/admin/acl/resources',
            },
            {
              text: 'Securables',
              link: '/admin/acl/securables',
            },
            {
              text: 'Permissions',
              link: '/admin/acl/permissions',
            },
            {
              text: 'Roles',
              link: '/admin/acl/roles',
            },
            {
              text: 'Users',
              link: '/admin/acl/users',
            },
          ],
        },
        {
          text: 'System',
          children: [
            {
              text: 'Job types',
              link: '/admin/system/job-types',
            },
            {
              text: 'Jobs',
              link: '/admin/system/jobs',
            },
            {
              text: 'Sign-in logs',
              link: '/admin/system/sign-in-logs',
            },
            {
              text: 'Tasks',
              link: '/admin/system/tasks',
            },
          ],
        },
      ],
      '/survey/': [
        {
          text: 'Survey',
          children: [
            {
              text: 'Introduction',
              link: '/survey/',
            },
          ],
        },
      ],
      '/deployment/': [
        {
          text: 'Deployment',
          children: [
            {
              text: 'Introduction',
              link: '/deployment/',
            },
          ],
        },
      ],
      '/data-dictionary/': [
        {
          text: 'Data Dictionary',
          children: [
            {
              text: 'Introduction',
              link: '/data-dictionary/',
            },
            {
              text: 'Survey',
              link: '/data-dictionary/survey',
            },
            {
              text: 'Admin',
              link: '/data-dictionary/admin',
            },
          ],
        },
      ],
      '/developer/': [
        {
          text: 'Developer resources',
          children: [
            {
              text: 'Introduction',
              link: '/developer/',
            },
            {
              text: 'Source code',
              link: '/developer/source-code',
            },
            {
              text: 'Getting started',
              link: '/developer/getting-started',
            },
            {
              text: 'Technology Stack',
              link: '/developer/technology-stack',
            },
            {
              text: 'Testing',
              link: '/developer/testing',
            },
            {
              text: 'Development virtual machine',
              link: '/developer/vm',
            },
            {
              text: 'Version 3 recall model',
              link: '/developer/v3-survey',
            },
            {
              text: 'Portion size methods',
              link: '/developer/portion-size',
            },
          ],
        },
      ],
    },
  },
});
