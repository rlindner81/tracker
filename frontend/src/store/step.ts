import { guardedFetchJson } from "@/fetchWrapper";

export default {
  namespaced: true,
  state: {
    data: [],
    trackId: null,
    new: null, // has to be initialized by the relevant track
  },
  actions: {
    set({ state }, data) {
      state.data = data;
    },
    setTrack({ state }, id) {
      state.trackId = id;
    },
    setNew({ state }, track) {
      const newStep = {};
      const newEnabled = {};

      track.fields.forEach((field) => {
        newEnabled[field.key] = true;

        switch (field.input.identifier) {
          case "SLIDER": {
            const halfPoint = (parseFloat(field.input.parameters.min) + parseFloat(field.input.parameters.max)) / 2.0;
            newStep[field.key] = halfPoint;
            break;
          }
          case "SELECT": {
            const firstEntryValue = field.input.parameters.values[0].value;
            newStep[field.key] = firstEntryValue;
            break;
          }
          default: {
            newStep[field.key] =
              field.input && field.input.parameters && field.input.parameters.selected
                ? field.input.parameters.selected
                : null;
            break;
          }
        }
      });

      state.new = newStep;
      state.newEnabled = newEnabled;
    },
    clear({ state }) {
      state.data = null;
      state.trackId = null;
      state.new = null;
      state.newEnabled = null;
    },
    add({ state }, data) {
      state.data.unshift(data);
    },
    remove({ state }, id) {
      state.data = state.data.filter((step) => {
        return step._id !== id;
      });
    },
    load({ commit, state, rootGetters }) {
      commit("setTrack", rootGetters["track/current"]._id);
      commit("setNew", rootGetters["track/current"]);
      return guardedFetchJson(`/api/track/${state.trackId}/step`).then((data) => {
        data && commit("set", data);
      });
    },
    create({ commit, state, rootGetters }) {
      return guardedFetchJson(`/api/track/${rootGetters["track/current"]._id}/step`, {
        method: "POST",
        body: JSON.stringify({ values: state.new }),
      }).then((data) => {
        if (!data) return;
        commit("setNew", rootGetters["track/current"]);
        commit("add", data);
      });
    },
  },
};
