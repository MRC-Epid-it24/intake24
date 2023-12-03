export type ACLConfig = {
  cache: {
    enabled: boolean;
    ttl: number | string;
  };
  roles: {
    superuser: string;
  };
  signup: {
    enabled: boolean;
    permissions: string[];
    roles: string[];
  };
};

export const aclConfig: ACLConfig = {
  cache: {
    enabled: process.env.ACL_CACHE_ENABLED === 'true',
    ttl: process.env.ACL_CACHE_TTL || '7d',
  },
  roles: {
    superuser: 'superuser',
  },
  signup: {
    enabled: process.env.ACL_SIGNUP_ENABLED === 'true',
    permissions: process.env.ACL_SIGNUP_PERMISSIONS
      ? process.env.ACL_SIGNUP_PERMISSIONS.split(',')
      : [],
    roles: process.env.ACL_SIGNUP_ROLES ? process.env.ACL_SIGNUP_ROLES.split(',') : [],
  },
};
