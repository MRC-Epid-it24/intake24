import Vue from 'vue';

export type ExpansionPanelControls = {
  panelOpenId: number;
  setPanelOpen<T>(newPanelId: number): T;
};

export default Vue.extend({
  data() {
    return {
      panelOpenId: 0 as number,
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
