import * as MatchDal from './match.dal';
import { IMatch } from './match.model';
import { getMongoError } from '../utils/error';
import { GetMatchesFilter } from './match.type';

export async function createMatch(match: IMatch): Promise<IMatch> {
  try {
    return await MatchDal.createMatch(match);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export async function updateMatch(match: IMatch): Promise<IMatch | null> {
  try {
    return await MatchDal.updateMatch(match);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export async function getMatches(filter: GetMatchesFilter): Promise<IMatch[]> {
  return MatchDal.getMatches(filter);
}

export async function getMatch(matchId: string): Promise<IMatch | null> {
  return MatchDal.getMatch(matchId);
}

export async function deleteMatch(id: string): Promise<IMatch | null> {
  return MatchDal.deleteMatch(id);
}
