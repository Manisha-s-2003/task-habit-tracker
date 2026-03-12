import { createStore } from "vuex";

export default createStore({
  state: {
    isDarkTheme: localStorage.getItem("theme") === "dark" || false,
  },
  getters: {
    isDarkTheme: (state) => state.isDarkTheme,
  },
  mutations: {
    TOGGLE_THEME(state) {
      state.isDarkTheme = !state.isDarkTheme;
      localStorage.setItem("theme", state.isDarkTheme ? "dark" : "light");
      document.body.classList.toggle("dark-theme", state.isDarkTheme);
    },
    SET_THEME(state, isDark) {
      state.isDarkTheme = isDark;
      localStorage.setItem("theme", isDark ? "dark" : "light");
      document.body.classList.toggle("dark-theme", isDark);
    },
  },
  actions: {
    toggleTheme({ commit }) {
      commit("TOGGLE_THEME");
    },
    initTheme({ commit }) {
      const savedTheme = localStorage.getItem("theme");
      const isDark = savedTheme === "dark";
      commit("SET_THEME", isDark);
    },
  },
  modules: {},
});
