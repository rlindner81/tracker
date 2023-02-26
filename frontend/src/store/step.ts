import { toRaw } from "vue";
import { defineStore } from "pinia";

import { TRACK_FIELD_INPUT } from "@/constants";
import { createStep, subscribeToSteps, unsubscribeSteps } from "@/firebase/db";
import { useTrackStore } from "@/store/track";
import { useCommonStore } from "@/store/common";
import { readableRelativeDateTime } from "@/datetime";
import { useUserStore } from "@/store/user";

interface State {
  steps: any[];
  newStepValues: {} | null;
  newStepEnabled: {} | null;
}

const _getFallbackValueForField = (field) => {
  switch (field.input) {
    case TRACK_FIELD_INPUT.TEXT_FIELD: {
      return "";
    }
    case TRACK_FIELD_INPUT.SELECT: {
      const { value } = field.params.choices[field.params.default_choice] || field.params.choices[0] || {};
      if (value !== undefined) return value;
      break;
    }
    case TRACK_FIELD_INPUT.SLIDER: {
      return (parseFloat(field.params.min) + parseFloat(field.params.max)) / 2.0;
    }
  }
  return null;
};

const _filterUndefined = (obj) => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (value !== undefined) {
      result[key] = value;
    }
    return result;
  }, {});
};

const _computeStepValue = (field, step) => {
  switch (field.input) {
    case TRACK_FIELD_INPUT.SELECT: {
      const matchingSelection = field.params.choices.find(({ value }) => value === String(step.values[field.key]));
      return matchingSelection ? matchingSelection.name : "";
    }
    default: {
      return step.values[field.key] ?? "";
    }
  }
};

interface StepDisplayCell {
  label: string;
  value: string;
}

interface StepDisplayRow {
  values: StepDisplayCell[];
  meta: {
    postedAt: string;
    postedBy: string;
  };
}

export const useStepStore = defineStore("step", {
  state: (): State => ({
    steps: [],
    newStepValues: null,
    newStepEnabled: null,
  }),
  getters: {
    stepsDisplayRows(state) {
      const fields = useTrackStore().current?.fields;
      if (!fields) return [];
      const stepsDisplayRows: StepDisplayRow[] = state.steps.map((step) => {
        const values = fields.reduce((result, field) => {
          result[field.key] = _computeStepValue(field, step);
          return result;
        }, {});
        const meta = {
          postedBy: useUserStore().emailById(step.posted_by),
          postedAt: readableRelativeDateTime(step.posted_at),
        };
        return { values, meta };
      });
      return stepsDisplayRows;
    },
    stepsExportRows(state) {
      const fields = useTrackStore().current?.fields;
      if (!fields) return [];
      const stepsDisplayRows: any[] = [];
      for (const step of state.steps) {
        const stepsExportRow = {};
        for (const field of fields) {
          stepsExportRow[field.key] = _computeStepValue(field, step);
        }
        stepsExportRow["postedBy"] = useUserStore().emailById(step.posted_by);
        stepsExportRow["postedAt"] = step.posted_at;
        stepsDisplayRows.push(stepsExportRow);
      }
      return stepsDisplayRows;
    },
  },
  actions: {
    setSteps(input) {
      this.steps = input;
    },
    resetNewStepValues() {
      const fields = useTrackStore().current?.fields;
      if (!fields) {
        this.newStepValues = null;
        this.newStepEnabled = null;
        return;
      }
      const newStepValues = {};
      const newStepEnabled = {};

      for (const field of fields) {
        newStepEnabled[field.key] = true;

        const fallbackValue = _getFallbackValueForField(field);
        newStepValues[field.key] = fallbackValue;
      }

      this.newStepValues = newStepValues;
      this.newStepEnabled = newStepEnabled;
    },
    subscribeSteps() {
      subscribeToSteps(useCommonStore().userId, useTrackStore().currentId, (steps) => this.setSteps(steps));
    },
    unsubscribeSteps() {
      unsubscribeSteps();
      this.setSteps([]);
    },
    async createStep() {
      await createStep(useCommonStore().userId, useTrackStore().currentId, {
        values: _filterUndefined(toRaw(this.newStepValues)),
      });
    },
  },
});
