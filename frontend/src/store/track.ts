import { defineStore } from "pinia";
import { createTrack, deleteTrack, subscribeToTracks, updateTrack } from "@/firebase/db";
import { useCommonStore } from "@/store/common";
import { toRaw } from "vue";

interface State {
  tracks: any[];
  currentId: string | null;
  newTrack: {} | null;
}

let tracksLoaded = false;
let resolveTracksLoaded;
export const tracksLoadedPromise = new Promise((resolve) => (resolveTracksLoaded = resolve));

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
    resetNewTrack() {
      this.newTrack = { name: null, fields: [] };
    },
    subscribeTracks() {
      subscribeToTracks(useCommonStore().userId, (tracks) => {
        this.setTracks(tracks);
        if (!tracksLoaded) {
          tracksLoaded = true;
          resolveTracksLoaded();
        }
      });
    },
    async createTrack() {
      if (!this.newTrack) return;
      await createTrack(useCommonStore().userId, toRaw(this.newTrack));
      this.resetNewTrack();
    },
    async updateTrack() {
      if (!this.currentId) return;
      const currentTrackClone = JSON.parse(JSON.stringify(toRaw(this.current)));
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
      this.setCurrentId(null);
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
