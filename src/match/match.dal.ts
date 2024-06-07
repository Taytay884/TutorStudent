import { IMatch, Match } from './match.model';

export async function createMatch(match: IMatch): Promise<IMatch> {
  return new Match(match).save();
}

export async function getMatches(): Promise<IMatch[]> {
  return Match.find()
    .populate({ path: 'tutor', populate: { path: 'courses' } })
    .populate({ path: 'student', populate: { path: 'courses' } });
}

export async function deleteMatch(id: string): Promise<IMatch | null> {
  return Match.findByIdAndDelete(id);
}
