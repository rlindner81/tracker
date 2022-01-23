<template>
  <div class="view tracker">
    <h1>{{ title($route.params.track) }}</h1>

    <Tabs>
      <Tab name="Tracking" :selected="true">
        <div class="title-with-button">
          <h2>Steps</h2>
          <button @click="toggleAddModal">Add Step</button>
        </div>

        <div class="info" v-if="steps && !steps.length">
          <p>You don't have any step tracked yet.</p>
        </div>

        <TrackList></TrackList>
      </Tab>

      <Tab name="Settings">
        <TrackSettings></TrackSettings>
      </Tab>
    </Tabs>

    <Modal v-show="addModal">
      <h2>Add a Step</h2>
      <AddStep @tracked="onTrackCreated" @closed="toggleAddModal"></AddStep>
    </Modal>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import Modal from "../components/Modal";
import AddStep from "../components/AddStep";
import Tabs from "../components/Tabs";
import Tab from "../components/Tab";
import TrackList from "../components/TrackList";
import TrackSettings from "../components/TrackSettings";

export default {
  components: {
    Modal,
    AddStep,
    Tabs,
    Tab,
    TrackList,
    TrackSettings,
  },
  data() {
    return {
      addModal: false,
      reportModal: false,
      deleteModal: false,
    };
  },
  created() {
    this.clearTrack();
    this.clear();
    this.setCurrent(this.$route.params.track);
    this.load();
  },
  computed: {
    ...mapState("step", { newStep: "new", steps: "data" }),
    ...mapGetters("track", { title: "titleById", track: "current" }),
  },
  methods: {
    ...mapActions("track", { report: "report" }),
    ...mapMutations("track", {
      setCurrent: "setCurrent",
      clearTrack: "clearCurrent",
    }),
    ...mapActions("step", { load: "load" }),
    ...mapMutations("step", { clear: "clear" }),
    toggleAddModal() {
      this.addModal = !this.addModal;
    },
    onTrackCreated() {
      this.toggleAddModal();
    },
  },
};
</script>

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
