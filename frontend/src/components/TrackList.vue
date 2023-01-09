<script setup lang="ts">
import { useStepStore } from "@/store/step";
import { useTrackStore } from "@/store/track";
import { TRACK_INPUT } from "@/constants";

const trackStore = useTrackStore();
const stepStore = useStepStore();

const selectValue = (field, step) => {
  const matchingSelection = field.input.parameters.values.find(({ value }) => value === step.values[field.key]);
  return matchingSelection ? matchingSelection.name : "";
};
</script>

<template>
  <div class="component track-list steps" v-if="stepStore.steps && stepStore.steps.length > 0">
    <div class="step" v-for="step in stepStore.steps" :key="step._id">
      <div class="values">
        <div class="value" v-for="(field, fieldIndex) in trackStore.current?.fields ?? []" :key="fieldIndex">
          <label>{{ field.name }}</label>
          <span v-if="step.values[field.key] === undefined || step.values[field.key] === null"></span>
          <span
            v-if="
              (step.values[field.key] !== undefined || step.values[field.key] !== null) &&
              field.input.identifier !== TRACK_INPUT.SELECT
            "
            >{{ step.values[field.key] }}</span
          >
          <span
            v-if="
              (step.values[field.key] !== undefined || step.values[field.key] !== null) &&
              field.input.identifier === TRACK_INPUT.SELECT
            "
            >{{ selectValue(field, step) }}</span
          >
        </div>
      </div>
      <div class="master-data">
        <label>Tracked at</label>
        <span :title="$filters.readableDateTime(step.createdAt)">{{
          $filters.readableRelativeDateTime(step.createdAt)
        }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.track-list {
  .step {
    .shadow();
    .row(flex-start, space-between);
    transition: all 0.15s ease-in-out;
    background: @white;
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.5rem;

    .values {
      .row(flex-start);

      .value {
        margin-right: 1rem;
      }
    }

    label {
      font-size: 0.87rem;
      margin-bottom: 0.25rem;
    }

    span {
      font-weight: bold;
    }

    .master-data {
      text-align: end;
    }
  }
}
</style>
