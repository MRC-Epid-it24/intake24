export type LocalLocation = 'public' | 'downloads' | 'uploads' | 'images';

export type FileSystemConfig = {
  local: Record<LocalLocation, string>;
  urlExpiresAt: string;
};

const fsConfig: FileSystemConfig = {
  local: {
    public: process.env.FS_PUBLIC || 'public',
    downloads: process.env.FS_DOWNLOADS || 'storage/downloads',
    uploads: process.env.FS_UPLOADS || 'storage/uploads',
    images: process.env.FS_IMAGES || 'storage/images',
  },
  urlExpiresAt: '2d',
};

export default fsConfig;
