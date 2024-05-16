import * as MatchDal from './match.dal';
import { IMatch } from './match.model';
import { getMongoError } from '../utils/error';

export async function createMatch(Match: IMatch): Promise<IMatch> {
  try {
    return await MatchDal.createMatch(Match);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export async function getMatches(): Promise<IMatch[]> {
  return MatchDal.getMatches();
}

export async function deleteMatch(id: string): Promise<IMatch | null> {
  return MatchDal.deleteMatch(id);
}
