<template>
  <div class="component track-list steps" v-if="steps && steps.length > 0">
    <div
      class="step"
      v-for="step in steps"
      :key="step._id"
    >
      <div class="values">
        <div
          class="value"
          v-for="(value, key) in step.values"
          :key="key"
        >
          <label>{{ track.fields.find(field => field.key === key).name }}</label>
          <span v-if="getInputIdentifier(key) !== 'SELECT'">{{ value }}</span>
          <span v-if="getType(key) === 'TEXT' && getInputIdentifier(key) === 'SELECT'">{{ getField(key).input.parameters.values.find(v => v.value.toString() === value.toString()).name }}</span>
          <span v-if="getType(key) !== 'TEXT' && getInputIdentifier(key) === 'SELECT'">{{ getField(key).input.parameters.values.find(v => v.value.toString() === value.toString()).name + ` (${value})` }}</span>
        </div>
      </div>
      <div class="master-data">
        <label>Tracked at</label>
        <span :title="step.createdAt | date">{{ step.createdAt | relativeDate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState('step', { steps: 'data' }),
    ...mapGetters('track', { track: 'current' })
  },
  methods: {
    getInputIdentifier (key) {
      let field = this.getField(key)

      return field ? field.input.identifier : null
    },
    getType (key) {
      let field = this.getField(key)

      return field ? field.type : null
    },
    getField (key) {
      return this.track.fields.find(field => field.key === key)
    }
  }
}
</script>

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
