import { IProfile, Profile, TutorProfile } from './profile.model';
import { GetProfilesFilter } from './profile.type';
import { transformGetProfilesFilterToMongoQuery } from './profile.utils';
import { MatchStatus } from '../match/match.type';
import { IMatch, Match } from '../match/match.model';

export async function createProfile(profile: IProfile): Promise<IProfile> {
  return new Profile(profile).save();
}

export async function getProfileById(id: string): Promise<IProfile | null> {
  const profileWithMatches = await Profile.aggregate([
    { $match: { id } },
    {
      $lookup: {
        from: 'matches', // The collection name for matches
        let: { profileId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$tutor', '$$profileId'] },
                  { $in: ['$$profileId', '$students'] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: 'profiles', // The collection name for profiles
              localField: 'tutor',
              foreignField: '_id',
              as: 'tutorProfile',
            },
          },
          {
            $lookup: {
              from: 'profiles', // The collection name for profiles
              localField: 'students',
              foreignField: '_id',
              as: 'studentProfiles',
            },
          },
          {
            $lookup: {
              from: 'courses', // The collection name for courses
              localField: 'courses',
              foreignField: 'id',
              as: 'matchCourses',
            },
          },
          {
            $addFields: {
              tutorProfile: { $arrayElemAt: ['$tutorProfile', 0] },
              studentProfiles: { $map: {
                input: '$studentProfiles',
                as: 'profile',
                in: {
                  _id: '$$profile._id',
                  id: '$$profile.id',
                  name: '$$profile.name',
                },
              } },
              matchCourses: { $map: {
                input: '$matchCourses',
                as: 'course',
                in: {
                  _id: '$$course._id',
                  id: '$$course.id',
                  name: '$$course.name',
                },
              } },
            },
          },
          {
            $project: {
              tutor: '$tutorProfile',
              students: '$studentProfiles',
              hoursRequested: 1,
              hoursApproved: 1,
              dateMatched: 1,
              status: 1,
              courses: '$matchCourses', // Add courses to the output
            },
          },
        ],
        as: 'matches',
      },
    },
    {
      $lookup: {
        from: 'courses', // The collection name for courses
        localField: 'courses',
        foreignField: 'id',
        as: 'courses',
      },
    },
  ]);

  return profileWithMatches.length > 0 ? profileWithMatches[0] : null;
}

async function extendProfilesWithActiveMatches(profiles: IProfile[]): Promise<IProfile[]> {
  const profileIds = profiles.map(profile => profile._id);
  const matches: IMatch[] = await Match.find({
    tutor: { $in: profileIds },
    status: MatchStatus.IN_PROGRESS, // Adjust based on your match status field
  });

  // Create a map of active match counts per tutor
  const matchCounts = matches.reduce((acc, match) => {
    acc[match.tutor.toString()] = (acc[match.tutor.toString()] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Step 3: Combine tutor profiles with active match counts
  return profiles.map(profile => ({
    ...profile.toObject(),
    activeMatches: matchCounts[profile._id.toString()] || 0,
  } as IProfile)).sort((a, b) => a.activeMatches! - b.activeMatches!);
}

export async function getProfiles(filter: GetProfilesFilter): Promise<IProfile[]> {
  const mongoQuery = transformGetProfilesFilterToMongoQuery(filter);
  const profiles = await Profile.find(mongoQuery)
    .populate({ path: 'courses', foreignField: 'id' })
    .sort({ hoursToGive: -1, hoursToGet: -1 });

  return extendProfilesWithActiveMatches(profiles);
}

export async function getTutors(filter: GetProfilesFilter): Promise<TutorProfile[]> {
  // Step 1: Get the tutor profiles based on the filter
  const mongoQuery = transformGetProfilesFilterToMongoQuery(filter);

  const profiles = await Profile.find(mongoQuery)
    .populate({ path: 'courses', foreignField: 'id' })
    .sort({ hoursToGive: -1, hoursToGet: -1 });
  // Step 2: Get the active matches for each tutor
  return await extendProfilesWithActiveMatches(profiles) as TutorProfile[];
}
export async function updateProfile(profile: IProfile): Promise<IProfile | null> {
  return Profile.findByIdAndUpdate(profile._id, profile, { new: true });
}

export async function deleteProfile(id: string): Promise<IProfile | null> {
  return Profile.findByIdAndDelete(id);
}
