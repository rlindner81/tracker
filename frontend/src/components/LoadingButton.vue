<template>
  <button class="component loading-button">
    <BusyIndicator v-show="isBusy"></BusyIndicator>
    <span v-show="!isBusy"><slot></slot></span>
    <span v-show="isBusy" class="hidden">Loading ...</span>
  </button>
</template>

<script>
import BusyIndicator from "./BusyIndicator";
import { mapGetters } from "vuex";

export default {
  name: "LoadingButton",
  components: {
    BusyIndicator,
  },
  computed: {
    ...mapGetters("busy", ["isBusy"]),
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
