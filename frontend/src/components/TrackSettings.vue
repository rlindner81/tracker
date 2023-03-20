<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import Modal from "./Modal.vue";
import AddTrack from "./AddTrack.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import exportFromJSON from "export-from-json";
import { useStepStore } from "@/store/step";

const router = useRouter();
const trackStore = useTrackStore();
const stepStore = useStepStore();

let showDeleteModal = ref(false);
let showEditModal = ref(false);

const toggleShowDeleteModal = () => {
  showDeleteModal.value = !showDeleteModal.value;
};

const toggleShowEditModal = () => {
  showEditModal.value = !showEditModal.value;
};

const onEditTrackClicked = () => {
  trackStore.prepareNewUpdateTrack();
  showEditModal.value = true;
};

const onDeleteClicked = async () => {
  stepStore.unsubscribeSteps();
  await trackStore.deleteTrack();
  await router.replace({ name: "Home" });
};

const exportTrack = () => {
  const data = stepStore.stepsExportRows;
  const fileName = trackStore.current.name;
  const exportType = exportFromJSON.types["csv"];
  exportFromJSON({ data, fileName, exportType });
};
</script>

<template>
  <div class="component track-settings">
    <h2>{{ $t("entity.track.singular") }}</h2>
    <button @click="onEditTrackClicked">
      {{ $t("entity.track.edit") }}
      <!--      <AddTrack :edit="true" v-show="showEditModal" @close="toggleShowEditModal"></AddTrack>-->
    </button>

    <button @click="exportTrack">{{ $t("entity.track.export") }}</button>

    <h2>{{ $t("entity.track.dangerZone") }}</h2>
    <button @click="toggleShowDeleteModal">{{ $t("entity.track.delete") }}</button>

    <Modal v-show="showDeleteModal">
      <p>{{ $t("entity.track.deletionWarning") }}</p>
      <div class="buttons">
        <button @click="onDeleteClicked">{{ $t("action.delete") }}</button>
        <button @click="toggleShowDeleteModal">{{ $t("action.cancel") }}</button>
      </div>
    </Modal>
  </div>
</template>

<style></style>
