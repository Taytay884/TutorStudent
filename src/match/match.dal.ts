import { IMatch, Match } from './match.model';
import { Profile } from '../profile/profile.model';
import { MatchStatus } from './match.type';

export async function createMatch(match: IMatch): Promise<IMatch> {
  await Profile.findByIdAndUpdate({ _id: match.tutor }, { '$inc': { hoursToGive: -1 * match.hoursApproved } });
  await Profile.findByIdAndUpdate({ _id: match.student }, { '$inc': { hoursToGet: -1 * match.hoursApproved } });
  return new Match(match).save();
}

export async function updateMatch(match: IMatch): Promise<IMatch | null> {
  const foundMatch = await Match.findById(match._id);
  if (!match) {
    throw new Error('Match not found');
  }
  if ([MatchStatus.REJECTED, MatchStatus.CANCELED].includes(match.status)) {
    await Profile.findByIdAndUpdate({ _id: match.tutor }, { '$inc': { hoursToGive: match.hoursApproved } });
    await Profile.findByIdAndUpdate({ _id: match.student }, { '$inc': { hoursToGet: match.hoursApproved } });
  }
  if (match.status === MatchStatus.APPROVED) {
    const updateHours = foundMatch!.hoursApproved - match.hoursApproved;
    if (updateHours !== 0) {
      await Profile.findByIdAndUpdate({ _id: match.tutor }, { '$inc': { hoursToGive: updateHours } });
      await Profile.findByIdAndUpdate({ _id: match.student }, { '$inc': { hoursToGet: updateHours } });
    }
  }

  return Match.findByIdAndUpdate(match._id, match, { new: true });
}

export async function getMatches(): Promise<IMatch[]> {
  return Match.find()
    .populate({ path: 'tutor', populate: { path: 'courses' } })
    .populate({ path: 'student', populate: { path: 'courses' } });
}

export async function deleteMatch(id: string): Promise<IMatch | null> {
  return Match.findByIdAndDelete(id);
}
