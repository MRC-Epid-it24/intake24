import push from './push.test';
import subscribe from './subscribe.test';
import unsubscribe from './unsubscribe.test';

export default () => {
  describe('POST /api/subscriptions/push', push);
  describe('POST /api/subscriptions', subscribe);
  describe('DELETE /api/subscriptions', unsubscribe);
};
