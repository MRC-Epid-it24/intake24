import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      panel: 0,
    };
  },

  methods: {
    setPanel(panel: number) {
      this.panel = panel;
    },
    closePanels() {
      this.panel = -1;
    },
  },
});
