import push from './push.test';
import subscribe from './subscribe.test';
import unsubscribe from './unsubscribe.test';

export default () => {
  describe('pOST /api/subscriptions/push', push);
  describe('pOST /api/subscriptions', subscribe);
  describe('delete /api/subscriptions', unsubscribe);
};
