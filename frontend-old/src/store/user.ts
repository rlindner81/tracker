import { defineStore } from "pinia";
import { subscribeToUsers, unsubscribeUsers } from "@/firebase/db";

interface State {
  users: {};
}

export const useUserStore = defineStore("user", {
  state: (): State => ({
    users: {},
  }),
  getters: {
    emailById: (state) => (userId) => state.users[userId],
  },
  actions: {
    setUsers(input) {
      this.users = input;
    },
    subscribeUsers() {
      subscribeToUsers((users) => {
        this.setUsers(
          users.reduce((result, { _id: userId, email }) => {
            result[userId] = email;
            return result;
          }, {})
        );
      });
    },
    unsubscribeUsers() {
      unsubscribeUsers();
      this.setUsers({});
    },
  },
});
