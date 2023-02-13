import device from './device.controller';
import duo from './duo.controller';
import fido from './fido.controller';
import otp from './otp.controller';

export * from './device.controller';
export * from './duo.controller';
export * from './fido.controller';
export * from './otp.controller';

export default {
  device,
  duo,
  fido,
  otp,
};
