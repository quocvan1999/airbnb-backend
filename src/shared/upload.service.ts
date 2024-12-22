import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = (destination: string): any => {
  return diskStorage({
    destination: `./public/imgs/${destination}`,
    filename: (req, file, callback) => {
      const uniqueName = Date.now();
      callback(null, `${uniqueName}${extname(file.originalname)}`);
    },
  });
};
