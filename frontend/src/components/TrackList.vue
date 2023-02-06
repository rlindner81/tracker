<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { useStepStore } from "@/store/step";

const userStore = useUserStore();
const stepStore = useStepStore();
</script>

<template>
  <div class="component track-list steps" v-if="stepStore.stepsDisplayRows && stepStore.stepsDisplayRows.length > 0">
    <div class="step" v-for="({ values, meta }, rowIndex) in stepStore.stepsDisplayRows" :key="rowIndex">
      <div class="posted">{{ userStore.emailById(meta.postedBy) || meta.postedBy }} | {{ meta.postedAt }}</div>
      <div class="values">
        <div class="value" v-for="({ label, value }, valuesIndex) in values" :key="valuesIndex">
          <label>{{ label }}</label>
          <span>{{ value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.track-list {
  .step {
    transition: all 0.15s ease-in-out;

    .posted {
    }

    .values {
      padding: 0.25rem 0.5rem;
      margin-bottom: 0.5rem;
      background: @white;
      .shadow();
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
