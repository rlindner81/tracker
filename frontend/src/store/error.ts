const ERROR_REMOVAL_DELAY = 3000;

export default {
  namespaced: true,
  state: {
    errors: [],
  },
  mutations: {
    async responseNotOk(state, response: Response) {
      const error = {
        _type: "responseNotOk",
        message: await response.text(),
      };

      const errorIndex = state.errors.push(error) - 1;

      setTimeout(() => {
        state.errors.splice(errorIndex, 1);
      }, ERROR_REMOVAL_DELAY);
    },

    raw(state, error) {
      debugger;
      let messages = [];

      if (Array.isArray(error.response.data)) {
        messages = error.response.data.map((error) => {
          return error.message;
        });
      } else {
        messages.push(error.response.data);
      }

      messages.forEach((message) => {
        const e = {
          _id: Math.random(),
          message,
        };

        state.errors = [e];

        setTimeout(() => {
          state.errors = state.errors.filter((message) => {
            return message._id !== e._id;
          });
        }, 4000);
      });
    },
  },
  getters: {},
  actions: {},
};
