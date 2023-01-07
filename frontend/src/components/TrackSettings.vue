<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import Modal from "./Modal.vue";
import LoadingButton from "./LoadingButton.vue";
import AddTrack from "./AddTrack.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const trackStore = useTrackStore();

let deleteModal = ref(false);
let editModal = ref(false);

const remove = async () => {
  await trackStore.deleteTrack();
  router.replace({ name: "Home" });
};

const toggleDeleteModal = () => {
  deleteModal.value = !deleteModal.value;
};

const toggleEditModal = () => {
  editModal.value = !editModal.value;
};

const exportTrack = () => {
  window.open(`/api/track/${trackStore.current._id}/step/$export`);
};
</script>

<template>
  <div class="component track-settings">
    <h2>Track</h2>
    <button @click="toggleEditModal">Edit Track</button>

    <button @click="exportTrack">Export Tack</button>

    <h2>Danger Zone</h2>
    <button @click="toggleDeleteModal">Delete Track</button>

    <AddTrack :edit="true" v-show="editModal" @close="toggleEditModal"></AddTrack>

    <Modal v-show="deleteModal">
      <p>Do you really want to delete this track?</p>
      <div class="buttons">
        <LoadingButton @click="remove">Delete</LoadingButton>
        <button @click="toggleDeleteModal">Cancel</button>
      </div>
    </Modal>
  </div>
</template>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";
</style>
