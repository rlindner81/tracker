<template>
  <div class="component track-settings">
    <h2>Track</h2>
    <button @click="toggleEditModal">Edit Track</button>

    <button @click="exportTrack">Export Tack</button>

    <h2>Danger Zone</h2>
    <button @click="toggleDeleteModal">Delete Track</button>

    <AddTrack :edit="true" v-show="editModal" @close="toggleEditModal"></AddTrack>

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
import AddTrack from './AddTrack'

export default {
  components: {
    LoadingButton, Modal, AddTrack
  },
  data () {
    return {
      deleteModal: false,
      editModal: false
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
          this.$router.replace('/')
        })
    },
    toggleDeleteModal () {
      this.deleteModal = !this.deleteModal
    },
    toggleEditModal () {
      this.editModal = !this.editModal
    },
    exportTrack () {
      window.open(`/api/track/${this.track._id}/step/$export`)
    }
  }
}
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";
</style>
