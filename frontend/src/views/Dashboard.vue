<template>
  <div class="view dashboard">
    <h1>Dashboard</h1>

    <Tiles>
      <router-link
        class="track"
        v-for="track in tracks"
        :key="track._id"
        :to="`/tracker/${track._id}`"
      >
        <h2>{{ track.name }}</h2>
        <span>{{ track.stepCount }} steps</span>
      </router-link>
    </Tiles>

    <h2>Add a new Track</h2>

    <form @submit.prevent="create">
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
          <label>Type</label>
          <select v-model="field.type.identifier">
            <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
          </select>
          <label>Field Name</label>
          <input
            type="text"
            v-model="field.name"
            placeholder="Enter a name ..."
            @input="field.key = slugify($event.target.value)"
          >
          <label>Field Key</label>
          <input type="text" :value="field.key" :disabled="true">
          <button type="button" class="remove" @click="removeField(i)">Remove Field</button>
        </div>

        <button class="add-field" type="button" @click="addField">Add Field</button>
      </div>

      <LoadingButton>Create Track</LoadingButton>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Tiles from '../components/Tiles'
import LoadingButton from '../components/LoadingButton'

export default {
  components: {
    Tiles, LoadingButton
  },
  computed: {
    ...mapState('track', { tracks: 'data', track: 'new', types: 'types' })
  },
  methods: {
    ...mapActions('track', { create: 'create' }),
    ...mapMutations('track', { addField: 'addField', removeField: 'removeField' }),
    slugify (str) {
      str = str.replace(/^\s+|\s+$/g, '') // trim
      str = str.toLowerCase()

      // remove accents, swap ñ for n, etc
      var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
      var to = 'aaaaeeeeiiiioooouuuunc------'
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      }

      str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes

      return str
    }
  }
}
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.view.dashboard {
  > .tiles .tiles-container {
    .track {
      .column(center, center);
      .size(~"calc(25% - 2rem)", 6rem);
      .shadow();
      transition: all 0.2s ease-in-out;
      margin: 1rem;
      background: white;
    }
  }

  > h2 {
    margin: 1rem 0;
  }

  > form {
    .general {
      .shadow();
      background: @white;
      padding: 1rem;
    }
  }

  .fields {
    .column(flex-end);

    input, select, label, .field {
      width: 100%;

      &[disabled] {
        background: #efefef;
        cursor: not-allowed;
      }
    }

    .field {
      .shadow();
      margin: 1rem auto;
      padding: 1rem;
      background: @white;
      position: relative;

      .remove {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.1rem 0.3rem;
        width: auto;
        margin: 0;
        font-size: 0.8rem;
      }
    }

    .add-field {
      width: 150px;
      margin: 0.5rem 0;
      border: 1px solid @highlight;
      background: @white;
      color: @highlight;
    }
  }
}
</style>
