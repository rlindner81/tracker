<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

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
    <AddStep :isVisible="showAddStepModal" @tracked="toggleShowAddStepModal" @closed="toggleShowAddStepModal"></AddStep>
    <v-btn
      @click="onAddStepClicked"
      class="mb-5 mr-5"
      position="fixed"
      location="bottom right"
      icon="mdi-plus"
      color="secondary"
    />

    <div>
      <h1>{{ trackStore.titleById($route.params.track) }}</h1>

      <Tabs>
        <Tab title="Tracking" :selected="true">
          <div>
            <h2>Steps</h2>
          </div>

          <div v-if="stepStore.steps && !stepStore.steps.length">
            <p>You don't have any step tracked yet.</p>
          </div>

          <TrackList></TrackList>
        </Tab>

        <Tab title="Settings">
          <TrackSettings></TrackSettings>
        </Tab>
      </Tabs>
    </div>
  </v-container>
</template>

<style></style>
