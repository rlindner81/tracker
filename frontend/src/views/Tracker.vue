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
import { useI18n } from "vue-i18n";

const trackStore = useTrackStore();
const stepStore = useStepStore();
const route = useRoute();
const { t } = useI18n();

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
  <div class="view tracker">
    <h1>{{ trackStore.titleById($route.params.track) }}</h1>

    <Tabs>
      <Tab :title="$t('tabs.tracking')" :selected="true">
        <div class="title-with-button">
          <h2>{{ $t("step.plural") }}</h2>
          <button @click="onAddStepClicked">{{ $t("step.add") }}</button>
        </div>

        <div class="info" v-if="stepStore.steps && !stepStore.steps.length">
          <p>{{ $t("step.noData") }}</p>
        </div>

        <TrackList></TrackList>
      </Tab>

      <Tab :title="$t('tabs.settings')">
        <TrackSettings></TrackSettings>
      </Tab>
    </Tabs>

    <Modal v-show="showAddStepModal">
      <h2>{{ $t("step.add") }}</h2>
      <AddStep @tracked="toggleShowAddStepModal" @closed="toggleShowAddStepModal"></AddStep>
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
