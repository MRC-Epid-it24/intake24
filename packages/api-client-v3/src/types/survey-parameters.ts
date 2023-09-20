export interface SurveyParameters {
  id: string;
  schemeId: string;
  localeId: string;
  state: number;
  startDate: Date;
  endDate: Date;
  suspensionReason: string[];
  allowGeneratedUsers: boolean;
  generateUserKey: string[];
  externalFollowUpURL: string[];
  supportEmail: string;
  description: string[];
  finalPageHtml: string[];
  submissionNotificationUrl: string[];
  feedbackEnabled: boolean;
  numberOfSubmissionsForFeedback: number;
  storeUserSessionOnServer: boolean[];
  maximumDailySubmissions: number;
  maximumTotalSubmissions: number[];
  minimumSubmissionInterval: number;
  authUrlDomainOverride: string[];
  searchSortingAlgorithm: string;
  searchMatchScoreWeight: number;
  // errorReporting: ErrorReportingSettings;
}
