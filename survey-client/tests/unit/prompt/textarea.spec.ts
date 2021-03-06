import { shallowMount } from "@vue/test-utils";
import TextareaPrompt from "@/components/prompts/TextareaPrompt.vue";

describe("TextareaPrompt.vue.vue", () => {
  it("renders props.msg when passed", () => {
    const text = { en: "Hello world" };
    const wrapper = shallowMount(TextareaPrompt, {
      propsData: { text: text }
    });
    expect(wrapper.text()).toMatch(text.en);
  });
});
