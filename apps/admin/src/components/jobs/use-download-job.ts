import type { JobEntry } from '@intake24/common/types/http/admin';
import { useHttp } from '@intake24/admin/services';
import { downloadFile } from '@intake24/ui/util';

export const useDownloadJob = (user = false) => {
  const http = useHttp();

  const downloadUrlAvailable = (job: JobEntry) =>
    job.downloadUrl &&
    job.downloadUrlExpiresAt &&
    new Date(job.downloadUrlExpiresAt).getTime() > Date.now();

  const download = async (job: JobEntry) => {
    const res = await http.get(
      user ? `admin/user/jobs/${job.id}/download` : `admin/jobs/${job.id}/download`,
      { responseType: 'blob' }
    );
    downloadFile(res, job.downloadUrl);
  };

  return { download, downloadUrlAvailable };
};
