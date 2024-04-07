import { shallowMount } from '@vue/test-utils';

import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';

describe('continue.vue', () => {
  it('renders continue button', () => {
    const label = 'new message';
    const wrapper = shallowMount(Continue, {
      propsData: { label },
    });
    expect(wrapper.text()).toMatch(label);
  });
});
