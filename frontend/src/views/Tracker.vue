<template>
  <div class="view tracker">
    <h1>{{ title($route.params.track) }}</h1>

    <div class="chart-container">
      <ActivityChart></ActivityChart>
    </div>

    <div class="title-with-button">
      <h2>Steps</h2>
      <button @click="toggleAddModal">Add Step</button>
    </div>

    <div class="info" v-if="steps && !steps.length">
      <p>You don't have any step tracked yet.</p>
    </div>

    <div class="steps" v-if="steps && steps.length > 0">
      <div
        class="step"
        v-for="step in steps"
        :key="step._id"
      >
        <div class="values">
          <div
            class="value"
            v-for="(value, key) in step.values"
            :key="key"
          >
            <label>{{ track.fields.find(field => field.key === key).name }}</label>
            <span v-if="track.fields.find(field => field.key === key).type.identifier !== 'SELECT_SINGLE'">{{ value }}</span>
            <span v-else>{{ track.fields.find(field => field.key === key).type.parameters.values.find(v => v.value.toString() === value.toString()).name + ` (${value})` }}</span>
          </div>
        </div>
        <div class="master-data">
          <label>Tracked at</label>
          <span :title="step.createdAt | date">{{ step.createdAt | relativeDate }}</span>
        </div>
      </div>
    </div>

    <h2>Settings</h2>
    <button @click="toggleDeleteModal">Delete Track</button>

    <!-- modals -->

    <Modal v-show="addModal">
      <h2>Add a Step</h2>
      <AddStep @tracked="toggleAddModal"></AddStep>
    </Modal>

    <Modal v-show="deleteModal">
      <p>Do you really want to delete this track?</p>
      <div class="buttons">
        <LoadingButton @click.native="deleteTrack">Delete</LoadingButton>
        <button @click="toggleDeleteModal">Cancel</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import ActivityChart from '../components/ActivityChart'
import Modal from '../components/Modal'
import LoadingButton from '../components/LoadingButton'
import AddStep from '../components/AddStep'

export default {
  components: {
    ActivityChart, Modal, LoadingButton, AddStep
  },
  data () {
    return {
      deleteModal: false,
      addModal: false
    }
  },
  created () {
    this.clear()
    this.setCurrent(this.$route.params.track)
    this.load()
    this.report()
  },
  computed: {
    ...mapState('step', { newStep: 'new', steps: 'data' }),
    ...mapGetters('track', { title: 'titleById', track: 'current' })
  },
  methods: {
    ...mapActions('track', { deleteTrack: 'delete', report: 'report' }),
    ...mapMutations('track', { setCurrent: 'setCurrent' }),
    ...mapActions('step', { load: 'load' }),
    ...mapMutations('step', { clear: 'clear' }),
    toggleDeleteModal () {
      this.deleteModal = !this.deleteModal
    },
    toggleAddModal () {
      this.addModal = !this.addModal
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

  .title-with-button {
    .row(center, space-between);
    margin-top: 2rem;
    button {
      width: auto;
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

  .step {
    .shadow();
    .row(flex-start, space-between);
    transition: all 0.15s ease-in-out;
    background: @white;
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.5rem;

    label {
      font-size: 0.87rem;
    }

    span {
      font-weight: bold;
    }

    .master-data {
      text-align: end;
    }
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
