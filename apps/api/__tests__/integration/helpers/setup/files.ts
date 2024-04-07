import { downloadImage, generateCSV } from '../util';

export type MockFiles = {
  data: {
    csv: string;
  };
  images: {
    jpg: string;
  };
};

export async function initFiles(): Promise<MockFiles> {
  const jpg = await downloadImage('https://picsum.photos/1200/800.jpg', 'mockImage.jpg');
  const csv = await generateCSV('uploadRespondents.csv');

  return {
    data: { csv },
    images: { jpg },
  };
}
