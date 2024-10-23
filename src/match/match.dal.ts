import { IMatch, Match } from './match.model';
import { Profile } from '../profile/profile.model';
import { GetMatchesFilter, MatchStatus } from './match.type';

export async function createMatch(match: IMatch): Promise<IMatch> {
  return new Match(match).save();
}

export async function updateMatch(match: IMatch): Promise<IMatch | null> {
  const updatedMatch = await Match.findByIdAndUpdate(match._id, match, { new: true });
  if (!updatedMatch) {
    throw new Error('Match not found');
  }
  if (match.status === MatchStatus.APPROVED) {
    await Profile.findByIdAndUpdate({ _id: match.tutor }, { '$inc': { hoursToGive: -1 * match.hoursApproved } });
    await Profile.updateMany({ _id: { $in: match.students } }, { '$inc': { hoursToGet: -1 * match.hoursApproved } });
  }

  return updatedMatch;
}

function transformGetMatchesFilter(filter: GetMatchesFilter) {
  const newFilter: Record<string, any> = {};

  if (filter.status) {
    newFilter.status = filter.status;
  }

  if (filter.dateMatched) {
    newFilter.dateMatched = { $gt: filter.dateMatched };
  }

  if (filter.dateFinished) {
    newFilter.dateFinished = { $lt: filter.dateFinished };
  }

  return newFilter;
}

export async function getMatches(filter: GetMatchesFilter): Promise<IMatch[]> {
  return Match.find(transformGetMatchesFilter(filter)).sort({ dateMatched: -1 })
    .populate({ path: 'tutor', populate: { path: 'courses', foreignField: 'id' } })
    .populate({ path: 'students', populate: { path: 'courses', foreignField: 'id' } })
    .populate({ path: 'courses', foreignField: 'id' });
}

export async function getMatch(matchId: string): Promise<IMatch | null> {
  return Match.findOne({ _id: matchId })
    .populate({ path: 'tutor', populate: { path: 'courses', foreignField: 'id' } })
    .populate({ path: 'students', populate: { path: 'courses', foreignField: 'id' } })
    .populate({ path: 'courses', foreignField: 'id' });

}

export async function deleteMatch(id: string): Promise<IMatch | null> {
  return Match.findByIdAndDelete(id);
}
