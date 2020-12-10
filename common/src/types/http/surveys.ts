export type UserInfoResponse = {
  userId: number;
  name: string | null;
  recallNumber: number;
  redirectToFeedback: boolean;
  maximumTotalSubmissionsReached: boolean;
  maximumDailySubmissionsReached: boolean;
};

export type GenerateUserResponse = {
  userName: string;
  password: string;
};
