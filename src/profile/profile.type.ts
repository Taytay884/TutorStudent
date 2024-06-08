export type GetProfilesFilter = {
  courses: string[],
  name: string,
  id: string,
  hoursToGive: number
};



export type GetProfilesMongoQuery = {
  $or: any[],
  courses: { $in: string[] },
};