<template>
  <form class="component add-step" @submit.prevent="submit" v-if="track && newStep">
    <div
      class="input"
      v-for="field in track.fields"
      :key="field._id"
    >
      <label>{{ field.name }}</label>
      <input
        type="text"
        v-model="newStep[field.key]"
        :placeholder="`Enter ${field.name}`"
        v-if="field.type.identifier !== 'SELECT_SINGLE'"
      >
      <select
        v-else
        v-model="newStep[field.key]"
      >
        <option
          v-for="option in field.type.parameters.values"
          :key="option.key"
          :value="option.value"
        >{{ option.name }}</option>
      </select>
    </div>

    <LoadingButton>Track It</LoadingButton>
  </form>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import LoadingButton from './LoadingButton'
export default {
  components: {
    LoadingButton
  },
  computed: {
    ...mapState('step', { newStep: 'new' }),
    ...mapGetters('track', { track: 'current' })
  },
  methods: {
    ...mapActions('step', { create: 'create' }),
    submit () {
      this.create()
        .then(() => {
          this.$emit('tracked')
        })
    }
  }
}
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.add-step {
  .input {
    margin: 1rem 0;
  }
}
</style>
