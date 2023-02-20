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

<style></style>
