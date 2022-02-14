export type AdminUserProfileResponse = {
  profile: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  permissions: string[];
  roles: string[];
};
