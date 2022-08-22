import { guardedFetchResponse, guardedFetchJson } from "@/fetchWrapper";

export default {
  namespaced: true,
  state: {
    data: [],
    currentId: null,
    currentUsage: [],
    new: {
      name: null,
      fields: [],
    },
    newStep: null, // has to be initialized by the relevant track
    types: ["TEXT", "FLOAT", "INTEGER", "TIME"],
    inputs: ["SELECT", "FIELD", "SLIDER"],
  },
  mutations: {
    set(state, data) {
      state.data = data;
    },
    setCurrent(state, id) {
      state.currentId = id;
    },
    setCurrentUsage(state, data) {
      state.currentUsage = data;
    },
    clear(state) {
      state.data = null;
    },
    clearNew(state) {
      state.new = {
        name: null,
        fields: [],
      };
    },
    clearCurrent(state) {
      state.currentId = null;
      state.currentUsage = [];
    },
    addError(state, data) {
      state.data.push(data);
    },
    removeError(state, id) {
      state.data = state.data.filter((track) => {
        return track._id !== id;
      });
    },
  },
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
    load({ commit }) {
      return guardedFetchJson("/api/track").then((data) => {
        data && commit("set", data);
      });
    },
    create({ commit, state }) {
      return guardedFetchJson("/api/track", <RequestInit>{
        method: "POST",
        body: <any>JSON.stringify(state.new),
      }).then((track) => {
        if (!track) return;
        track.stepCount = 0;
        commit("add", track);
        commit("clearNew");
      });
    },
    update({ getters }) {
      const patchable = JSON.parse(JSON.stringify(getters.current));
      delete patchable._id;
      delete patchable.userId;
      delete patchable.createdAt;
      delete patchable.updatedAt;
      delete patchable.stepCount;
      return guardedFetchResponse(`/api/track/${getters.current._id}`, <
        RequestInit
      >{
        method: "PATCH",
        body: <any>JSON.stringify(patchable),
      });
    },
    delete({ commit, getters }) {
      return guardedFetchResponse(`/api/track/${getters.current._id}`, <
        RequestInit
      >{
        method: "DELETE",
      }).then((response) => {
        if (!response) return;
        const id = getters.current._id;
        commit("clearCurrent");
        commit("remove", id);
      });
    },
    report({ commit, getters }) {
      return guardedFetchJson(
        `/api/track/${getters.current._id}/report/$dynamic`,
        <RequestInit>{
          method: "POST",
          body: <any>JSON.stringify({
            aggregations: [{ key: "count", type: "COUNT" }],
            interval: "DAY",
          }),
        }
      ).then((data) => {
        data && commit("setCurrentUsage", data.aggregations);
      });
    },
  },
};
