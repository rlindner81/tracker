<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

import Modal from "@/components/Modal.vue";
import AddStep from "@/components/AddStep.vue";
import Tabs from "@/components/Tabs.vue";
import Tab from "@/components/Tab.vue";
import TrackList from "@/components/TrackList.vue";
import TrackSettings from "@/components/TrackSettings.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const trackStore = useTrackStore();
const stepStore = useStepStore();
const route = useRoute();

let addModal = ref(false);

trackStore.clearCurrent();
trackStore.setCurrent(route.params.track);
stepStore.clear();
stepStore.load();

const toggleAddModal = () => {
  addModal.value = !addModal.value;
};
</script>

<template>
  <div class="view tracker">
    <h1>{{ trackStore.titleById($route.params.track) }}</h1>

    <Tabs>
      <Tab title="Tracking" :selected="true">
        <div class="title-with-button">
          <h2>Steps</h2>
          <button @click="toggleAddModal">Add Step</button>
        </div>

        <div class="info" v-if="stepStore.data && !stepStore.data.length">
          <p>You don't have any step tracked yet.</p>
        </div>

        <TrackList></TrackList>
      </Tab>

      <Tab title="Settings">
        <TrackSettings></TrackSettings>
      </Tab>
    </Tabs>

    <Modal v-show="addModal">
      <h2>Add a Step</h2>
      <AddStep @tracked="toggleAddModal" @closed="toggleAddModal"></AddStep>
    </Modal>
  </div>
</template>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.view.tracker {
  .chart-container {
    .size(100%, 100px);
    position: relative;

    > div {
      .size(100%, 100px);
    }
  }

  .component.tabs {
    margin-top: 2rem;
  }

  .title-with-button {
    .row(center, space-between);
    margin-top: 1rem;
    margin-bottom: 1rem;
    button {
      width: auto;
    }
  }

  .report-wrap {
    .size(100%, 300px);
    position: relative;

    > div {
      .size(100%, 300px);
    }

    h2 {
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
    }

    button {
      padding: 0.25rem 0.5rem;
      position: absolute;
      top: 0;
      right: 0;
      width: auto;
      font-size: 0.8rem;
    }
  }

  h2 {
    margin: 1rem 0;
  }

  .info {
    padding: 1rem;
    border: 1px solid @highlight;
    border-radius: 3px;
  }

  .modal-content > *:first-child {
    margin-top: 0;
  }

  .component.modal .buttons {
    .row(center);
    margin-top: 1rem;

    button {
      margin: 0 1rem;
      width: auto;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .delete-modal .button-row {
    .row();
    margin-top: 1rem;
    button {
      margin: 0;
      &:first-child {
        margin-right: 1rem;
      }
    }
  }
}
</style>
