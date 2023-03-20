<script setup lang="ts">
import { ref } from "vue";
import { useTrackStore } from "@/store/track";
import AddTrack from "@/components/AddTrack.vue";

const trackStore = useTrackStore();

let showAddTrack = ref(false);
</script>

<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col v-for="track in trackStore.tracks" :key="track._id" cols="12" sm="6" md="4" lg="3">
          <v-card style="min-height: 10rem" :to="{ name: 'Track', params: { track: track._id } }" elevation="3">
            <v-card-title class="text-center text-h5 ma-4 my-6">
              <div>{{ track.name }}</div>
            </v-card-title>
            <v-card-text class="text-center text-h6">
              {{ track.members.length === 1 ? "personal" : `${track.members.length} 🕵🕵` }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="trackStore.tracks.length === 0" cols="12" sm="4">
          <v-card style="min-height: 10rem" elevation="3">
            <v-card-title class="text-center text-h5 ma-4 my-6">
              <div>{{ $t("entity.track.first") }}</div>
            </v-card-title>
            <v-card-text class="text-center text-h6"> <v-icon icon="mdi-plus"></v-icon> </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-btn class="mb-5 mr-5" position="fixed" location="bottom right" icon color="primary" @click="showAddTrack = true">
      <v-icon>mdi-plus</v-icon>
      <AddTrack :edit="false" :show="showAddTrack" @close="showAddTrack = false"></AddTrack>
    </v-btn>
  </div>
</template>

<style></style>
