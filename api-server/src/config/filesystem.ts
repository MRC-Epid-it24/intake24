export type LocalLocation = 'logs' | 'public' | 'downloads' | 'uploads' | 'images';

export type FileSystemConfig = {
  local: Record<LocalLocation, string>;
};

const fsConfig: FileSystemConfig = {
  local: {
    logs: process.env.FS_LOGS ?? 'storage/logs',
    public: process.env.FS_PUBLIC ?? 'public',
    downloads: process.env.FS_DOWNLOADS ?? 'storage/downloads',
    uploads: process.env.FS_UPLOADS ?? 'storage/uploads',
    images: process.env.FS_IMAGES ?? 'storage/images',
  },
};

export default fsConfig;
