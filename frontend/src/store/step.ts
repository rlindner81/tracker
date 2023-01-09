import { defineStore } from "pinia";

import { TRACK_INPUT } from "@/constants";
import { createStep, subscribeToSteps } from "@/firebase/db";
import { useTrackStore } from "@/store/track";
import { useCommonStore } from "@/store/common";

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
    subscribeSteps() {
      const trackStore = useTrackStore();
      subscribeToSteps(useCommonStore().userId, trackStore.currentId, (steps) => this.setSteps(steps));
      // TODO this should happen when the current track changes
      this.prepareNewStepWithFields(trackStore.current?.fields);
    },
    async createStep() {
      const data = await createStep(this.newStep);
      // TODO
      debugger;
      if (!data) return;
      this.prepareNewStepWithFields(useTrackStore().current?.fields);
      this.addStep(data);
    },
  },
});
