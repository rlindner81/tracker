<template>
  <div class="view tracker" v-if="track">
    <h1>{{ title($route.params.track) }}</h1>

    <div class="chart-container">
      <ActivityChart></ActivityChart>
    </div>

    <h2>Add a Step</h2>

    <form @submit.prevent="addStep">
      <div
        class="input"
        v-for="field in track.fields"
        :key="field._id"
      >
        <label>{{ field.name }}</label>
        <input
          type="text"
          v-model="newStep[field.key]"
          :placeholder="`Enter ${field.name}`"
        >
      </div>

      <LoadingButton>Track It</LoadingButton>
    </form>

    <h2>Steps</h2>

    <div class="info" v-if="!track.steps.length">
      <p>You don't have any step tracked yet.</p>
    </div>

    <div class="steps">
      <div
        class="step"
        v-for="step in track.steps"
        :key="step._id"
      >
        <div
          class="value"
          v-for="(value, key) in step.values"
          :key="key"
        >{{ `${key}: ${value}`}}</div>
      </div>
    </div>

    <h2>Settings</h2>
    <button @click="showDeleteModal">Delete Track</button>

    <Modal v-show="deleteModal">
      <p>Do you really want to delete this track?</p>
      <div class="buttons">
        <LoadingButton @click.native="deleteTrack">Delete</LoadingButton>
        <button @click="hideDeleteModal">Cancel</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ActivityChart from '../components/ActivityChart'
import Modal from '../components/Modal'
import LoadingButton from '../components/LoadingButton'

export default {
  components: {
    ActivityChart, Modal, LoadingButton
  },
  data () {
    return {
      deleteModal: false
    }
  },
  created () {
    this.getSteps(this.$route.params.track)
  },
  computed: {
    ...mapState('track', { newStep: 'newStep' }),
    ...mapGetters('track', { title: 'titleById', track: 'current' })
  },
  methods: {
    ...mapActions('track', { deleteTrack: 'delete', getSteps: 'getSteps', addStep: 'addStep' }),
    showDeleteModal () {
      this.deleteModal = true
    },
    hideDeleteModal () {
      this.deleteModal = false
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

  h2 {
    margin: 1rem 0;
  }

  .info {
    padding: 1rem;
    border: 1px solid @highlight;
    border-radius: 3px;
  }

  form .input {
    margin: 1rem 0;
  }

  .step {
    .shadow();
    background: @white;
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.5rem;
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
