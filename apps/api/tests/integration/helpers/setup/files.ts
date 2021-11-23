import { downloadImage } from '../util';

export type MockFiles = {
  images: {
    jpg: string;
  };
};

export const initFiles = async (): Promise<MockFiles> => {
  const jpg = await downloadImage('https://picsum.photos/1200/800.jpg', 'mockImage.jpg');

  return {
    images: {
      jpg,
    },
  };
};
