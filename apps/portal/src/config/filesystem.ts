export type LocalLocation = 'public';

export type FileSystemConfig = {
  local: Record<LocalLocation, string>;
};

const fsConfig: FileSystemConfig = {
  local: {
    public: process.env.FS_PUBLIC || 'public',
  },
};

export default fsConfig;
