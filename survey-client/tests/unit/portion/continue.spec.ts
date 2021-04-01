import { shallowMount } from '@vue/test-utils';
import Continue from '@/components/Continue.vue';

describe('Continue.vue', () => {
  it('renders continue button', () => {
    const label = 'new message';
    const wrapper = shallowMount(Continue, {
      propsData: { label },
    });
    expect(wrapper.text()).toMatch(label);
  });
});
