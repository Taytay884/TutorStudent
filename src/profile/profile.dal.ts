import { IProfile, Profile } from './profile.model';
import { GetProfilesFilter } from './profile.type';
import { transformGetProfilesFilterToMongoQuery } from './profile.utils';

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
                  { $eq: ['$student', '$$profileId'] },
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
              localField: 'student',
              foreignField: '_id',
              as: 'studentProfile',
            },
          },
          {
            $addFields: {
              tutorProfile: { $arrayElemAt: ['$tutorProfile', 0] },
              studentProfile: { $arrayElemAt: ['$studentProfile', 0] },
            },
          },
          {
            $project: {
              tutor: '$tutorProfile',
              student: '$studentProfile',
              hoursRequested: 1,
              hoursApproved: 1,
              dateMatched: 1,
              status: 1,
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

export async function getProfiles(filter: GetProfilesFilter): Promise<IProfile[]> {
  const mongoQuery = transformGetProfilesFilterToMongoQuery(filter);
  return Profile.find(mongoQuery).populate({ path: 'courses', foreignField: 'id' });
}

export async function updateProfile(profile: IProfile): Promise<IProfile | null> {
  return Profile.findByIdAndUpdate(profile._id, profile, { new: true });
}

export async function deleteProfile(id: string): Promise<IProfile | null> {
  return Profile.findByIdAndDelete(id);
}
