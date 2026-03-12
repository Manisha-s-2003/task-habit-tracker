<template>
  <header class="header">
    <div class="left">
      <h1>Task & Habit Tracker</h1>
      <p>Manage your task and build habits with analytics and custom rules</p>
    </div>
    <div class="right">
      <button class="theme-btn" @click="toggleTheme">
        <img :src="themeIcon" alt="Toggle Theme" class="theme-icon" />
      </button>
    </div>
  </header>
</template>
<script>
import lightIcon from "@/assets/icons/light-icon.svg";
import lightThemeIcon from "@/assets/icons/light-theme.svg";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AppHeader",
  data() {
    return {
      lightIcon,
      lightThemeIcon,
    };
  },
  computed: {
    ...mapGetters(["isDarkTheme"]),
    themeIcon() {
      // Show light icon when in dark mode (to switch to light)
      // Show light-theme icon when in light mode (to switch to dark)
      return this.isDarkTheme ? this.lightIcon : this.lightThemeIcon;
    },
  },
  methods: {
    ...mapActions(["toggleTheme"]),
  },
};
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card-bg);
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}
.left h1 {
  font-family: Quicksand;
  margin: 0;
  line-height: 1.2;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}
.left p {
  margin: 0;
  padding: 6px;
  line-height: 1.4;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}
.theme-btn {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-btn:hover {
  background-color: var(--bg-secondary);
  transform: scale(1.05);
}
.theme-icon {
  width: 20px;
  height: 20px;
}
</style>
