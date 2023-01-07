<script setup lang="ts">
import { useStepStore } from "@/store/step";
import { useTrackStore } from "@/store/track";

const trackStore = useTrackStore();
const stepStore = useStepStore();

const getField = (key) => {
  return (
    trackStore.current && trackStore.current.fields && trackStore.current.fields.find((field) => field.key === key)
  );
};

const getFieldName = (key) => {
  const field = getField(key);
  return field && field.name;
};

const getInputIdentifier = (key) => {
  const field = getField(key);
  return field && field.input && field.input.identifier;
};

const getInputParameterValueName = (key, value) => {
  const field = getField(key);
  const matchingValue =
    field &&
    field.input &&
    field.input.parameters &&
    field.input.parameters.values &&
    field.input.parameters.values.find((v) => String(v.value) === String(value));
  return matchingValue && matchingValue.name;
};
</script>

<template>
  <div class="component track-list steps" v-if="stepStore.data && stepStore.data.length > 0">
    <div class="step" v-for="step in stepStore.data" :key="step._id">
      <div class="values">
        <div class="value" v-for="(value, key) in step.values" :key="key">
          <label>{{ getFieldName(key) }}</label>
          <span v-if="value === undefined || value === null">n/a</span>
          <span v-if="value !== undefined && value !== null && getInputIdentifier(key) !== 'SELECT'">{{ value }}</span>
          <span v-if="value !== undefined && value !== null && getInputIdentifier(key) === 'SELECT'">{{
            getInputParameterValueName(key, value)
          }}</span>
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
