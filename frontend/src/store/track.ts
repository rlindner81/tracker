import { defineStore } from "pinia";

import { guardedFetchResponse, guardedFetchJson } from "@/fetchWrapper";

interface State {
  data: any[];
  currentId: string | null;
  currentUsage: any[];
  // TODO new == newTrack
  new: {
    name: string | null;
    fields: any[];
  } | null;
  newStep: {} | null;
}

export const useTrackStore = defineStore("track", {
  state: (): State => ({
    data: [],
    currentId: null,
    currentUsage: [],
    new: {
      name: null,
      fields: [],
    },
    newStep: null, // has to be initialized by the relevant track
  }),
  getters: {
    titleById: (state) => (id) => {
      const entry = state.data.find((entry) => entry._id === id);
      return entry ? entry.name : null;
    },
    current(state) {
      return state.data.find((track) => track._id === state.currentId);
    },
  },
  actions: {
    set(data) {
      this.data = data;
    },
    setCurrent(id) {
      this.currentId = id;
    },
    setCurrentUsage(data) {
      this.currentUsage = data;
    },
    clear() {
      this.data = [];
    },
    clearNew() {
      this.new = {
        name: null,
        fields: [],
      };
    },
    clearCurrent() {
      this.currentId = null;
      this.currentUsage = [];
    },
    add(data) {
      this.data.push(data);
    },
    remove(id) {
      this.data = this.data.filter((track) => {
        return track._id !== id;
      });
    },
    load() {
      return guardedFetchJson("/api/track").then((data) => {
        data && this.set(data);
      });
    },
    create() {
      return guardedFetchJson("/api/track", <RequestInit>{
        method: "POST",
        body: <any>JSON.stringify(this.new),
      }).then((track) => {
        if (!track) return;
        track.stepCount = 0;
        this.add(track);
        this.clearNew();
      });
    },
    update() {
      const patchable = JSON.parse(JSON.stringify(this.current));
      delete patchable._id;
      delete patchable.userId;
      delete patchable.createdAt;
      delete patchable.updatedAt;
      delete patchable.stepCount;
      return guardedFetchResponse(`/api/track/${this.current._id}`, <RequestInit>{
        method: "PATCH",
        body: <any>JSON.stringify(patchable),
      });
    },
    delete() {
      return guardedFetchResponse(`/api/track/${this.current._id}`, <RequestInit>{
        method: "DELETE",
      }).then((response) => {
        if (!response) return;
        const id = this.current._id;
        this.clearCurrent();
        this.remove(id);
      });
    },
    report() {
      return guardedFetchJson(`/api/track/${this.current._id}/report/$dynamic`, <RequestInit>{
        method: "POST",
        body: <any>JSON.stringify({
          aggregations: [{ key: "count", type: "COUNT" }],
          interval: "DAY",
        }),
      }).then((data) => {
        data && this.setCurrentUsage(data.aggregations);
      });
    },
  },
});
