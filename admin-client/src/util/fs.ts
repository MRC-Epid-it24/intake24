import { AxiosResponse } from 'axios';
import jsFileDownload from 'js-file-download';

export const downloadFile = ({ data, headers }: AxiosResponse, filename?: string | null): void => {
  let finalFilename = filename;
  if (!finalFilename && headers['content-disposition']) {
    finalFilename = headers['content-disposition']
      .split(';')
      .find((item: string) => item.trim().startsWith('filename='));
  }

  finalFilename = finalFilename
    ? finalFilename.replace(/"/g, '').replace('filename=', '').trim()
    : `File_${new Date().toLocaleString()}`;

  // TODO: read mime type

  jsFileDownload(data, finalFilename);
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
