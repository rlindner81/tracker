<script setup lang="ts">
import { useStepStore } from "@/store/step";

const stepStore = useStepStore();
</script>

<template>
  <div class="component track-list steps" v-if="stepStore.stepsDisplayRows && stepStore.stepsDisplayRows.length > 0">
    <div class="step" v-for="(row, rowIndex) in stepStore.stepsDisplayRows" :key="rowIndex">
      <div class="values">
        <div class="value" v-for="({ label, value }, valuesIndex) in row.values" :key="valuesIndex">
          <label>{{ label }}</label>
          <span>{{ value }}</span>
        </div>
      </div>
      <div class="master-data" v-for="({ label, value }, metaIndex) in row.meta" :key="metaIndex">
        <label>{{ label }}</label>
        <span :title="value">{{ value }}</span>
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
