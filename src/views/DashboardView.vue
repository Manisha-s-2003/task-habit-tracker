<template>
  <div class="dashboard-container">
    <div class="cards-row">
      <DashboardCard
        title="Completed tasks"
        subtitle="In the last 7 days"
        :value="completedTasksLast7Days"
        :icon="CompletedTaskIcon"
        iconColor="#F59E0B"
      />
      <DashboardCard
        title="Overdue tasks"
        subtitle="Total overdue"
        :value="overdueTasks"
        :icon="OverdueTaskIcon"
        iconColor="#EF4444"
      />
      <DashboardCard
        title="Active habits"
        subtitle="Now active"
        :value="activeHabits"
        :icon="ActiveHabitsIcon"
        iconColor="#3B82F6"
      />
      <DashboardCard
        title="Longest Streak"
        :subtitle="longestStreakHabitName"
        :value="longestStreak"
        :icon="LongestStreakIcon"
        iconColor="#10B981"
      />
    </div>

    <div class="charts-row">
      <StatusPieChart :tasks="tasks" />
      <HabitsLineChart :habits="habits" />
    </div>
  </div>
</template>

<script>
import DashboardCard from "@/components/dashboard/DashboardCard.vue";
import StatusPieChart from "@/components/dashboard/StatusPieChart.vue";
import HabitsLineChart from "@/components/dashboard/HabitsLineChart.vue";
import CompletedTaskIcon from "@/assets/icons/completed-tasks.svg";
import OverdueTaskIcon from "@/assets/icons/overdue-task.svg";
import ActiveHabitsIcon from "@/assets/icons/active-habits.svg";
import LongestStreakIcon from "@/assets/icons/longest-streak.svg";

export default {
  name: "DashboardView",
  components: {
    DashboardCard,
    StatusPieChart,
    HabitsLineChart,
  },
  data() {
    return {
      CompletedTaskIcon,
      OverdueTaskIcon,
      ActiveHabitsIcon,
      LongestStreakIcon,
      tasks: [],
      habits: [],
    };
  },
  mounted() {
    this.loadData();
    window.addEventListener("tasksUpdated", this.loadData);
    window.addEventListener("habitsUpdated", this.loadData);
  },
  beforeUnmount() {
    window.removeEventListener("tasksUpdated", this.loadData);
    window.removeEventListener("habitsUpdated", this.loadData);
  },
  methods: {
    loadData() {
      this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      this.habits = JSON.parse(localStorage.getItem("habits")) || [];
    },
  },
  computed: {
    completedTasksLast7Days() {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return this.tasks.filter((task) => {
        if (task.status !== "Completed") return false;

        const completionDate = task.completedAt || task.createdAt;
        if (!completionDate) return false;

        const taskDate = new Date(completionDate);
        return taskDate >= sevenDaysAgo;
      }).length;
    },

    overdueTasks() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return this.tasks.filter((task) => {
        if (task.status === "Completed") return false;
        if (!task.dueDate && !task.date) return false;

        const dueDate = new Date(task.dueDate || task.date);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
      }).length;
    },

    activeHabits() {
      return this.habits.length;
    },

    longestStreak() {
      if (this.habits.length === 0) return 0;

      const maxStreak = Math.max(
        ...this.habits.map((h) => h.completedStreak || h.streak || 0)
      );

      return maxStreak;
    },

    longestStreakHabitName() {
      if (this.habits.length === 0) return "All-time record";

      const habitWithLongestStreak = this.habits.reduce((max, habit) => {
        const currentStreak = habit.completedStreak || habit.streak || 0;
        const maxStreak = max.completedStreak || max.streak || 0;
        return currentStreak > maxStreak ? habit : max;
      }, this.habits[0]);

      return habitWithLongestStreak.name || "All-time record";
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px 0;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

@media (max-width: 1024px) {
  .cards-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cards-row {
    grid-template-columns: 1fr;
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
