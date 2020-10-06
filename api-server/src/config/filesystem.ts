export type LocalLocation = 'logs' | 'public';

export type FileSystemConfig = {
  local: Record<LocalLocation, string>;
};

const fsConfig: FileSystemConfig = {
  local: {
    logs: process.env.FS_LOGS ?? 'storage/logs',
    public: process.env.FS_PUBLIC ?? 'public',
  },
};

export default fsConfig;
