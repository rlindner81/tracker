<template>
  <div class="view tracker">
    <h1>{{ title($route.params.track) }}</h1>

    <!--    <div class="chart-container">-->
    <!--      <ActivityChart></ActivityChart>-->
    <!--    </div>-->

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

      <!--      <Tab name="Reporting">-->
      <!--        <div class="title-with-button">-->
      <!--          <h2>Reports</h2>-->
      <!--          <button @click="toggleReportModal">Add Report</button>-->
      <!--        </div>-->

      <!--        <div class="info" v-if="reports && !reports.length">-->
      <!--          <p>You don't have any reports defined yet.</p>-->
      <!--        </div>-->

      <!--        <div class="report-wrap" v-for="report in reports" :key="report.id">-->
      <!--          <h2>{{ report.name }}</h2>-->
      <!--          <GenericReport :report="report"></GenericReport>-->
      <!--          <button @click="showDeleteModal(report)">Delete</button>-->
      <!--        </div>-->
      <!--      </Tab>-->

      <Tab name="Settings">
        <TrackSettings></TrackSettings>
      </Tab>
    </Tabs>

    <Modal v-show="addModal">
      <h2>Add a Step</h2>
      <AddStep @tracked="onTrackCreated" @closed="toggleAddModal"></AddStep>
    </Modal>

    <Modal v-show="reportModal">
      <h2>Add a Report</h2>
      <AddReport
        @tracked="toggleReportModal"
        @closed="toggleReportModal"
      ></AddReport>
    </Modal>

    <Modal v-show="deleteModal" class="delete-modal">
      <h2>Delete Report</h2>
      <p v-if="selected">
        Are you sure you want to delete the report {{ selected.name }}
      </p>
      <div class="button-row">
        <button class="inverted" @click="deleteModal = false">Cancel</button>
        <LoadingButton @click="onDelete">Delete</LoadingButton>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
// import ActivityChart from "../components/ActivityChart";
import Modal from "../components/Modal";
import AddStep from "../components/AddStep";
import Tabs from "../components/Tabs";
import Tab from "../components/Tab";
import TrackList from "../components/TrackList";
import TrackSettings from "../components/TrackSettings";
import AddReport from "../components/AddReport";
// import GenericReport from "../components/GenericReport";
import LoadingButton from "../components/LoadingButton";

export default {
  components: {
    // ActivityChart,
    Modal,
    AddStep,
    Tabs,
    Tab,
    TrackList,
    TrackSettings,
    AddReport,
    // GenericReport,
    LoadingButton,
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
    this.loadReports();
    this.report();
  },
  computed: {
    ...mapState("step", { newStep: "new", steps: "data" }),
    ...mapGetters("track", { title: "titleById", track: "current" }),
    ...mapState("report", { reports: "data", selected: "selected" }),
  },
  methods: {
    ...mapActions("track", { report: "report" }),
    ...mapMutations("track", {
      setCurrent: "setCurrent",
      clearTrack: "clearCurrent",
    }),
    ...mapActions("step", { load: "load" }),
    ...mapMutations("step", { clear: "clear" }),
    ...mapActions("report", { loadReports: "load", deleteReport: "delete" }),
    ...mapMutations("report", ["select"]),
    toggleAddModal() {
      this.addModal = !this.addModal;
    },
    toggleReportModal() {
      this.reportModal = !this.reportModal;
    },
    onTrackCreated() {
      this.toggleAddModal();
      this.loadReports();
    },
    showDeleteModal(report) {
      this.select(report._id);
      this.deleteModal = true;
    },
    onDelete() {
      this.deleteReport(this.selected._id).then(() => {
        this.deleteModal = false;
      });
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
