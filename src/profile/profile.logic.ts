import * as ProfileDal from './profile.dal';
import { IProfile } from './profile.model';
import { getMongoError } from '../utils/error';
import { GetProfilesFilter } from './profile.type';

export async function createProfile(profile: IProfile): Promise<IProfile> {
  try {
    return await ProfileDal.createProfile(profile);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export function getProfileById(id: string): Promise<IProfile | null> {
  return ProfileDal.getProfileById(id);
}

export function getProfiles(filter: GetProfilesFilter): Promise<IProfile[]> {
  return ProfileDal.getProfiles(filter);
}

export function updateProfile(profile: IProfile): Promise<IProfile | null> {
  try {
    return ProfileDal.updateProfile(profile);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export function deleteProfile(id: string): Promise<IProfile | null> {
  return ProfileDal.deleteProfile(id);
}


