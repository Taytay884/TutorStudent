export type GetStudentsFilter = {
  courses: string[],
  name: string,
  id: string
};



export type GetStudentsMongoQuery = {
  $or: any[],
  courses: { $in: string[] },
};