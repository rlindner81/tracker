import { defineStore } from "pinia";
import CommonStore from "./common";
import TrackStore from "./track";
import StepStore from "./step";

export default defineStore({
  state: {},
  modules: {
    common: CommonStore,
    track: TrackStore,
    step: StepStore,
  },
});
