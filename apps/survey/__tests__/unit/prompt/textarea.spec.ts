import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n, { I18nOptions } from 'vue-i18n';
import TextareaPrompt from '@intake24/survey/components/prompts/custom/TextareaPrompt.vue';

const localVue = createLocalVue();
const i18n: I18nOptions = { locale: 'en' };

localVue.use(VueI18n);

describe('TextareaPrompt.vue.vue', () => {
  it('renders props.msg when passed', () => {
    const text = { en: 'Hello world' };

    const wrapper = shallowMount(TextareaPrompt, {
      propsData: { promptProps: { text } },
      localVue,
      i18n,
    });

    // expect(wrapper.text()).toMatch(text.en);
  });
});
