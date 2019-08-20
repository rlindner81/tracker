<template>
  <div class="view tracker">
    <h1>{{ title($route.params.track) }}</h1>

    <div class="chart-container">
      <ActivityChart></ActivityChart>
    </div>

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

      <Tab name="Reporting">
        <div class="title-with-button">
          <h2>Reports</h2>
          <button @click="toggleReportModal">Add Report</button>
        </div>

        <div class="info" v-if="reports && !reports.length">
          <p>You don't have any reports defined yet.</p>
        </div>

        <div
          class="report-wrap"
          v-for="report in reports"
          :key="report.id"
        >
          <GenericReport :report="report"></GenericReport>
        </div>
      </Tab>

      <Tab name="Settings">
        <TrackSettings></TrackSettings>
      </Tab>
    </Tabs>

    <Modal v-show="addModal">
      <h2>Add a Step</h2>
      <AddStep @tracked="toggleAddModal" @closed="toggleAddModal"></AddStep>
    </Modal>

    <Modal v-show="reportModal">
      <h2>Add a Report</h2>
      <AddReport @tracked="toggleReportModal" @closed="toggleReportModal"></AddReport>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import ActivityChart from '../components/ActivityChart'
import Modal from '../components/Modal'
import AddStep from '../components/AddStep'
import Tabs from '../components/Tabs'
import Tab from '../components/Tab'
import TrackList from '../components/TrackList'
import TrackSettings from '../components/TrackSettings'
import AddReport from '../components/AddReport'
import GenericReport from '../components/GenericReport'

export default {
  components: {
    ActivityChart, Modal, AddStep, Tabs, Tab, TrackList, TrackSettings, AddReport, GenericReport
  },
  data () {
    return {
      addModal: false,
      reportModal: false
    }
  },
  created () {
    this.clear()
    this.setCurrent(this.$route.params.track)
    this.load()
    this.loadReports()
    this.report()
  },
  computed: {
    ...mapState('step', { newStep: 'new', steps: 'data' }),
    ...mapGetters('track', { title: 'titleById', track: 'current' }),
    ...mapState('report', { reports: 'data' })
  },
  methods: {
    ...mapActions('track', { report: 'report' }),
    ...mapMutations('track', { setCurrent: 'setCurrent' }),
    ...mapActions('step', { load: 'load' }),
    ...mapMutations('step', { clear: 'clear' }),
    ...mapActions('report', { loadReports: 'load' }),
    toggleAddModal () {
      this.addModal = !this.addModal
    },
    toggleReportModal () {
      this.reportModal = !this.reportModal
    }
  }
}
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
    button {
      width: auto;
    }
  }

  .report-wrap {
    .size(100%, 300px);

    > div {
      .size(100%, 300px);
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
}
</style>
