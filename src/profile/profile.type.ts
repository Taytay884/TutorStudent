export type GetProfilesFilter = {
  courses: string[],
  name: string,
  id: string,
  hoursToGive: number
  hoursToGet: number
};



export type GetProfilesMongoQuery = {
  $or: any[],
  courses: { $in: string[] },
  hoursToGet: { $gte: number },
  hoursToGive: { $gte: number }
};