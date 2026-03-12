<template>
  <div class="habits-page">
    <HabitsFilter
      @frequency-changed="applyFrequencyFilter"
      @sort-changed="applySortFilter"
    />
  </div>
  <div class="habit-header">
    <h3>Habits</h3>
    <div class="right-section">
      <div class="search-wrapper">
        <img :src="Search" class="search-icon" />
        <input
          type="text"
          placeholder="Search"
          class="search"
          v-model="searchQuery"
          @input="applyFilters"
        />
      </div>
      <hlx-button class="primary sm add-habit-btn" @click="openHabitModal">
        <img :src="AddHabit" class="button-img" />
        <span>Add Habit</span>
      </hlx-button>
    </div>
  </div>
  <div v-if="filteredHabits.length === 0" class="empty-state">
    <img :src="NoHabitFound" />
    <p>No habits found. Create your first habit to start building streaks!</p>
  </div>
  <div v-else class="habit-grid">
    <HabitsCard
      v-for="(habit, index) in filteredHabits"
      :key="habit.id"
      :habit="habit"
      :index="index"
      @complete-habit="markHabitComplete"
      @toggle-date="toggleDateCompletion"
      @edit-habit="editHabit"
      @delete-habit="openDeleteModal"
    />
  </div>
  <HabitsForm
    v-if="isModalOpen"
    :editHabit="selectedHabit"
    :key="selectedHabit ? selectedHabit.id : 'new'"
    @close="closeHabitModal"
    @task-added="handleHabitAdded"
    @task-updated="handleHabitUpdated"
  />
  <DeleteModal
    v-if="showDeleteModal"
    :itemToDelete="habitToDeleteTitle"
    @confirm-delete="handleHabitDelete"
    @cancel-delete="cancelDelete"
  />

  <hlx-alert-notification
    :notify="notification"
    :auto-close="true"
    :delay="3000"
  />
</template>

<script>
import HabitsFilter from "@/components/habits/HabitsFilter";
import HabitsForm from "@/components/habits/HabitsForm.vue";
import HabitsCard from "@/components/habits/HabitsCard.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import Search from "@/assets/icons/search.svg";
import AddHabit from "@/assets/icons/add-task.svg";
import NoHabitFound from "@/assets/icons/habits-view.svg";
import { applyHabitRules } from "@/utils/ruleEngine.js";

