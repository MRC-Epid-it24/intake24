import { AxiosResponse } from 'axios';
import jsFileDownload from 'js-file-download';

export const downloadFile = ({ data, headers }: AxiosResponse): void => {
  let filename = headers['content-disposition']
    .split(';')
    .find((item: string) => item.trim().startsWith('filename='));

  filename =
    typeof filename === 'undefined'
      ? `File_${headers.date}`
      : filename.replace(/"/g, '').replace('filename=', '').trim();

  // TODO: read mime type

  jsFileDownload(data, filename);
};

export const readFile = async (file: Blob): Promise<string | ArrayBuffer | null> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error('Cannot parse the file'));
    };

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.readAsText(file);
  });
};

export default {
  downloadFile,
  readFile,
};
