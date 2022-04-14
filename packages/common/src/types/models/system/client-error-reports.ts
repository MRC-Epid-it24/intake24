import { Dictionary } from '../../common';
import { OmitAndOptional } from '../model';

export type ClientErrorReportAttributes = {
  id: string;
  userId: string | null;
  surveyId: string | null;
  stackTrace: string[];
  surveyStateJson: Dictionary;
  new: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ClientErrorReportCreationAttributes = OmitAndOptional<
  ClientErrorReportAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'userId' | 'surveyId'
>;