export default {
  name: "HabitsView",
  components: {
    HabitsFilter,
    HabitsForm,
    HabitsCard,
    DeleteModal,
  },
  data() {
    return {
      habits: [],
      Search,
      AddHabit,
      NoHabitFound,
      filteredHabits: [],
      isModalOpen: false,
      notification: {},
      selectedHabit: null,
      showDeleteModal: false,
      habitToDelete: null,
      habitToDeleteTitle: "",
      selectedFrequency: "",
      selectedSort: "streak",
      searchQuery: "",
    };
  },
  mounted() {
    this.loadHabits();
    this.applyFilters();
  },
  watch: {
    habits: {
      deep: true,
      handler() {
        this.applyFilters();
      },
    },
  },
  methods: {
    showToast(message) {
      this.notification = {
        type: "success",
        message: message,
      };
    },
    openHabitModal() {
      this.isModalOpen = true;
      this.selectedHabit = null;
    },
    closeHabitModal() {
      this.isModalOpen = false;
      this.selectedHabit = null;
    },
    editHabit(habit) {
      this.selectedHabit = { ...habit };
      this.isModalOpen = true;
    },
    openDeleteModal(habit) {
      this.habitToDelete = habit;
      this.habitToDeleteTitle = habit.name;
      this.showDeleteModal = true;
    },
    loadHabits() {
      let habits = JSON.parse(localStorage.getItem("habits")) || [];
      const today = new Date();
      habits.forEach((habit) => {
        if (!habit.progress) habit.progress = {};
        if (!habit.createdAt) return;
        const createdDate = new Date(habit.createdAt);
        this.markMissedDays(habit, createdDate, today);
        this.recalculatedStreak(habit);
      });

      // Apply rules to habits
      habits = applyHabitRules(habits);

      this.habits = habits;
      this.filteredHabits = habits;
      this.saveHabits();
    },
    markMissedDays(habit, createdDate, today) {
      const frequency = habit.frequency.toLowerCase();
      if (frequency !== "daily") {
        return;
      }
      let checkDate = new Date(createdDate);
      const todayKey = this.formatDate(today);
      while (checkDate < today) {
        const dateKey = this.formatDate(checkDate);
        if (habit.progress[dateKey] || dateKey === todayKey) {
          checkDate.setDate(checkDate.getDate() + 1);
          continue;
        }
        habit.progress[dateKey] = "missed";
        checkDate.setDate(checkDate.getDate() + 1);
      }
    },
    saveHabits() {
      localStorage.setItem("habits", JSON.stringify(this.habits));
    },
    handleHabitAdded(newHabit) {
      this.habits.push(newHabit);
      this.applyFilters();
      this.saveHabits();
      this.showToast(
        `Nice work! Your new habit ${newHabit.name} is now in the list`
      );
    },
    handleHabitUpdated(updatedHabit) {
      const index = this.habits.findIndex((h) => h.id === updatedHabit.id);

      if (index !== -1) {
        this.habits[index] = updatedHabit;
      }

      this.applyFilters();
      this.saveHabits();
      this.showToast("All Set! Your changes have  been saved successfully!");
    },
    handleHabitDelete() {
      if (!this.habitToDelete) return;
      this.habits = this.habits.filter(
        (habit) => habit.id !== this.habitToDelete.id
      );
      this.applyFilters();
      this.saveHabits();
      this.showToast("Done! Your item has been removed.");
      this.habitToDelete = null;
      this.showDeleteModal = false;
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.habitToDelete = null;
    },
    applyFrequencyFilter(frequency) {
      this.selectedFrequency = frequency;
      this.applyFilters();
    },
    applySortFilter(sortBy) {
      this.selectedSort = sortBy;
      this.applyFilters();
    },
    applyFilters() {
      // Apply rules first
      let habitsWithRules = applyHabitRules([...this.habits]);
      let filtered = habitsWithRules;

      // Apply frequency filter
      if (this.selectedFrequency) {
        filtered = filtered.filter((habit) => {
          const match =
            habit.frequency.toLowerCase() ===
            this.selectedFrequency.toLowerCase();
          return match;
        });
      }

      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((habit) =>
          habit.name.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      if (this.selectedSort === "streak") {
        // Sort from lowest to highest streak
        filtered.sort(
          (a, b) => (a.completedStreak || 0) - (b.completedStreak || 0)
        );
      } else if (this.selectedSort === "createdAt") {
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
      } else if (this.selectedSort === "frequency") {
        const frequencyOrder = { daily: 1, weekly: 2, custom: 3 };
        filtered.sort((a, b) => {
          const orderA = frequencyOrder[a.frequency.toLowerCase()] || 4;
          const orderB = frequencyOrder[b.frequency.toLowerCase()] || 4;
          return orderA - orderB;
        });
      }

      this.filteredHabits = filtered;
    },
    markHabitComplete(habit) {
      const todayDate = new Date();
      const today =
        todayDate.getFullYear() +
        "-" +
        String(todayDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(todayDate.getDate()).padStart(2, "0");
      const habitIndex = this.habits.findIndex((h) => h.id === habit.id);
      if (habitIndex === -1) return;
      const updatedHabit = { ...this.habits[habitIndex] };
      if (!updatedHabit.progress) {
        updatedHabit.progress = {};
      }

      if (updatedHabit.progress[today] === "completed") {
        // When uncompleting today, revert all calendar dates
        this.revertAllDates(updatedHabit);
      } else {
        updatedHabit.progress[today] = "completed";
        this.recalculatedStreak(updatedHabit);
      }
      this.habits.splice(habitIndex, 1, updatedHabit);
      this.$forceUpdate();
      this.saveHabits();
    },
    toggleDateCompletion({ habit, dateKey }) {
      if (!habit.progress) {
        habit.progress = {};
      }

      const clickedDate = new Date(dateKey);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      clickedDate.setHours(0, 0, 0, 0);

      // Only allow toggling for today or past dates
      if (clickedDate > today) return;

      // Find the habit in the array and update it
      const habitIndex = this.habits.findIndex((h) => h.id === habit.id);
      if (habitIndex === -1) return;

      // Create a new habit object to ensure reactivity
      const updatedHabit = { ...this.habits[habitIndex] };
      // Toggle the date status
      if (updatedHabit.progress[dateKey] === "completed") {
        // If it's a past date, mark as missed; if today, mark as pending
        if (clickedDate < today) {
          updatedHabit.progress[dateKey] = "missed";
        } else {
          delete updatedHabit.progress[dateKey];
        }
      } else {
        updatedHabit.progress[dateKey] = "completed";
      }

      this.recalculatedStreak(updatedHabit);
      this.habits.splice(habitIndex, 1, updatedHabit);
      this.$forceUpdate();
      this.saveHabits();
    },
    revertAllDates(habit) {
      if (!habit.progress) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all dates in progress
      const dates = Object.keys(habit.progress);

      dates.forEach((dateKey) => {
        const date = new Date(dateKey);
        date.setHours(0, 0, 0, 0);

        // Only revert completed dates
        if (habit.progress[dateKey] === "completed") {
          if (date < today) {
            // Past dates become missed
            habit.progress[dateKey] = "missed";
          } else {
            // Today and future dates are removed
            delete habit.progress[dateKey];
          }
        }
      });

      this.recalculatedStreak(habit);
    },
    recalculatedStreak(habit) {
      if (!habit.progress) {
        habit.completedStreak = 0;
        return;
      }

      const frequency = habit.frequency.toLowerCase();
      // For custom frequency, we need to check if all selected days in a week are completed
      if (frequency === "custom") {
        habit.completedStreak = this.calculateCustomStreak(habit);
        return;
      }
      // For daily and weekly, calculate consecutive completion days
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const createdDate = new Date(habit.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      let todayFormatted = this.formatDate(new Date());
      while (currentDate >= createdDate && streak <= 365) {
        const dateKey = this.formatDate(currentDate);
        // Check if this date should be tracked based on frequency
        if (this.shouldTrackDate(habit, currentDate)) {
          if (habit.progress[dateKey] === "completed") {
            streak++;
          } else {
            if (dateKey === todayFormatted && streak === 0) {
              // Today is not completed but we haven't started counting yet, so continue
            } else {
              // Break the streak if we find a non-completed day that should be tracked
              break;
            }
          }
        }
        currentDate.setDate(currentDate.getDate() - 1);
        // Safety check to prevent infinite loop
        // if (streak > 365) break;
        // Don't go before habit creation date
        // if (habit.createdAt && currentDate < new Date(habit.createdAt)) break;
      }

      habit.completedStreak = streak;
    },

    calculateCustomStreak(habit) {
      const selectedDays = (habit.customDays || []).map((d) => d.value);
      if (selectedDays.length === 0) return 0;
      let streak = 0;
      let currentDate = new Date();
      // Start from today and work backwards
      while (streak <= 52) {
        let weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start of week (Sunday)
        let weekCompleted = true;
        let hasAnyDayInWeek = false;
        // Check if all selected days in this week are completed
        for (let dayName of selectedDays) {
          const dayDate = this.getDateForDayInWeek(weekStart, dayName);
          const dateKey = this.formatDate(dayDate);
          // Only check days that are not in the future
          if (dayDate <= new Date()) {
            hasAnyDayInWeek = true;
            if (
              !habit.progress[dateKey] ||
              habit.progress[dateKey] !== "completed"
            ) {
              weekCompleted = false;
              break;
            }
          }
        }
        // If no days in this week should be tracked yet, stop counting
        if (!hasAnyDayInWeek) {
          break;
        }
        if (weekCompleted) {
          streak++;
        } else {
          break;
        }
        // Move to previous week
        currentDate.setDate(currentDate.getDate() - 7);
        // Safety check
        if (streak > 52) break;
      }
      return streak;
    },

    shouldTrackDate(habit, date) {
      const frequency = habit.frequency.toLowerCase();
      const dayName = date.toLocaleString("en-us", { weekday: "long" });
      if (frequency === "daily") {
        return true;
      } else if (frequency === "weekly") {
        return dayName === habit.weeklyDay;
      } else if (frequency === "custom") {
        const selectedDays = (habit.customDays || []).map((d) => d.value);
        return selectedDays.includes(dayName);
      }
      return false;
    },

    getDateForDayInWeek(weekStart, dayName) {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayIndex = days.indexOf(dayName);
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayIndex);
      return date;
    },

    formatDate(date) {
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
      );
    },
  },
};
</script>

<style>
.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.habit-header h3 {
  color: var(--text-primary);
  font-family: Quicksand;
  font-size: 14px;
  transition: color 0.3s ease;
}

.right-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-wrapper {
  position: relative;
  display: flex;
  border: 1px solid var(--border-color);
  border-radius: 17px;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.search {
  padding: 8px 12px 8px 34px;
  outline: none;
  width: 200px;
  height: 42px;
  max-width: 100%;
  flex: 1;
  background-color: var(--input-bg);
  color: var(--input-text);
  transition: all 0.3s ease;
}

.search::placeholder {
  color: var(--input-placeholder);
}

.search:focus {
  border-color: var(--input-focus);
}

.add-habit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-habit-btn .button-img {
  width: 16px;
  height: 16px;
}

.empty-state {
  margin-top: 80px;
  text-align: center;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.empty-state p {
  color: var(--text-primary);
  font-family: Quicksand;
  font-weight: 400;
  font-size: 14px;
  transition: color 0.3s ease;
}

@media (max-width: 1024px) {
  .habit-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .right-section {
    width: 100%;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .search {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .habit-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .search-wrapper {
    position: relative;
    display: flex;
    border: 1px solid var(--border-color);
    border-radius: 15px;
    align-items: center;
    flex: 1;
  }

  .search {
    padding: 8px 12px 8px 34px;
    outline: none;
    width: 100%;
  }
  hlx-alert-notification {
    position: fixed;
    bottom: 10px;
    left: 10px;
    right: 10px;
    width: auto;
    z-index: 9999;
  }

  hlx-alert-notification::part(container) {
    width: 100%;
    font-size: 13px;
    border-radius: 8px;
  }
}
</style>
