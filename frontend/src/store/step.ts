import { toRaw } from "vue";
import { defineStore } from "pinia";

import { TRACK_INPUT } from "@/constants";
import { createStep, subscribeToSteps } from "@/firebase/db";
import { useTrackStore } from "@/store/track";
import { useCommonStore } from "@/store/common";
import { readableRelativeDateTime } from "@/datetime";

interface State {
  steps: any[];
  newStepValues: {} | null;
  newStepEnabled: {} | null;
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

const _filterUndefined = (obj) => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (value !== undefined) {
      result[key] = value;
    }
    return result;
  }, {});
};

const _computeStepValue = (field, step) => {
  switch (field.input.identifier) {
    case TRACK_INPUT.SELECT: {
      const matchingSelection = field.input.parameters.values.find(
        ({ value }) => value === String(step.values[field.key])
      );
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
  meta: StepDisplayCell[];
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
      const stepsDisplayRows: StepDisplayRow[] = [];
      for (const step of state.steps) {
        const stepsDisplayRow: StepDisplayRow = { values: [], meta: [] };
        for (const field of fields) {
          stepsDisplayRow.values.push({
            label: field.name,
            value: _computeStepValue(field, step),
          });
        }
        stepsDisplayRow.meta.push({
          label: "Tracked At",
          value: readableRelativeDateTime(step.createdAt),
        });
        stepsDisplayRows.push(stepsDisplayRow);
      }
      return stepsDisplayRows;
    },
    stepsExportRows(state) {
      debugger;
      const fields = useTrackStore().current?.fields;
      if (!fields) return [];
      const stepsDisplayRows: any[] = [];
      for (const step of state.steps) {
        const stepsExportRow = {};
        for (const field of fields) {
          stepsExportRow[field.key] = _computeStepValue(field, step);
        }
        stepsExportRow["createdAt"] = step.createdAt;
        stepsExportRow["updatedAt"] = step.updatedAt;
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
    async createStep() {
      await createStep(useCommonStore().userId, useTrackStore().currentId, {
        values: _filterUndefined(toRaw(this.newStepValues)),
      });
    },
  },
});
