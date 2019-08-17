<template>
  <div class="view tracker">
    <h1>{{ title($route.params.track) }}</h1>

    <div class="chart-container">
      <ActivityChart></ActivityChart>
    </div>

    <form @submit.prevent="track">
      <button>Track It</button>
    </form>

    <h2>Steps</h2>
    <div class="steps">

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ActivityChart from '../components/ActivityChart'

export default {
  components: {
    ActivityChart
  },
  computed: {
    ...mapGetters('track', { title: 'titleById' })
  },
  methods: {
    ...mapActions('track', { track: 'create' })
  }
}
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.view.tracker {
  .chart-container {
    .size(100%, 100px);
    position: relative;

    > div {
      .size(100%, 100px);
    }
  }
}
</style>
