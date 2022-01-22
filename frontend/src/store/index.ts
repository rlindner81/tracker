import { createStore } from "vuex";
// import BusyStore from './stores/busy'
import UserStore from "./user";
import TrackStore from "./track";
// import StepStore from './stores/step'
import ErrorStore from "./error";
// import ReportStore from './stores/report'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: UserStore,
    track: TrackStore,
    error: ErrorStore,
  },
});

//
// import Vue from 'vue'
// import Vuex from 'vuex'
//
// import BusyStore from './stores/busy'
// import UserStore from './stores/user'
// import TrackStore from './stores/track'
// import StepStore from './stores/step'
// import ErrorStore from './stores/error'
// import ReportStore from './stores/report'
//
// Vue.use(Vuex)
//
// export default new Vuex.Store({
//   modules: {
//     busy: BusyStore,
//     user: UserStore,
//     track: TrackStore,
//     step: StepStore,
//     report: ReportStore,
//     error: ErrorStore
//   }
// })
