import { createLocalVue, shallowMount } from '@vue/test-utils';
import TextareaPrompt from '@/components/prompts/custom/TextareaPrompt.vue';
import VueI18n, { I18nOptions } from 'vue-i18n';

const localVue = createLocalVue();
const options: I18nOptions = { locale: 'en'}
localVue.use(VueI18n, options);
// localVue.use(VueI18n, {
//   locale: 'en',
// });

describe('TextareaPrompt.vue.vue', () => {
  it('renders props.msg when passed', () => {
    const text = { en: 'Hello world' };
    const wrapper = shallowMount(TextareaPrompt, {
      propsData: { text },
      localVue,
    });
    expect(wrapper.text()).toMatch(text.en);
  });
});
