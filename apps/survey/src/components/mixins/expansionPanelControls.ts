import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      panelOpenId: 0,
    };
  },

  methods: {
    // We don't track # of panels per prompt, so if newPanelId beyond # panels, all will be closed
    setPanelOpen(newPanelId: number) {
      this.panelOpenId = newPanelId;
    },
    closeAllPanels() {
      this.panelOpenId = -1;
    },
  },
});
