import { createStore } from "vuex";
import BusyStore from "./busy";
import UserStore from "./user";
import TrackStore from "./track";
import StepStore from "./step";
import ErrorStore from "./error";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    busy: BusyStore,
    user: UserStore,
    track: TrackStore,
    step: StepStore,
    error: ErrorStore,
  },
});
