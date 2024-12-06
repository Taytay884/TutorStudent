import { IProfile, IProfileDocument, Profile, TutorProfile } from './profile.model';
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

async function extendProfilesWithActiveMatches(profiles: IProfileDocument[]): Promise<IProfile[]> {
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
  } as IProfileDocument)).sort((a, b) => a.activeMatches! - b.activeMatches!);
}

export async function getProfiles(filter: GetProfilesFilter): Promise<IProfile[]> {
  const pipeline: any[] = [];

  const $or: any[] = [];
  if (filter.id) {
    $or.push({ id: { $regex: filter.id, $options: 'i' } });
  }
  if (filter.name) {
    $or.push({
      $expr: {
        $regexMatch: {
          input: { $concat: ['$firstName', ' ', '$lastName'] },
          regex: filter.name,
          options: 'i',
        },
      },
    });
  }
  if ($or.length > 0) {
    pipeline.push({ $match: { $or } });
  }

  if (!isNaN(filter.hoursToGive)) {
    pipeline.push({
      $match: { hoursToGive: { $gt: Number(filter.hoursToGive) } },
    });
  }
  if (!isNaN(filter.hoursToGet)) {
    pipeline.push({
      $match: { hoursToGet: { $gt: Number(filter.hoursToGet) } },
    });
  }

  if (filter.courses) {
    pipeline.push({
      $match: { courses: { $in: filter.courses } },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'courses', // Adjust the collection name if necessary
        localField: 'courses',
        foreignField: 'id',
        as: 'courses',
      },
    },
  );

  pipeline.push(
    {
      $lookup: {
        from: 'matches', // Adjust the collection name if necessary
        localField: '_id',
        foreignField: 'students',
        as: 'activeMatches',
        pipeline: [
          {
            $match: {
              status: MatchStatus.IN_PROGRESS, // Adjust based on your match status field
            },
          },
          {
            $lookup: {
              from: 'courses', // Collection for courses
              localField: 'courses', // Match courses by their IDs in the matches
              foreignField: 'id',
              as: 'course', // Retrieve full course details
            },
          },
        ],
      },
    },
    {
      $addFields: {
        activeMatchesCount: { $size: '$activeMatches' }, // Count total active matches for the profile
        activeMatchesCourses: {
          $reduce: {
            input: '$activeMatches',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this.course'] }, // Merge all course details into a single array
          },
        },
      },
    },
  );

  if (filter.reduceMatchedCourses) {
    pipeline.push(
      {
        $addFields: {
          notMatchedCourses: {
            $filter: {
              input: '$courses',
              as: 'course',
              cond: {
                $not: { $in: ['$$course.id', { $map: { input: '$activeMatchesCourses', as: 'amc', in: '$$amc.id' } }] },
              },
            },
          },
        },
      },
      {
        $match: {
          notMatchedCourses: { $gt: [] },
        },
      },
    );
  }

  // Sorting
  pipeline.push({
    $sort: {
      hoursToGive: -1,
      hoursToGet: -1,
      activeMatchesCount: -1,
    },
  });

  const profiles: IProfile[] = await Profile.aggregate(pipeline);

  return profiles;
}

export async function updateProfile(profile: IProfileDocument): Promise<IProfile | null> {
  return Profile.findByIdAndUpdate(profile._id, profile, { new: true });
}

export async function deleteProfile(id: string): Promise<IProfile | null> {
  return Profile.findByIdAndDelete(id);
}
