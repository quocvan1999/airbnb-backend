import { memoryStorage } from 'multer';

export const storage = (): any => {
  return memoryStorage();
};
