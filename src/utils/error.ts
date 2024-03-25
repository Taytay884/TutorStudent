export function getMongoError(error: any): string {
  if (error.code === 11000) {
    return 'Duplicate key error';
  }
  return error.message;
}