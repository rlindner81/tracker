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
        v-for="track in trackStore.tracks"
        :key="track._id"
        :to="{ name: 'Track', params: { track: track._id } }"
      >
        <h2 class="heading">{{ track.name }}</h2>
        <div class="subheading-container">
          <span>{{ track.members.length === 1 ? "personal" : `${track.members.length} 🕵🕵` }}</span>
          <!--          <span>{{ track.step_count === 0 ? "new" : `${track.step_count} 👣` }}</span>-->
        </div>
        <!--        TODO re-add when this is implemented-->
        <!--        <span>{{-->
        <!--          !track.stepCount ? "new" : track.stepCount === 1 ? `${track.stepCount} step` : `${track.stepCount} steps`-->
        <!--        }}</span>-->
      </router-link>
    </Tiles>

    <button @click="toggleAddTrack">
      {{ trackStore.tracks.length === 0 ? "Add your first track" : "Add a track" }}
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
  }
  .heading {
    margin: 0.5rem 0;
  }
  .subheading-container {
    margin: 0.15rem 0 0 0;
    > span {
      font-size: smaller;
      text-align: start;
    }
  }
}
</style>
