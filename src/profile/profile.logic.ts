import xlsx from 'xlsx';
import * as ProfileDal from './profile.dal';
import { IProfile, IProfileDocument, TutorProfile } from './profile.model';
import { getMongoError } from '../utils/error';
import { GetProfilesFilter } from './profile.type';
import { sheetRowToProfile } from './profile.utils';

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

export function getProfiles(filter: GetProfilesFilter): Promise<IProfile[] | TutorProfile[]> {
  if (filter.onlyTutors) {
    return ProfileDal.getTutors(filter);
  }
  return ProfileDal.getProfiles(filter);
}

export function updateProfile(profile: IProfileDocument): Promise<IProfile | null> {
  try {
    return ProfileDal.updateProfile(profile);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export function deleteProfile(id: string): Promise<IProfile | null> {
  return ProfileDal.deleteProfile(id);
}

export async function bulkCreateProfiles(fileAsBuffer: Buffer): Promise<any> {
  const workbook = xlsx.read(fileAsBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data: any[] = xlsx.utils.sheet_to_json(worksheet);
  const filteredData = data.filter((row: any) => Object.values(row).some(Boolean));
  const createdProfiles: IProfile[] = [];
  for (const [index, row] of filteredData.entries()) {
    try {
      const profile = sheetRowToProfile(row);
      const createdProfile = await ProfileDal.createProfile(profile);
      createdProfiles.push(createdProfile);
    } catch (error: any) {
      console.log(`Error in row ${index + 1}: ${error.message}`);
      throw new Error(getMongoError(error));
    }
  }
  return createdProfiles;
}