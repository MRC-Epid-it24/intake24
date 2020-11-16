export type LocalLocation = 'logs' | 'public' | 'uploads';

export type FileSystemConfig = {
  local: Record<LocalLocation, string>;
};

const fsConfig: FileSystemConfig = {
  local: {
    logs: process.env.FS_LOGS ?? 'storage/logs',
    public: process.env.FS_PUBLIC ?? 'public',
    uploads: process.env.FS_UPLOADS ?? 'storage/uploads',
  },
};

export default fsConfig;
