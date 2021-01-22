import { Dictionary } from '../../common';

export type ClientErrorReport = {
  id: number;
  userId: number | null;
  surveyId: string | null;
  reportedAt: Date;
  stackTrace: string;
  surveyStateJson: Dictionary;
  new: boolean;
};
