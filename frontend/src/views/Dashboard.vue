<script setup lang="ts">
import { ref } from "vue";
import { useTrackStore } from "@/store/track";
import Tiles from "@/components/Tiles.vue";
import AddTrack from "@/components/AddTrack.vue";

const trackStore = useTrackStore();
let showAddTrack = ref(false);

const toggleAddTrack = () => {
  showAddTrack.value = !showAddTrack.value;
};
</script>

<template>
  <div class="view dashboard">
    <h1>Dashboard</h1>

    <Tiles>
      <router-link
        class="track"
        v-for="track in trackStore.data"
        :key="track._id"
        :to="{ name: 'Track', params: { track: track._id } }"
      >
        <h2>{{ track.name }}</h2>
        <span>{{
          !track.stepCount ? "new" : track.stepCount === 1 ? `${track.stepCount} step` : `${track.stepCount} steps`
        }}</span>
      </router-link>
    </Tiles>

    <button @click="toggleAddTrack">
      {{ trackStore.data.length === 0 ? "Add your first track" : "Add a track" }}
    </button>

    <AddTrack v-show="showAddTrack" @close="toggleAddTrack"></AddTrack>
  </div>
</template>

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
