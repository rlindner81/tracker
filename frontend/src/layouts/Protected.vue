<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTrackStore } from "@/store/track";
import { useCommonStore } from "@/store/common";
import { logout } from "@/firebase/auth";
import { tracksLoadedPromise, usersLoadedPromise } from "@/firebase/db";
import { useUserStore } from "@/store/user";
import { useStepStore } from "@/store/step";
import AddTrack from "@/components/AddTrack.vue";
import exportFromJSON from "export-from-json";

const router = useRouter();
const route = useRoute();
const commonStore = useCommonStore();
const userStore = useUserStore();
const trackStore = useTrackStore();
const stepStore = useStepStore();

let isInitialized = ref(false);
let isNavVisible = ref(false);
let showTrackMenu = ref(false);
let showEditTrack = ref(false);
let showDeleteConfirmation = ref(false);

let appBarTitle = computed(() => {
  if (route.name === "Track") {
    return trackStore.current?.name ?? "";
  }
  return route.meta?.title ?? "";
});

const onTrackEdit = () => {
  showTrackMenu.value = false;
  showEditTrack.value = true;
};

const onTrackExport = () => {
  showTrackMenu.value = false;
  const data = stepStore.stepsExportRows;
  const fileName = trackStore.current.name;
  const exportType = exportFromJSON.types["csv"];
  exportFromJSON({ data, fileName, exportType });
};

const onTrackDelete = () => {
  showTrackMenu.value = false;
  showDeleteConfirmation.value = true;
};

const onTrackConfirmedDelete = async () => {
  showDeleteConfirmation.value = false;
  await router.replace({ name: "Home" });
  stepStore.unsubscribeSteps();
  await trackStore.deleteTrack();
};

onMounted(async () => {
  userStore.subscribeUsers();
  trackStore.subscribeTracks();
  // TODO this promise approach doesn't really work for the unmount case... is there a better way?
  await Promise.all([usersLoadedPromise, tracksLoadedPromise]);
  isInitialized.value = true;
});
onUnmounted(() => {
  userStore.unsubscribeUsers();
  trackStore.unsubscribeTracks();
  isInitialized.value = false;
});
</script>

<template>
  <v-app>
    <v-app-bar color="primary" :title="appBarTitle">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          v-if="$route.meta.back"
          icon="mdi-chevron-left"
          variant="text"
          @click="$router.push({ name: $route.meta.back })"
        ></v-app-bar-nav-icon>
        <v-app-bar-nav-icon v-else variant="text" @click.stop="isNavVisible = !isNavVisible"></v-app-bar-nav-icon>
      </template>

      <template v-slot:append v-if="$route.name === 'Track'">
        <v-btn icon>
          <v-icon icon="mdi-dots-vertical"></v-icon>
          <v-menu v-model="showTrackMenu" activator="parent">
            <v-list>
              <v-list-item title="Edit" @click="onTrackEdit()" />
              <v-list-item title="Export" @click="onTrackExport()" />
              <v-list-item title="Delete" @click="onTrackDelete()" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <!-- TODO this is painfully slow somehow -->
    <AddTrack :edit="true" :show="showEditTrack" @close="showEditTrack = false"></AddTrack>

    <v-dialog v-model="showDeleteConfirmation" width="auto">
      <v-card>
        <v-card-title>Delete Track</v-card-title>
        <v-card-text>This will delete all step and track data. Are you sure?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="flat" @click="showDeleteConfirmation = false">Close</v-btn>
          <v-btn variant="flat" color="error" @click="onTrackConfirmedDelete()">Confirm Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-navigation-drawer v-model="isNavVisible" temporary>
      <v-list-item class="my-2" :title="commonStore.user?.email || undefined">
        <template v-slot:prepend>
          <v-avatar icon="mdi-account" color="secondary" />
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-subheader :title="$t('entity.track.plural')"></v-list-subheader>
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
          <v-btn color="secondary" style="width: 100%" @click.prevent="logout()">{{ $t("auth.logout") }}</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view v-if="isInitialized" :key="$route.path"></router-view>
    </v-main>
  </v-app>
</template>

<style></style>
