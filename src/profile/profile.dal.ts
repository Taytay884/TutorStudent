import { IProfile, Profile } from './profile.model';
import { GetProfilesFilter } from './profile.type';
import { transformGetProfilesFilterToMongoQuery } from './profile.utils';

export async function createProfile(profile: IProfile): Promise<IProfile> {
  return new Profile(profile).save();
}

export async function getProfileById(id: string): Promise<IProfile | null> {
  return Profile.findById({ id }).populate('courses');
}

export async function getProfiles(filter: GetProfilesFilter): Promise<IProfile[]> {
  const mongoQuery = transformGetProfilesFilterToMongoQuery(filter);
  return Profile.find(mongoQuery).populate('courses');
}

export async function updateProfile(profile: IProfile): Promise<IProfile | null> {
  return Profile.findByIdAndUpdate(profile._id, profile, { new: true });
}

export async function deleteProfile(id: string): Promise<IProfile | null> {
  return Profile.findByIdAndDelete(id);
}
