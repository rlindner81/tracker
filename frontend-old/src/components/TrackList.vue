<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { useStepStore } from "@/store/step";
import { useCommonStore } from "@/store/common";

const commonStore = useCommonStore();
const userStore = useUserStore();
const stepStore = useStepStore();
</script>

<template>
  <div class="component track-list steps" v-if="stepStore.stepsDisplayRows && stepStore.stepsDisplayRows.length > 0">
    <div class="step" v-for="({ values, meta }, rowIndex) in stepStore.stepsDisplayRows" :key="rowIndex">
      <div class="posted" :class="{ other: meta.postedBy !== commonStore.userId }">
        {{ userStore.emailById(meta.postedBy) || meta.postedBy }} | {{ meta.postedAt }}
      </div>
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
      padding: 0.25rem 0.5rem;
      font-size: smaller;
    }
    .other {
      text-align: end;
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
      font-size: smaller;
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
