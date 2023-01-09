import { defineStore } from "pinia";
import { createTrack, deleteTrack, subscribeToTracks, updateTrack } from "@/firebase/store";
import { useCommonStore } from "@/store/common";

interface State {
  tracks: any[];
  currentId: string | null;
  newTrack: {} | null;
}

export const useTrackStore = defineStore("track", {
  state: (): State => ({
    tracks: [],
    currentId: null,
    newTrack: null,
  }),
  getters: {
    titleById: (state) => (id) => {
      const entry = state.tracks.find((entry) => entry._id === id);
      return entry ? entry.name : null;
    },
    current(state) {
      return state.currentId ? state.tracks.find((track) => track._id === state.currentId) ?? null : null;
    },
  },
  actions: {
    setTracks(input) {
      this.tracks = input;
    },
    setCurrentId(input) {
      this.currentId = input;
    },
    setNewTrack(input) {
      this.newTrack = input;
    },
    addTrack(track) {
      this.tracks.push(track);
    },
    removeTrack(trackId) {
      this.tracks = this.tracks.filter((track) => track._id !== trackId);
    },
    subscribeTracks() {
      subscribeToTracks(useCommonStore().userId, (tracks) => this.setTracks(tracks));
    },
    async createTrack() {
      if (!this.newTrack) return;
      const track = await createTrack(this.newTrack);
      // TODO look at how we resolve this return value properly
      debugger;
      // if (!track) return;
      // track.stepCount = 0;
      this.addTrack(track);
      this.setNewTrack(null);
    },
    async updateTrack() {
      if (!this.currentId) return;
      const currentTrackClone = JSON.parse(JSON.stringify(this.current));
      delete currentTrackClone._id;
      delete currentTrackClone.userId;
      delete currentTrackClone.createdAt;
      delete currentTrackClone.updatedAt;
      delete currentTrackClone.stepCount;
      await updateTrack(this.currentId, currentTrackClone);
    },
    async deleteTrack() {
      if (!this.currentId) return;
      await deleteTrack(this.currentId);
      const oldId = this.current._id;
      this.setCurrentId(null);
      this.removeTrack(oldId);
    },
    // TODO report is not thought through or hooked up for now
    // async report() {
    //   if (!this.currentId) return;
    //   const data = await guardedFetchJson(`/api/track/${this.currentId}/report/$dynamic`, <RequestInit>{
    //     method: "POST",
    //     body: <any>JSON.stringify({
    //       aggregations: [{ key: "count", type: "COUNT" }],
    //       interval: "DAY",
    //     }),
    //   });
    //   if (!data) return;
    // },
  },
});
