const DUPLICATE_KEY_ERROR = 'Duplicate key error';

export function getMongoError(error: any): string {
  if (error.code === 11000) {
    return DUPLICATE_KEY_ERROR;
  }
  return error.message;
}

function isDuplicateKeyError(error: any): boolean {
  return error.message === DUPLICATE_KEY_ERROR;
}

export function responseError(res: any, error: any): void {
  res.status(isDuplicateKeyError(error) ? 409 : 500).send(error.message);
}