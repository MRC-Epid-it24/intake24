/* eslint-disable no-unused-expressions */

import { mount } from '@vue/test-utils';
import Prompt from '@/components/prompts/PortionSizeOptionPrompt.vue';

describe('Testing Component', () => {

  // Mount with test props
  const wrapper = mount(Prompt, {
    propsData: {
      text: { en: 'Portion Size Options' },
        description: { en: 'Meat lasagne (includes homemade)' },
        localDescription: { en: 'Meat lasagne (includes homemade)' },
        methods: [
          {
            method: "as-served",
            description: "use_an_image",
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fries_2.jpg/800px-Fries_2.jpg',
            // imageUrl: 'https://bad.src',
            useForRecipes: false,
            conversionFactor: 0.0,
            parameters: {
                "serving-image-set": "lasagne",
                "leftovers-image-set": "lasagne_leftovers"
            },
          },
        ],
        validation: {
          required: false,
          message: { en: null },
        },
    }
  });

  // Expect error message will appear with no selection
  it('Error when nothing selected', () => {
    expect(wrapper.text()).toContain('Meat lasagne (includes homemade)');
  });
});


// Expect no error when selecting any

// Expect styling to appear when selecting any