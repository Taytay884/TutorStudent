import { BulkUploadProfilesRow, GetProfilesFilter, GetProfilesMongoQuery } from './profile.type';
import { Association, IProfile } from './profile.model';

export function transformGetProfilesFilterToMongoQuery(filter: GetProfilesFilter): Partial<GetProfilesMongoQuery> {
  const mongoQuery: Partial<GetProfilesMongoQuery> = {};
  const $or: any[] = [];

  if (filter.id) {
    $or.push({ id: { $regex: filter.id, $options: 'i' } });
  }
  if (filter.name) {
    $or.push({
      $expr: {
        $regexMatch: {
          input: { $concat: ['$firstName', ' ', '$lastName'] },
          regex: filter.name,
          options: 'i',
        },
      },
    });
  }
  if (!isNaN(filter.hoursToGive)) {
    mongoQuery.hoursToGive = { '$gt': Number(filter.hoursToGive) } ;
  }
  if (!isNaN(filter.hoursToGet)) {
    mongoQuery.hoursToGet = { '$gt': Number(filter.hoursToGet) } ;
  }
  if ($or.length > 0) {
    mongoQuery.$or = $or;
  }
  if (filter.courses) {
    mongoQuery.courses =  { $in: filter.courses };
  }

  return mongoQuery;
}

export function sheetRowToProfile(row: BulkUploadProfilesRow): IProfile {
  const requiredFields: (keyof BulkUploadProfilesRow)[] = ['תעודת זהות', 'שם פרטי', 'שם משפחה', 'אימייל', 'טלפון'];

  const emptyRequiredFields = requiredFields.filter(field => {
    return !row[field];
  });
  if (emptyRequiredFields.length !== 0) {
    throw new Error(`Missing required fields: ${emptyRequiredFields.join(', ')}`);
  }

  return {
    id: row['תעודת זהות'],
    firstName: row['שם פרטי'],
    lastName: row['שם משפחה'],
    email: row['אימייל'],
    phone: row['טלפון'],
    courses: row['קורסים'].split(','),
    hoursToGive: row['שעות בתור חונך'] || 0,
    hoursToGet: row['שעות בתור חניך'] || 0,
    reasons: row['סיבה'] ? [row['סיבה']] : [],
    association: row['מאגר'] as Association,
  };

}