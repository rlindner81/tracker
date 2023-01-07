import { defineStore } from "pinia";

import { useTrackStore } from "@/store/track";
import { guardedFetchJson } from "@/fetchWrapper";

interface State {
  data: any[];
  trackId: string | null;
  new: {} | null;
  newEnabled: {} | null;
}

export const useStepStore = defineStore("step", {
  state: (): State => ({
    data: [],
    trackId: null,
    new: null, // has to be initialized by the relevant track
    newEnabled: null,
  }),
  actions: {
    set(data) {
      this.data = data;
    },
    setTrack(id) {
      this.trackId = id;
    },
    setNew(track) {
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

      this.new = newStep;
      this.newEnabled = newEnabled;
    },
    clear() {
      this.data = [];
      this.trackId = null;
      this.new = null;
      this.newEnabled = null;
    },
    add(data) {
      this.data.unshift(data);
    },
    remove(id) {
      this.data = this.data.filter((step) => {
        return step._id !== id;
      });
    },
    load() {
      const trackStore = useTrackStore();
      this.setTrack(trackStore.current._id);
      this.setNew(trackStore.current);
      return guardedFetchJson(`/api/track/${this.trackId}/step`).then((data) => {
        data && this.set(data);
      });
    },
    create() {
      const trackStore = useTrackStore();
      return guardedFetchJson(`/api/track/${trackStore.current._id}/step`, {
        method: "POST",
        body: JSON.stringify({ values: this.new }),
      }).then((data) => {
        if (!data) return;
        this.setNew(trackStore.current);
        this.add(data);
      });
    },
  },
});
