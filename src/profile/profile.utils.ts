import { GetProfilesFilter, GetProfilesMongoQuery } from './profile.type';

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