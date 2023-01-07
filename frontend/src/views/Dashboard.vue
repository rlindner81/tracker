<template>
  <div class="view dashboard">
    <h1>Dashboard</h1>

    <Tiles>
      <router-link class="track" v-for="track in tracks" :key="track._id" :to="`/${track._id}`">
        <h2>{{ track.name }}</h2>
        <span>{{
          !track.stepCount ? "new" : track.stepCount === 1 ? `${track.stepCount} step` : `${track.stepCount} steps`
        }}</span>
      </router-link>
    </Tiles>

    <button @click="toggleAddTrack">
      {{ tracks.length === 0 ? "Add your first track" : "Add a track" }}
    </button>

    <AddTrack v-show="showAddTrack" @close="toggleAddTrack"></AddTrack>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import Tiles from "@/components/Tiles.vue";
import AddTrack from "@/components/AddTrack.vue";
import { useTrackStore } from "@/store/track";

export default {
  data() {
    return {
      showAddTrack: false,
    };
  },
  components: {
    Tiles,
    AddTrack,
  },
  computed: {
    ...mapState(useTrackStore, { tracks: "data", types: "types" }),
  },
  methods: {
    ...mapActions(useTrackStore, { create: "create" }),
    toggleAddTrack() {
      this.showAddTrack = !this.showAddTrack;
    },
  },
};
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
}
</style>
