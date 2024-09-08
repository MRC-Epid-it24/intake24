export const strichReaders = [
  'ean13',
  'ean8',
  'upca',
  'upce',
  'databar',
  'databar-exp',
  'code39',
  'code93',
  'code128',
  'i25',
  'codabar',
  'qr',
  'aztec',
  'datamatrix',
  'pdf417',
] as const;
export type StrichReaders = typeof strichReaders[number];
