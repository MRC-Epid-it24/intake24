export type AdminUserProfileResponse = {
  profile: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    verifiedAt: Date | null;
  };
  permissions: string[];
  roles: string[];
};
