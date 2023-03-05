<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

import AddStep from "@/components/AddStep.vue";
import Tabs from "@/components/Tabs.vue";
import Tab from "@/components/Tab.vue";
import TrackList from "@/components/TrackList.vue";
import TrackSettings from "@/components/TrackSettings.vue";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const trackStore = useTrackStore();
const stepStore = useStepStore();
const route = useRoute();

const onAddStepClicked = () => {
  stepStore.resetNewStepValues();
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
    <div>
      <h1>{{ trackStore.titleById($route.params.track) }}</h1>

      <Tabs>
        <Tab :title="$t('nav.tab.tracking')" :selected="true">
          <div>
            <h2>{{ $t("nav.tab.settings") }}</h2>
          </div>

          <div v-if="stepStore.steps && !stepStore.steps.length">
            <p>{{ $t("entity.step.noData") }}</p>
          </div>

          <TrackList></TrackList>
        </Tab>

        <Tab :title="$t('nav.tab.settings')">
          <TrackSettings></TrackSettings>
        </Tab>
      </Tabs>
    </div>

    <v-btn @click="onAddStepClicked" class="mb-5 mr-5" position="fixed" location="bottom right" icon color="secondary">
      <v-icon>mdi-plus</v-icon>
      <AddStep></AddStep>
    </v-btn>
  </v-container>
</template>

<style></style>
