import { defineStore } from "pinia";

import { useTrackStore } from "@/store/track";
import { guardedFetchJson } from "@/fetchWrapper";
import { TRACK_INPUT } from "@/constants";

interface State {
  steps: any[];
  newStep: {} | null;
  newEnabled: {} | null;
}

export const useStepStore = defineStore("step", {
  state: (): State => ({
    steps: [],
    newStep: null,
    newEnabled: null,
  }),
  actions: {
    reset() {
      this.steps = [];
      this.newStep = null;
      this.newEnabled = null;
    },
    setSteps(input) {
      this.steps = input;
    },
    prepareNewStepWithFields(fields) {
      if (!fields) return;
      const newStep = {};
      const newEnabled = {};

      fields.forEach((field) => {
        newEnabled[field.key] = true;

        switch (field.input.identifier) {
          case TRACK_INPUT.SLIDER: {
            const halfPoint = (parseFloat(field.input.parameters.min) + parseFloat(field.input.parameters.max)) / 2.0;
            newStep[field.key] = halfPoint;
            break;
          }
          case TRACK_INPUT.SELECT: {
            const firstEntryValue = field.input.parameters.values[0].value;
            newStep[field.key] = firstEntryValue;
            break;
          }
          case TRACK_INPUT.FIELD: {
            newStep[field.key] =
              field.input && field.input.parameters && field.input.parameters.selected
                ? field.input.parameters.selected
                : null;
            break;
          }
        }
      });

      this.newStep = newStep;
      this.newEnabled = newEnabled;
    },
    addStep(step) {
      this.steps.unshift(step);
    },
    removeStep(id) {
      this.steps = this.steps.filter((step) => {
        return step._id !== id;
      });
    },
    async readSteps() {
      const trackStore = useTrackStore();
      this.prepareNewStepWithFields(trackStore.current?.fields);
      const data = await guardedFetchJson(`/api/track/${trackStore.currentId}/step`);
      if (!data) return;
      this.setSteps(data);
    },
    async createStep() {
      const trackStore = useTrackStore();
      const data = await guardedFetchJson(`/api/track/${trackStore.currentId}/step`, {
        method: "POST",
        body: JSON.stringify({ values: this.newStep }),
      });
      if (!data) return;
      this.prepareNewStepWithFields(trackStore.current?.fields);
      this.addStep(data);
    },
  },
});
