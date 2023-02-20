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
let navVisible = ref(false);

const toggleNav = () => {
  navVisible.value = !navVisible.value;
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
  <v-app>
    <v-app-bar color="primary">
      <!--      <template v-slot:image>-->
      <!--        <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>-->
      <!--      </template>-->

      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="navVisible = !navVisible"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Tracks</v-app-bar-title>

      <!--      <v-spacer></v-spacer>-->

      <!--      <v-btn icon>-->
      <!--        <v-icon>mdi-heart</v-icon>-->
      <!--      </v-btn>-->
    </v-app-bar>

    <v-navigation-drawer v-model="navVisible" permanent>
      <v-list-item class="my-2" :title="commonStore.user?.email">
        <template v-slot:prepend>
          <v-avatar color="primary">
            <span class="text-h6">RL</span>
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-subheader title="Tracks"> </v-list-subheader>
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
          <v-btn style="width: 100%" @click.prevent="logout()"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <!--      <v-container fluid>-->
      <!--        <v-row dense>-->
      <!--          <v-col v-for="n in 4" :key="n" cols="12">-->
      <!--            <v-card-->
      <!--              :title="`Content ${n}`"-->
      <!--              :subtitle="`Subtitle for Content ${n}`"-->
      <!--              text="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"-->
      <!--            ></v-card>-->
      <!--          </v-col>-->
      <!--        </v-row>-->
      <!--        <router-view v-if="initialized" :key="$route.path"></router-view>-->
      <!--      </v-container>-->
    </v-main>
    <!--    <v-container fluid class="fill-height">-->
    <!--      <v-layout class="align-center justify-center">-->
    <!--        <v-flex style="width: 350px">-->
    <!--          <v-card>-->
    <!--            <v-card-text>-->
    <!--              <div class="text-center mb-6">-->
    <!--                <img src="../assets/logo.png" />-->
    <!--              </div>-->

    <!--              <transition name="fade" mode="out-in">-->
    <!--                <router-view></router-view>-->
    <!--              </transition>-->
    <!--            </v-card-text>-->
    <!--          </v-card>-->
    <!--        </v-flex>-->
    <!--      </v-layout>-->
    <!--    </v-container>-->
  </v-app>

  <!--  <div class="layout protected">-->
  <!--    <div class="letter-box">-->
  <!--      <nav :data-open="mobileNavVisible || null">-->
  <!--        <router-link :to="{ name: 'Home' }">Dashboard</router-link>-->

  <!--        <h1>Tracks</h1>-->

  <!--        <router-link-->
  <!--          v-for="track in trackStore.tracks"-->
  <!--          :key="track._id"-->
  <!--          :to="{ name: 'Track', params: { track: track._id } }"-->
  <!--          >{{ track.name }}</router-link-->
  <!--        >-->

  <!--        <p v-if="commonStore.user" class="logout">-->
  <!--          Logged in as {{ commonStore.user?.email }}-->
  <!--          <button @click.prevent="logout()">Logout</button>-->
  <!--        </p>-->
  <!--      </nav>-->

  <!--      <main></main>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style></style>
