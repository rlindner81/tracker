<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

import Modal from "@/components/Modal.vue";
import AddStep from "@/components/AddStep.vue";
import Tabs from "@/components/Tabs.vue";
import Tab from "@/components/Tab.vue";
import TrackList from "@/components/TrackList.vue";
import TrackSettings from "@/components/TrackSettings.vue";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useRoute } from "vue-router";

const trackStore = useTrackStore();
const stepStore = useStepStore();
const route = useRoute();

let showAddStepModal = ref(false);

const toggleShowAddStepModal = () => {
  showAddStepModal.value = !showAddStepModal.value;
};

const onAddStepClicked = () => {
  stepStore.resetNewStepValues();
  showAddStepModal.value = true;
};

onBeforeMount(() => {
  trackStore.setCurrentId(route.params.track);
  stepStore.resetNewStepValues();
  stepStore.subscribeSteps();
});

onBeforeUnmount(() => {
  stepStore.unsubscribeSteps();
});
</script>

<template>
  <v-container>
    <AddStep :addStepDialogIsVisible="showAddStepModal" @closed="toggleShowAddStepModal"></AddStep>
    <v-btn
      @click="toggleShowAddStepModal"
      style="position: fixed; bottom: 15px; right: 15px"
      icon="mdi-plus"
      color="secondary"
    ></v-btn>
    <div class="view tracker">
      <h1>{{ trackStore.titleById($route.params.track) }}</h1>

      <Tabs>
        <Tab title="Tracking" :selected="true">
          <div class="title-with-button">
            <h2>Steps</h2>
            <button @click="onAddStepClicked">Add Step</button>
          </div>

          <div class="info" v-if="stepStore.steps && !stepStore.steps.length">
            <p>You don't have any step tracked yet.</p>
          </div>

          <TrackList></TrackList>
        </Tab>

        <Tab title="Settings">
          <TrackSettings></TrackSettings>
        </Tab>
      </Tabs>

      <!-- <Modal v-show="showAddStepModal">
        <h2>Add a Step</h2>
        <AddStep @tracked="toggleShowAddStepModal" @closed="toggleShowAddStepModal"></AddStep>
      </Modal> -->
    </div>
  </v-container>
</template>

<style></style>
