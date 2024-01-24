export const sidebar = {
  '/overview/': [
    {
      text: 'Overview',
      collapsable: false,
      items: [
        {
          text: 'Introduction',
          link: '/overview/',
        },
        {
          text: 'Requirements',
          link: '/overview/requirements',
        },
        {
          text: 'Source code',
          link: '/overview/source-code',
        },
        {
          text: 'Versioning',
          link: '/overview/versioning',
        },
        {
          text: 'Releases',
          link: '/overview/releases',
        },
        {
          text: 'Technology Stack',
          link: '/overview/technology-stack',
        },
        {
          text: 'Get started',
          link: '/overview/get-started',
        },
        {
          text: 'Database',
          link: '/overview/database',
        },
      ],
    },
  ],
  '/guides/': [
    {
      text: 'Guides',
      collapsable: false,
      items: [
        {
          text: 'Introduction',
          link: '/guides/',
        },
        {
          text: 'Integrations',
          link: '/guides/integrations',
        },
      ],
    },
  ],
  '/config/': [
    {
      text: 'Configuration',
      collapsable: false,
      items: [
        {
          text: 'Introduction',
          link: '/config/',
        },
      ],
    },
    {
      text: 'API server',
      collapsable: false,
      items: [
        {
          text: 'Introduction',
          link: '/config/api/',
        },
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
      items: [
        {
          text: 'Introduction',
          link: '/config/admin/',
        },
      ],
    },
    {
      text: 'Survey client',
      collapsable: false,
      items: [
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
      items: [
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
      items: [
        {
          text: 'Authentication',
          link: '/api/admin/authentication',
        },
        {
          text: 'Sign-up',
          link: '/api/admin/signup',
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
          text: 'Personal access tokens',
          link: '/api/admin/user/personal-access-tokens',
        },
        {
          text: 'Food databases',
          link: '/api/admin/fdbs',
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
          text: 'Drinkware sets',
          link: '/api/admin/images/drinkware-sets',
        },
        {
          text: 'Guide images',
          link: '/api/admin/images/guide-images',
        },
        {
          text: 'Image maps',
          link: '/api/admin/images/image-maps',
        },
        {
          text: 'Feedback schemes',
          link: '/api/admin/feedback-schemes',
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
          text: 'Nutrient types',
          link: '/api/admin/nutrient-types',
        },
        {
          text: 'Nutrient units',
          link: '/api/admin/nutrient-units',
        },
        {
          text: 'Permissions',
          link: '/api/admin/permissions',
        },
        {
          text: 'References',
          link: '/api/admin/references',
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
          text: 'Standard units',
          link: '/api/admin/standard-units',
        },
        {
          text: 'Survey schemes',
          link: '/api/admin/survey-schemes',
        },
        {
          text: 'Survey scheme prompts',
          link: '/api/admin/survey-scheme-prompts',
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
      items: [
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
          text: 'Food data',
          link: '/api/survey/food-data',
        },
        {
          text: 'Portion size data',
          link: '/api/survey/portion-sizes',
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
      items: [
        {
          text: 'Introduction',
          link: '/admin/',
        },
        {
          text: 'Profile',
          link: '/admin/user/profile',
        },
        {
          text: 'Personal access tokens',
          link: '/admin/user/personal-access-tokens',
        },
      ],
    },
    {
      text: 'Foods',
      items: [
        {
          text: 'Food databases',
          link: '/admin/foods/fdbs',
        },
        {
          text: 'Food groups',
          link: '/admin/foods/food-groups',
        },
        {
          text: 'Nutrient tables',
          link: '/admin/foods/nutrient-tables',
        },
        {
          text: 'Nutrient types',
          link: '/admin/foods/nutrient-types',
        },
        {
          text: 'Nutrient units',
          link: '/admin/foods/nutrient-units',
        },
        {
          text: 'Standard units',
          link: '/admin/foods/standard-units',
        },
      ],
    },
    {
      text: 'Localization',
      items: [
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
      items: [
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
        {
          text: 'Drinkware sets',
          link: '/admin/images/drinkware-sets',
        },
      ],
    },
    {
      text: 'Feedback',
      items: [
        {
          text: 'Schemes',
          link: '/admin/feedback/schemes',
        },
      ],
    },
    {
      text: 'Surveys MGMT',
      items: [
        {
          text: 'Surveys',
          link: '/admin/surveys/',
        },
        {
          text: 'Schemes',
          link: '/admin/surveys/schemes',
        },
        {
          text: 'Prompt editor',
          link: '/admin/surveys/prompt-editor',
        },
        {
          text: 'Prompt types',
          link: '/admin/surveys/prompt-types',
        },
        {
          text: 'Prompt templates',
          link: '/admin/surveys/prompt-templates',
        },
      ],
    },
    {
      text: 'Access control list',
      items: [
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
      items: [
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
      items: [
        {
          text: 'Introduction',
          link: '/survey/',
        },
      ],
    },
  ],
  '/portal/': [
    {
      text: 'Portal',
      collapsable: false,
      items: [
        {
          text: 'Introduction',
          link: '/Portal/',
        },
      ],
    },
  ],
  '/cli/': [
    {
      text: 'CLI',
      collapsable: false,
      items: [
        {
          text: 'Introduction',
          link: '/cli/',
        },
        {
          text: 'Generate .env files',
          link: '/cli/generate-env',
        },
        {
          text: 'Generate key / secret',
          link: '/cli/generate-key',
        },
        {
          text: 'Generate VAPID keys',
          link: '/cli/generate-vapid-keys',
        },
        {
          text: 'Find portion images',
          link: '/cli/find-portion-images',
        },
      ],
    },
  ],
  '/deployment/': [
    {
      text: 'Deployment',
      items: [
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
      items: [
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
      items: [
        {
          text: 'Introduction',
          link: '/developer/',
        },

        {
          text: 'Getting started',
          link: '/developer/getting-started',
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
};
