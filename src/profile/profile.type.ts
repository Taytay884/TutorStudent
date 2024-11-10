import { Association } from './profile.model';

export type GetProfilesFilter = {
  courses: string[];
  name: string;
  id: string;
  hoursToGive: number;
  hoursToGet: number;
  onlyTutors: boolean;
};

export type GetProfilesMongoQuery = {
  $or: any[],
  courses: { $in: string[] },
  hoursToGet: { $gt: number },
  hoursToGive: { $gt: number }
};

export type BulkUploadProfilesRow = {
  'שם פרטי': string;
  'שם משפחה': string;
  'תעודת זהות': string;
  'אימייל': string;
  'טלפון': string;
  'סיבה': string;
  'שעות בתור חונך': number;
  'שעות בתור חניך': number;
  'מאגר': Association;
  'קורסים': string;
};