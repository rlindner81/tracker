<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useTrackStore } from "@/store/track";
import { useCommonStore } from "@/store/common";
import { logout } from "@/firebase/auth";
import { tracksLoadedPromise, usersLoadedPromise } from "@/firebase/db";
import { useUserStore } from "@/store/user";

const commonStore = useCommonStore();
const userStore = useUserStore();
const trackStore = useTrackStore();

let initialized = ref(false);
let mobileNavVisible = ref(false);

const toggleMobileNav = () => {
  mobileNavVisible.value = !mobileNavVisible.value;
};

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
</script>

<template>
  <div class="layout protected">
    <div class="letter-box">
      <nav :data-open="mobileNavVisible || null">
        <router-link :to="{ name: 'Home' }">Dashboard</router-link>

        <h1>Tracks</h1>

        <router-link
          v-for="track in trackStore.tracks"
          :key="track._id"
          :to="{ name: 'Track', params: { track: track._id } }"
          >{{ track.name }}</router-link
        >

        <p v-if="commonStore.user" class="logout">
          Logged in as {{ commonStore.user?.email }}
          <button @click.prevent="logout()">Logout</button>
        </p>

        <div class="toggle-nav" @click="toggleMobileNav">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>

      <main>
        <router-view v-if="initialized" :key="$route.path"></router-view>
      </main>
    </div>
  </div>
</template>

<style></style>
