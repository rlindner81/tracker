<template>
  <form @submit.prevent="create" class="component add-track">
    <div class="general">
      <label>Name</label>
      <input type="text" v-model="track.name" placeholder="Enter a name ...">
    </div>
    <div class="fields">
      <div
        class="field"
        v-for="(field, i) in track.fields"
        :key="i"
      >
        <label>Field Name</label>
        <input
          type="text"
          v-model="field.name"
          placeholder="Enter a name ..."
          @input="field.key = slugify($event.target.value)"
        >

        <label>Field Key</label>
        <input type="text" :value="field.key" :disabled="true">

        <label>Type</label>
        <select v-model="field.type.identifier">
          <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
        </select>

        <div class="select" v-if="field.type.identifier === 'SELECT'">
          <div
            class="value"
            v-for="(value, i) in field.type.parameters.values"
            :key="i"
          >
            <input type="text" placeholder="Name" v-model="value.name" @input="value.key = slugify(value.name)" />
            <input type="text" placeholder="Key" :disabled="true" :value="value.key" />
            <input type="text" placeholder="Value" v-model="value.value" />
          </div>
          <button type="button" @click="addValue(field)">Add Value</button>

          <label>Default Selection</label>
          <select v-model="field.type.parameters.selected">
            <option :value="null"></option>
            <option
              v-for="option in field.type.parameters.values"
              :key="option.key"
              :value="option.value"
            >{{ option.name }}</option>
          </select>
        </div>

        <button type="button" class="remove" @click="removeField(i)">Remove Field</button>
      </div>

      <button class="add-field" type="button" @click="addField">Add Field</button>
    </div>

    <LoadingButton>Create Track</LoadingButton>
  </form>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LoadingButton from './LoadingButton'
export default {
  components: {
    LoadingButton
  },
  computed: {
    ...mapState('track', { track: 'new', types: 'types' })
  },
  methods: {
    ...mapActions('track', { create: 'create' }),
    ...mapMutations('track', { addField: 'addField', removeField: 'removeField' }),
    addValue (field) {
      field.type.parameters.values.push({
        key: null,
        name: null,
        value: null
      })
    },
    slugify (str) {
      str = str.replace(/^\s+|\s+$/g, '') // trim
      str = str.toLowerCase()

      // remove accents, swap ñ for n, etc
      var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
      var to = 'aaaaeeeeiiiioooouuuunc______'
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      }

      str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '_') // collapse whitespace and replace by -
        .replace(/-+/g, '_') // collapse dashes

      return str
    }
  }
}
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.add-track {
  .general {
    .shadow();
    background: @white;
    padding: 1rem;
  }

  .value {
    .row(flex-start, space-between);
    margin: 0.5rem 0;
    input {
      margin: 0 1rem 0 0;

      &:last-child {
        margin: 0;
      }
    }
  }
}
</style>
