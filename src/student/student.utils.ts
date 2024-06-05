import { GetStudentsFilter, GetStudentsMongoQuery } from './student.type';

export function transformGetStudentsFilterToMongoQuery(filter: GetStudentsFilter): Partial<GetStudentsMongoQuery> {
  const mongoQuery: Partial<GetStudentsMongoQuery> = {};
  const $or: any[] = [];

  if (filter.id) {
    $or.push({ id: { $regex: filter.id, $options: 'i' } });
  }
  if (filter.name) {
    $or.push({ name: { $regex: filter.name, $options: 'i' } });
  }
  if ($or.length > 0) {
    mongoQuery.$or = $or;
  }
  if (filter.courses) {
    mongoQuery.courses =  { $in: filter.courses };
  }

  return mongoQuery;
}