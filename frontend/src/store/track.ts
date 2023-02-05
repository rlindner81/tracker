import { defineStore } from "pinia";
import { createTrack, deleteTrack, subscribeToTracks, updateTrack } from "@/firebase/db";
import { useCommonStore } from "@/store/common";
import { toRaw } from "vue";

interface State {
  tracks: any[];
  currentId: string | null;
  newCreateTrack: {
    name?: string | null;
    fields?: any[];
  };
  newUpdateTrack: {
    _id?: string;
    name?: string | null;
    fields?: any[];
    members?: string[];
    track_id?: string;
    _created_at?: Date;
    _created_by?: string;
    _updated_at?: Date;
    _updated_by?: string;
  };
}

export const useTrackStore = defineStore("track", {
  state: (): State => ({
    tracks: [],
    currentId: null,
    newCreateTrack: {},
    newUpdateTrack: {},
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
    prepareNewCreateTrack() {
      this.newCreateTrack = { name: null, fields: [] };
    },
    prepareNewUpdateTrack() {
      this.newUpdateTrack = JSON.parse(JSON.stringify(toRaw(this.current)));
    },
    subscribeTracks() {
      subscribeToTracks(useCommonStore().userId, (tracks) => {
        this.setTracks(tracks);
      });
    },
    async createTrack() {
      if (!this.newCreateTrack) return;
      await createTrack(useCommonStore().userId, toRaw(this.newCreateTrack));
      this.prepareNewCreateTrack();
    },
    async updateTrack() {
      if (!this.currentId) return;
      const currentTrackClone = toRaw(this.newUpdateTrack);
      delete currentTrackClone._id;
      delete currentTrackClone.members;
      delete currentTrackClone._created_at;
      delete currentTrackClone._updated_at;
      await updateTrack(useCommonStore().userId, this.currentId, currentTrackClone);
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
