import { defineStore } from 'pinia';
import { Selection } from '@intake24/common/types';
import { ComponentType } from '@intake24/common/prompts';
import { copy } from '@intake24/common/util';
import { useSurvey } from '@intake24/survey/stores/survey';

export type RecallLogPrompt = {
  type: ComponentType;
  applicable: boolean;
  reason: string;
};

export type RecallLogEntry = {
  selection: Selection;
  prompts: RecallLogPrompt[];
};

export type RecallLogState = {
  entries: RecallLogEntry[];
};

export const recallLog = defineStore('recall-log', {
  state: (): RecallLogState => ({
    entries: [{ selection: copy(useSurvey().selection), prompts: [] }],
  }),
  actions: {
    selectionChanged(selection: Selection) {
      this.entries.push({ selection: copy(selection), prompts: [] });
    },

    promptCheck(type: ComponentType, applicable: boolean, reason: string) {
      this.entries[this.entries.length - 1].prompts.push({type, applicable, reason});
    },
  },
});
