import { GetProfilesFilter, GetProfilesMongoQuery } from './profile.type';

export function transformGetProfilesFilterToMongoQuery(filter: GetProfilesFilter): Partial<GetProfilesMongoQuery> {
  const mongoQuery: Partial<GetProfilesMongoQuery> = {};
  const $or: any[] = [];

  if (filter.id) {
    $or.push({ id: { $regex: filter.id, $options: 'i' } });
  }
  if (filter.name) {
    $or.push({ name: { $regex: filter.name, $options: 'i' } });
  }
  if (filter.hoursToGive) {
    $or.push({ hoursToGive: { '$gte': filter.hoursToGive } });
  }
  if ($or.length > 0) {
    mongoQuery.$or = $or;
  }
  if (filter.courses) {
    mongoQuery.courses =  { $in: filter.courses };
  }

  return mongoQuery;
}