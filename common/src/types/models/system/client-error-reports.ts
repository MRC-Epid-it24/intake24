import { Dictionary } from '../../common';
import { OmitAndOptional } from '../model';

export type ClientErrorReportAttributes = {
  id: number;
  userId: number | null;
  surveyId: string | null;
  reportedAt: Date;
  stackTrace: string;
  surveyStateJson: Dictionary;
  new: boolean;
};

export type ClientErrorReportCreationAttributes = OmitAndOptional<
  ClientErrorReportAttributes,
  'id',
  'userId' | 'surveyId'
>;
