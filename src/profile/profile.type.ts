export type GetProfilesFilter = {
  courses: string[],
  name: string,
  id: string
};



export type GetProfilesMongoQuery = {
  $or: any[],
  courses: { $in: string[] },
};