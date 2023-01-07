<template>
  <button class="component loading-button">
    <BusyIndicator v-show="isBusy"></BusyIndicator>
    <span v-show="!isBusy"><slot></slot></span>
    <span v-show="isBusy" class="hidden">Loading ...</span>
  </button>
</template>

<script lang="ts">
import BusyIndicator from "./BusyIndicator.vue";
import { mapState } from "pinia";
import { useCommonStore } from "@/store/common";

export default {
  name: "LoadingButton",
  components: {
    BusyIndicator,
  },
  computed: {
    ...mapState(useCommonStore, ["isBusy"]),
  },
};
</script>

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
