import push from './push.test';
import subscribe from './subscribe.test';
import unsubscribe from './unsubscribe.test';

export default () => {
  describe('post /api/subscriptions/push', push);
  describe('post /api/subscriptions', subscribe);
  describe('delete /api/subscriptions', unsubscribe);
};
