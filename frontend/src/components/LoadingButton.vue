<script setup lang="ts">
import { useCommonStore } from "@/store/common";
import BusyIndicator from "./BusyIndicator.vue";

const commonStore = useCommonStore();
</script>

<template>
  <button class="component loading-button">
    <BusyIndicator v-show="commonStore.isBusy"></BusyIndicator>
    <span v-show="!commonStore.isBusy"><slot></slot></span>
    <span v-show="commonStore.isBusy" class="hidden">Loading ...</span>
  </button>
</template>

<style lang="less">
@import "./../less/variables";

.component.loading-button {
  position: relative;

  span {
    color: @white;
  }

  .hidden {
    opacity: 0;
  }
}
</style>
