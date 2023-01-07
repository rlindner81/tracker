import { defineStore } from "pinia";

import { useTrackStore } from "@/store/track";
import { guardedFetchJson } from "@/fetchWrapper";
import { TRACK_INPUT } from "@/constants";

interface State {
  steps: any[];
  newStep: {} | null;
  newEnabled: {} | null;
}

const _getFallbackValueForField = (field) => {
  switch (field.input.identifier) {
    case TRACK_INPUT.SLIDER: {
      return (parseFloat(field.input.parameters.min) + parseFloat(field.input.parameters.max)) / 2.0;
    }
    case TRACK_INPUT.SELECT: {
      const defaultSelectValue = field.input.parameters.selected;
      if (defaultSelectValue) return defaultSelectValue;
      const firstSelectValue = field.input.parameters.values[0].value;
      if (firstSelectValue) return firstSelectValue;
      break;
    }
    case TRACK_INPUT.FIELD: {
      return "";
    }
  }
  return null;
};

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

      for (const field of fields) {
        newEnabled[field.key] = true;

        const fallbackValue = _getFallbackValueForField(field);
        newStep[field.key] = fallbackValue;
      }

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
