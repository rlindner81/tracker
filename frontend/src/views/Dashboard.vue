<template>
  <div class="view dashboard">
    <h1>Dashboard</h1>

    <Tiles>
      <router-link
        class="track"
        v-for="track in tracks"
        :key="track._id"
        :to="`/${track._id}`"
      >
        <h2>{{ track.name }}</h2>
        <span>{{ track.stepCount }} steps</span>
      </router-link>
    </Tiles>

    <h2>{{ tracks.length === 0 ? 'Add your first track' : 'Add a track' }}</h2>

    <AddTrack></AddTrack>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Tiles from '../components/Tiles'
import AddTrack from '../components/AddTrack'

export default {
  components: {
    Tiles, AddTrack
  },
  computed: {
    ...mapState('track', { tracks: 'data', types: 'types' })
  },
  methods: {
    ...mapActions('track', { create: 'create' })
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

      @media @small {
        .size(~"calc(50% - 2rem)", 6rem);
      }
    }
  }

  > h2 {
    margin: 1rem 0;
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
