<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

import { useRoute } from "vue-router";
</script>

<template>
  <v-container>
    <div>
      <h1>{{ "This is my page." }}</h1>
      <TrackList></TrackList>
      <TrackSettings></TrackSettings>
    </div>
  </v-container>
</template>

<style></style>
