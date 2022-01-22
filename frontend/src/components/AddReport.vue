<template>
  <form class="component add-report" @submit.prevent="submit" v-if="track">
    <label>Name</label>
    <input type="text" v-model="newReport.name" />
    <label>Interval</label>
    <select v-model="newReport.interval">
      <option v-for="type in intervals" :key="type">{{ type }}</option>
    </select>

    <label>Aggregations</label>
    <div class="aggregations">
      <div
        class="aggregation"
        v-for="(aggregation, i) in newReport.aggregations"
        :key="i"
      >
        <select v-model="aggregation.type" @input="setKey(i)">
          <option v-for="type in aggregations" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <select v-model="aggregation.field" @input="setKey(i)">
          <option
            v-for="field in track.fields"
            :key="field.key"
            :value="field.key"
          >
            {{ field.name }}
          </option>
        </select>
        <input
          type="hidden"
          :value="aggregation.key"
          placeholder="key"
          :disabled="true"
        />
      </div>
      <button class="add-aggregation" type="button" @click="addAggregation">
        Add Aggregation
      </button>
    </div>
    <div class="button-row">
      <button type="button" @click="$emit('closed')">Cancel</button>
      <LoadingButton>Create</LoadingButton>
    </div>
  </form>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import LoadingButton from "./LoadingButton";
export default {
  components: {
    LoadingButton,
  },
  computed: {
    ...mapState("report", {
      newReport: "new",
      intervals: "intervals",
      aggregations: "aggregations",
    }),
    ...mapGetters("track", { track: "current" }),
  },
  methods: {
    ...mapActions("report", { create: "create" }),
    submit() {
      this.create().then(() => {
        this.$emit("tracked");
      });
    },
    addAggregation() {
      this.newReport.aggregations.push({
        key: null,
        type: this.aggregations[0],
        field: null,
      });
    },
    setKey(index) {
      setTimeout(() => {
        this.newReport.aggregations[
          index
        ].key = `${this.newReport.aggregations[index].type}_${this.newReport.aggregations[index].field}`;
      }, 0);
    },
  },
};
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.add-report {
  .input {
    margin: 1rem 0;
  }
  .aggregation {
    .row();

    input,
    select {
      margin: 0 1rem 0 0;

      &:last-child {
        margin: 0;
      }
    }
  }
  .add-aggregation {
    background: @white;
    border: 1px solid @highlight;
    color: @highlight;
    width: auto;
    margin: 1rem 0;
  }
  .button-row {
    .row();

    > * {
      margin: 0;

      &:first-child {
        margin-right: 1rem;
      }
    }
  }
}
</style>
