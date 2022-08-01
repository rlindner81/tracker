<template>
  <form
    class="component add-step"
    @submit.prevent="submit"
    v-if="track && newStep"
  >
    <div class="input" v-for="field in track.fields" :key="field._id">
      <div class="optional-wrapper">
        <div
          class="toggle-wrapper"
          v-if="track.fields.some((field) => field.optional)"
        >
          <Toggle v-if="field.optional" />
        </div>
        <div class="choice-wrapper">
          <label>{{ field.name }}</label>
          <input
            type="text"
            v-model="newStep[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="field.input.identifier === 'FIELD' && field.type === 'TEXT'"
          />
          <input
            type="number"
            step="0.00001"
            v-model="newStep[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="field.input.identifier === 'FIELD' && field.type === 'FLOAT'"
          />
          <input
            type="number"
            step="1"
            v-model="newStep[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="
              field.input.identifier === 'FIELD' && field.type === 'INTEGER'
            "
          />
          <select
            v-if="field.input.identifier === 'SELECT'"
            v-model="newStep[field.key]"
          >
            <option
              v-for="option in field.input.parameters.values"
              :key="option.key"
              :value="option.value"
            >
              {{ option.name }}
            </option>
          </select>
          <div class="slider" v-if="field.input.identifier === 'SLIDER'">
            <div class="slider-container">
              <Slider
                :min="
                  field.input.parameters.min
                    ? parseFloat(field.input.parameters.min)
                    : 0
                "
                :max="
                  field.input.parameters.max
                    ? parseFloat(field.input.parameters.max)
                    : 1000
                "
                :step="
                  field.input.parameters.step
                    ? parseFloat(field.input.parameters.step) < 1
                      ? -1
                      : parseFloat(field.input.parameters.step)
                    : 1
                "
                v-model="newStep[field.key]"
              />
            </div>
            <!-- <input
              type="number"
              step="0.00001"
              v-model="newStep[field.key]"
              :placeholder="`Enter ${field.name}`"
              v-if="field.type === 'FLOAT'"
            >
            <input
              type="number"
              step="1"
              v-model="newStep[field.key]"
              :placeholder="`Enter ${field.name}`"
              v-if="field.type === 'INTEGER'"
            > -->
          </div>
        </div>
      </div>
    </div>

    <div class="button-row">
      <button type="button" @click="$emit('closed')">Cancel</button>
      <LoadingButton>Track It</LoadingButton>
    </div>
  </form>
</template>

<script>
import Toggle from "@vueform/toggle";
import Slider from "@vueform/slider";
import { mapState, mapGetters, mapActions } from "vuex";
import LoadingButton from "./LoadingButton";
export default {
  components: {
    Toggle,
    Slider,
    LoadingButton,
  },
  computed: {
    ...mapState("step", { newStep: "new" }),
    ...mapGetters("track", { track: "current" }),
  },
  methods: {
    ...mapActions("step", { create: "create" }),
    ...mapActions("track", { report: "report" }),
    submit() {
      this.create().then(() => {
        this.$emit("tracked");
        this.report();
      });
    },
  },
};
</script>

<style src="@vueform/toggle/themes/default.css"></style>
<style src="@vueform/slider/themes/default.css"></style>
<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.add-step {
  .optional-wrapper {
    .row();

    > * {
      margin: 0 1rem;

      &:first-child {
        width: 3rem;
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
        flex: 1;
      }
    }
  }

  .input {
    margin: 1rem 0;
  }

  .slider-container {
    margin: 3rem 0 1rem 0;
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
