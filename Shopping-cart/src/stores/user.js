import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userData: "Alex",
  }),
  getters: {
    userMayuscula(state) {
      return state.userData.toUpperCase();
    },
  },
  actions: {
    setUserData(newData) {
      this.userData = newData;
    },
  },
});
