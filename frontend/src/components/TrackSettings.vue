<template>
  <div class="component track-settings">
    <h2>Update Track</h2>
    <form @submit.prevent="update">
      <label>Name</label>
      <input
        type="text"
        v-model="track.name">

      <LoadingButton>Update</LoadingButton>
    </form>

    <h2>Danger Zone</h2>
    <button @click="toggleDeleteModal">Delete Track</button>

    <Modal v-show="deleteModal">
      <p>Do you really want to delete this track?</p>
      <div class="buttons">
        <LoadingButton @click.native="remove">Delete</LoadingButton>
        <button @click="toggleDeleteModal">Cancel</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LoadingButton from './LoadingButton'
import Modal from './Modal'
export default {
  components: {
    LoadingButton, Modal
  },
  data () {
    return {
      deleteModal: false
    }
  },
  computed: {
    ...mapGetters('track', { track: 'current' })
  },
  methods: {
    ...mapActions('track', { deleteTrack: 'delete', update: 'update' }),
    remove () {
      this.deleteTrack()
        .then(() => {
          this.$router.replace('/tracker')
        })
    },
    toggleDeleteModal () {
      this.deleteModal = !this.deleteModal
    }
  }
}
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.track-settings {
  form {
    .shadow();
    background: @white;
    padding: 1rem;
  }
}
</style>
