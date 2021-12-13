export type ACLConfig = {
  cache: {
    enabled: boolean;
    expiresIn: number | string;
  };
  roles: {
    superuser: string;
  };
};

const aclConfig: ACLConfig = {
  cache: {
    enabled: process.env.ACL_CACHE_ENABLED === 'true',
    expiresIn: process.env.ACL_CACHE_EXPIRES_IN || '7d',
  },
  roles: {
    superuser: 'superuser',
  },
};

export default aclConfig;
