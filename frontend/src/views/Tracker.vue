<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

import { STEP_SYMBOL } from "@/constants";
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import AddOrEditStep from "@/components/AddOrEditStep.vue";

const userStore = useUserStore();
const trackStore = useTrackStore();
const stepStore = useStepStore();
const route = useRoute();

let showStepModal = ref(false);

const onAddStepClicked = () => {
  showStepModal.value = true;
  stepStore.resetNewStepValues();
};

const onEditStepClicked = (step) => {
  showStepModal = true;
  console.log("hit edit step");
  debugger;
};

const headers = computed(() => {
  const trackFields = trackStore.current?.fields;
  if (!trackFields) return [];
  const metaFields = [
    { name: "Tracked By", key: "postedBy" },
    { name: "Tracked On", key: "postedAt" },
    { name: "Edit", key: "edit", sortable: false },
  ];
  return trackFields.concat(metaFields).map((field) => ({
    title: field.name,
    key: field.key,
    align: field.align ?? "start",
    sortable: field.sortable ?? true,
  }));
});

const rows = computed(() => {
  return !stepStore.stepsDisplayRows.length
    ? []
    : stepStore.stepsDisplayRows.map(({ values, meta, [STEP_SYMBOL]: step }) => ({
        ...values,
        ...meta,
        [STEP_SYMBOL]: step,
      }));
});

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
  <div>
    <v-data-table
      :v-if="rows.length"
      items-per-page="20"
      :headers="headers"
      :items="rows"
      item-value="name"
      class="elevation-2"
    >
      <template v-slot:item.edit="{ item }">
        <v-btn class="me-3" icon color="secondary" @click="onEditStepClicked(item)">
          <v-icon>mdi-pencil</v-icon>
          <AddOrEditStep :edit="true" :show="showStepModal" @close="showStepModal = false"></AddOrEditStep>
        </v-btn>
        <!--        <v-icon class="" @click="editStep(item)"> mdi-pencil </v-icon>-->
      </template>
    </v-data-table>
    <v-btn class="mb-5 mr-5" position="fixed" location="bottom right" icon color="secondary" @click="onAddStepClicked">
      <v-icon>mdi-plus</v-icon>
      <AddOrEditStep :edit="false" :show="showStepModal" @close="showStepModal = false"></AddOrEditStep>
    </v-btn>
  </div>
</template>

<style></style>
