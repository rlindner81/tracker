<template>
  <button class="component loading-button">
    <BusyIndicator v-show="busy"></BusyIndicator>
    <span v-show="!busy"><slot></slot></span>
    <span v-show="busy" class="hidden">Loading ...</span>
  </button>
</template>

<script>
import BusyIndicator from './BusyIndicator'
import { mapGetters } from 'vuex'

export default {
  name: 'LoadingButton',
  components: {
    BusyIndicator
  },
  computed: {
    ...mapGetters('busy', ['busy'])
  }
}
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
