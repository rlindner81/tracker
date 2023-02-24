<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useTrackStore } from "@/store/track";
import { useCommonStore } from "@/store/common";
import { logout } from "@/firebase/auth";
import { tracksLoadedPromise, usersLoadedPromise } from "@/firebase/db";
import { useUserStore } from "@/store/user";
import { useRoute } from "vue-router";

const commonStore = useCommonStore();
const userStore = useUserStore();
const trackStore = useTrackStore();
const route = useRoute();

let initialized = ref(false);
let navVisible = ref(false);

onMounted(async () => {
  userStore.subscribeUsers();
  trackStore.subscribeTracks();
  // TODO this promise approach doesn't really work for the unmount case... is there a better way?
  await Promise.all([usersLoadedPromise, tracksLoadedPromise]);
  initialized.value = true;
});
onUnmounted(() => {
  userStore.unsubscribeUsers();
  trackStore.unsubscribeTracks();
  initialized.value = false;
});

const routeStartsWithTrack = computed(() => {
  return route.path.startsWith("/track");
});
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <!--      <template v-slot:image>-->
      <!--        <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>-->
      <!--      </template>-->

      <template v-slot:prepend>
        <v-app-bar-nav-icon
          v-if="!routeStartsWithTrack"
          variant="text"
          @click.stop="navVisible = !navVisible"
        ></v-app-bar-nav-icon>
        <v-app-bar-nav-icon
          v-if="routeStartsWithTrack"
          icon="mdi-chevron-left"
          variant="text"
          @click.stop="navVisible = !navVisible"
          @click="$router.go(-1)"
        ></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title v-if="!routeStartsWithTrack">Tracks</v-app-bar-title>
      <v-app-bar-title v-if="routeStartsWithTrack">Steps</v-app-bar-title>

      <!--      <v-spacer></v-spacer>-->

      <v-btn v-if="!routeStartsWithTrack && trackStore.tracks.length !== 0" prepend-icon="mdi-plus"> Add Track </v-btn>
      <v-btn v-if="routeStartsWithTrack" prepend-icon="mdi-plus"> Add Step </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="navVisible" temporary>
      <v-list-item class="my-2" :title="commonStore.user?.email">
        <template v-slot:prepend>
          <v-avatar color="secondary">
            <span class="text-h6">RL</span>
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-subheader title="Tracks"></v-list-subheader>
        <v-list-item
          v-for="track in trackStore.tracks"
          :key="track._id"
          :title="track.name"
          :value="track._id"
          @click="$router.push({ name: 'Track', params: { track: track._id } })"
        >
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn color="secondary" style="width: 100%" @click.prevent="logout()"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view v-if="initialized" :key="$route.path"></router-view>
    </v-main>
  </v-app>
</template>

<style></style>
