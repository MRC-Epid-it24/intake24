export type AdminUserProfileResponse = {
  profile: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    verifiedAt: Date | null;
  };
  permissions: string[];
  roles: string[];
};
