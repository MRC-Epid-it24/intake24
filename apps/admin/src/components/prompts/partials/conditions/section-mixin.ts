import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SectionMixin',

  props: {
    section: {
      type: String,
      required: true,
    },
  },

  computed: {
    sections() {
      return ['food', 'meal', 'survey'].map((value) => ({
        value,
        text: this.$t(`survey-schemes.conditions.sections.${value}`).toString(),
      }));
    },
  },
});
