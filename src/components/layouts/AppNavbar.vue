<template>
  <nav class="tabs">
    <router-link to="/dashboard" class="tab" active-class="active">
      <i class="icon-layout-web-12-regular"></i>
      Dashboard
    </router-link>

    <router-link to="/tasks" class="tab" active-class="active">
      <i class="icon-check-square-regular"></i>
      Tasks
    </router-link>

    <router-link to="/habits" class="tab" active-class="active">
      <i class="icon-bolt-square-alt-regular"></i>
      Habits
    </router-link>

    <router-link to="/rules" class="tab" active-class="active">
      <i class="icon-settings-regular"></i>
      Rules
    </router-link>
  </nav>
</template>

<script>
import DashboardIcon from "@/assets/icons/dashboard.svg";
import TaskIcon from "@/assets/icons/tasks.svg";
import HabitsIcon from "@/assets/icons/habits.svg";
import RulesIcon from "@/assets/icons/rules.svg";
export default {
  name: "AppNavbar",
  data() {
    return {
      DashboardIcon,
      TaskIcon,
      HabitsIcon,
      RulesIcon,
    };
  },
};
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 30px;
  padding: 10px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  padding-bottom: 10px;
  transition: all 0.2s ease;
}

.tab-icon {
  width: 16px;
  height: 16px;
}

.tab:hover {
  color: #54bd95;
}

.tab.active {
  color: #54bd95;
}

.tab:hover::after {
  width: 100%;
}

.tab.active::after {
  width: 100%;
}

.tab::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0%;
  height: 2px;
  background-color: #54bd95;
  transition: width 0.3s ease;
}
</style>
