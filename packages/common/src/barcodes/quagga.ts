export const quaggaReaders = [
  'code_128_reader',
  'ean_reader',
  'ean_5_reader',
  'ean_2_reader',
  'ean_8_reader',
  'code_39_reader',
  'code_39_vin_reader',
  'codabar_reader',
  'upc_reader',
  'upc_e_reader',
  'i2of5_reader',
  '2of5_reader',
  'code_93_reader',
  'code_32_reader',
] as const;
export type QuaggaReaders = typeof quaggaReaders[number];
