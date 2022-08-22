import { createStore } from "vuex";
import CommonStore from "./common";
import TrackStore from "./track";
import StepStore from "./step";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    common: CommonStore,
    track: TrackStore,
    step: StepStore,
  },
});
