import { toRaw } from "vue";
import { defineStore } from "pinia";

import { TRACK_FIELD_INPUT, STEP_SYMBOL } from "@/constants";
import { createStep, subscribeToSteps, unsubscribeSteps, updateStep } from "@/firebase/db";
import { useTrackStore } from "@/store/track";
import { useCommonStore } from "@/store/common";
import { readableRelativeDateTime } from "@/datetime";
import { useUserStore } from "@/store/user";

interface State {
  steps: any[];
  activeStepId: string | null;
  activeStepValues: {} | null;
  activeStepEnabled: {} | null;
}

const _getSelectDefaultChoice = (field) => {
  switch (typeof field.params.default_choice) {
    case "number":
      return field.params.choices[field.params.default_choice];
    case "string":
      return field.params.choices.find((choice) => choice.value === field.params.default_choice);
    default:
      return field.params.choices[0];
  }
};

const _getFallbackValueForField = (field) => {
  switch (field.input) {
    case TRACK_FIELD_INPUT.TEXT_FIELD: {
      return "";
    }
    case TRACK_FIELD_INPUT.SELECT: {
      const { value } = _getSelectDefaultChoice(field) || {};
      if (value !== undefined) return value;
      break;
    }
    case TRACK_FIELD_INPUT.SLIDER: {
      return (parseFloat(field.params.min) + parseFloat(field.params.max)) / 2.0;
    }
  }
  return null;
};

const _filterDisabled = (enabledMap, valuesMap) => {
  return Object.entries(valuesMap).reduce((result, [key, value]) => {
    if (enabledMap[key] !== false) {
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
  [STEP_SYMBOL]: object;
}

export const useStepStore = defineStore("step", {
  state: (): State => ({
    steps: [],
    activeStepId: null,
    activeStepValues: null,
    activeStepEnabled: null,
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
        return { values, meta, [STEP_SYMBOL]: toRaw(step) };
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
    resetActiveStep(input = undefined) {
      const fields = useTrackStore().current?.fields;
      if (!fields) {
        this.activeStepValues = null;
        this.activeStepEnabled = null;
        return;
      }
      const activeStepValues = {};
      const activeStepEnabled = {};

      if (input) {
        debugger;
      }
      for (const field of fields) {
        activeStepEnabled[field.key] = true;

        const fallbackValue = _getFallbackValueForField(field);
        activeStepValues[field.key] = fallbackValue;
      }

      this.activeStepValues = activeStepValues;
      this.activeStepEnabled = activeStepEnabled;
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
        values: _filterDisabled(toRaw(this.activeStepEnabled), toRaw(this.activeStepValues)),
      });
    },
    async updateStep() {
      await updateStep(useCommonStore().userId, useTrackStore().currentId, this.activeStepId, {
        values: _filterDisabled(toRaw(this.activeStepEnabled), toRaw(this.activeStepValues)),
      });
    },
  },
});
