<script setup lang="ts">
import { ref } from "vue";
import { useTrackStore } from "@/store/track";
import AddTrack from "@/components/AddTrack.vue";

const trackStore = useTrackStore();
let showAddTrack = ref(false);

const toggleAddTrack = () => {
  showAddTrack.value = !showAddTrack.value;
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="track in trackStore.tracks" :key="track._id" cols="12" sm="6" md="4" lg="3">
        <v-card style="min-height: 10rem" :to="{ name: 'Track', params: { track: track._id } }" elevation="4">
          <v-card-title class="text-center text-h5 ma-4 my-6">
            <div>{{ track.name }}</div>
          </v-card-title>
          <v-card-text class="text-center text-h6">
            {{ track.members.length === 1 ? "personal" : `${track.members.length} 🕵🕵` }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="trackStore.tracks.length === 0" cols="12" sm="4">
        <v-card style="min-height: 10rem" elevation="4">
          <v-card-title class="text-center text-h5 ma-4 my-6">
            <div>Add your first track</div>
          </v-card-title>
          <v-card-text class="text-center text-h6"> <v-icon icon="mdi-plus"></v-icon> </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <AddTrack v-show="false" @close="toggleAddTrack"></AddTrack>

  <!--  <div class="view dashboard">-->
  <!--    <h1>Dashboard</h1>-->

  <!--    <Tiles>-->
  <!--      <router-link-->
  <!--        class="track"-->
  <!--        v-for="track in trackStore.tracks"-->
  <!--        :key="track._id"-->
  <!--        :to="{ name: 'Track', params: { track: track._id } }"-->
  <!--      >-->
  <!--        <h2 class="heading">{{ track.name }}</h2>-->
  <!--        <div class="subheading-container">-->
  <!--          <span>{{ track.members.length === 1 ? "personal" : `${track.members.length} 🕵🕵` }}</span>-->
  <!--          &lt;!&ndash;          <span>{{ track.step_count === 0 ? "new" : `${track.step_count} 👣` }}</span>&ndash;&gt;-->
  <!--        </div>-->
  <!--        &lt;!&ndash;        TODO re-add when this is implemented&ndash;&gt;-->
  <!--        &lt;!&ndash;        <span>{{
    &ndash;&gt;-- >
    < !-- &lt; ! & ndash;          !track.stepCount ? "new" : track.stepCount === 1 ? `${track.stepCount} step` : `${track.stepCount} steps` & ndash;&gt;-- >
    < !-- &lt; ! & ndash;
  }}</span>&ndash;&gt;-->
  <!--      </router-link>-->
  <!--    </Tiles>-->

  <!--    <button @click="toggleAddTrack">-->
  <!--      {{ trackStore.tracks.length === 0 ? "Add your first track" : "Add a track" }}-->
  <!--    </button>-->

  <!--    <AddTrack v-show="showAddTrack" @close="toggleAddTrack"></AddTrack>-->
  <!--  </div>-->
</template>

<style></style>
