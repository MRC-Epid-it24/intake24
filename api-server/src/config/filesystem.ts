export type LocalLocation = 'logs' | 'public' | 'downloads' | 'uploads';

export type FileSystemConfig = {
  local: Record<LocalLocation, string>;
};

const fsConfig: FileSystemConfig = {
  local: {
    logs: process.env.FS_LOGS ?? 'storage/logs',
    public: process.env.FS_PUBLIC ?? 'public',
    downloads: process.env.FS_UPLOADS ?? 'storage/downloads',
    uploads: process.env.FS_UPLOADS ?? 'storage/uploads',
  },
};

export default fsConfig;
