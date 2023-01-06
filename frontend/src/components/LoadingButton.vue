<template>
  <button class="component loading-button">
    <BusyIndicator v-show="isBusy"></BusyIndicator>
    <span v-show="!isBusy"><slot></slot></span>
    <span v-show="isBusy" class="hidden">Loading ...</span>
  </button>
</template>

<script lang="ts">
import BusyIndicator from "./BusyIndicator.vue";
import { mapGetters } from "pinia";

export default {
  name: "LoadingButton",
  components: {
    BusyIndicator,
  },
  computed: {
    ...mapGetters("common", ["isBusy"]),
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
