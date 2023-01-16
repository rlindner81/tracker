<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import Modal from "./Modal.vue";
import LoadingButton from "./LoadingButton.vue";
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
    <h2>Track</h2>
    <button @click="onEditTrackClicked">Edit Track</button>

    <button @click="exportTrack">Export Tack</button>

    <h2>Danger Zone</h2>
    <button @click="toggleShowDeleteModal">Delete Track</button>

    <AddTrack :edit="true" v-show="showEditModal" @close="toggleShowEditModal"></AddTrack>

    <Modal v-show="showDeleteModal">
      <p>Do you really want to delete this track?</p>
      <div class="buttons">
        <LoadingButton @click="onDeleteClicked">Delete</LoadingButton>
        <button @click="toggleShowDeleteModal">Cancel</button>
      </div>
    </Modal>
  </div>
</template>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";
</style>
