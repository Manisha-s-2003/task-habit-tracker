<template>
  <div
    class="task-card"
    :class="{ 'rule-highlight': habit.ruleHighlight }"
    :style="
      habit.ruleHighlight && habit.ruleHighlightColor
        ? { borderColor: habit.ruleHighlightColor }
        : {}
    "
  >
    <div class="card-actions">
      <button @click="$emit('edit-habit', habit)">
        <p
          class="bg-default border"
          data-tooltip="Edit"
          data-tooltip-location="bottom"
        >
          <img :src="EditIcon" />
        </p>
      </button>
      <button @click="$emit('delete-habit', habit)">
        <p
          class="bg-default border"
          data-tooltip="Delete"
          data-tooltip-location="bottom"
        >
          <img :src="DeleteIcon" />
        </p>
      </button>
      <hlx-button
        class="secondary-success sm"
        @click="handleCompleteClick"
        :disabled="!isHabitDay"
        :class="{ 'completed-btn': isCompletedToday }"
      >
        {{ buttonText }}
      </hlx-button>
    </div>

    <!-- <div v-if="habit.ruleBadge" class="rule-badge">
      {{ habit.ruleBadge }}
    </div> -->

    <h4>{{ habit.name }}</h4>
    <p>{{ habit.description }}</p>
    <div class="meta">
      <span class="frequency">
        <img :src="Calender" /> {{ habit.frequency }}
      </span>
      <span class="streak">
        <img :src="StreakIcon" /> {{ habit.completedStreak || 0 }} day streak
      </span>
    </div>
    <HabitCalendar :habit="habit" @date-clicked="handleDateClick" />
  </div>
</template>

<script>
import HabitCalendar from "./HabitsCalender.vue";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
import Calender from "@/assets/icons/calender.svg";
import StreakIcon from "@/assets/icons/streak.svg";

export default {
  name: "HabitCard",
  components: {
    HabitCalendar,
  },
  props: {
    habit: Object,
  },
  data() {
    return {
      EditIcon,
      DeleteIcon,
      Calender,
      StreakIcon,
    };
  },
  computed: {
    isCompletedToday() {
      if (!this.habit.progress) return false;
      const today = new Date();
      const todayKey =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
      return this.habit.progress[todayKey] === "completed";
    },
    isHabitDay() {
      const today = new Date().toLocaleString("en-us", { weekday: "long" });
      const frequency = this.habit.frequency.toLowerCase();
      if (frequency === "daily") {
        return true;
      }
      if (frequency === "weekly") {
        return today === this.habit.weeklyDay;
      }
      if (frequency === "custom") {
        const selectedDays = (this.habit.customDays || []).map((d) => d.value);
        return selectedDays.includes(today);
      }

      return false;
    },
    buttonText() {
      if (!this.isHabitDay) {
        return "Mark complete";
      }
      return this.isCompletedToday ? "Completed" : "Mark Completed";
    },
  },
  methods: {
    handleCompleteClick() {
      if (this.isHabitDay) {
        this.$emit("complete-habit", this.habit);
      }
    },
    handleDateClick(dateKey) {
      this.$emit("toggle-date", { habit: this.habit, dateKey });
    },
  },
};
</script>

<style>
.task-card {
  background: var(--card-bg);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-top: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.task-card.rule-highlight {
  border: 2px solid;
}

.task-card h4 {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  transition: color 0.3s ease;
}

.task-card p {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 400;
  transition: color 0.3s ease;
}
.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 12px;
}

.card-actions button {
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  cursor: pointer;
}

.card-actions img {
  width: 18px;
  height: 18px;
  display: block;
}

.meta {
  display: flex;
  gap: 15px;
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.meta img {
  padding-right: 5px;
  padding-left: 3px;
}

.frequency {
  border: 1px solid var(--border-color);
  border-radius: 9px;
  padding: 5px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.streak {
  border: 1px solid var(--border-color);
  border-radius: 9px;
  padding: 5px;
  background-color: #ff69001a;
  color: #ca3500;
}

.completed-btn {
  background-color: transparent !important;
  color: #10b981 !important;
  border: 2px solid #10b981 !important;
}

.completed-btn:hover {
  background-color: rgba(16, 185, 129, 0.1) !important;
  color: #10b981 !important;
  border: 2px solid #10b981 !important;
}

.rule-badge {
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

/* Dark theme button styles */
body.dark-theme .card-actions hlx-button.secondary-success {
  background-color: transparent !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
}

body.dark-theme
  .card-actions
  hlx-button.secondary-success:hover:not(:disabled) {
  background-color: var(--button-secondary-hover) !important;
}

body.dark-theme .card-actions hlx-button.secondary-success:disabled {
  background-color: transparent !important;
  color: var(--text-secondary) !important;
  border: 1px solid var(--border-color) !important;
  opacity: 0.6;
  cursor: not-allowed;
}

body.dark-theme .card-actions hlx-button.completed-btn {
  background-color: transparent !important;
  color: #10b981 !important;
  border: 2px solid #10b981 !important;
}

body.dark-theme .card-actions hlx-button.completed-btn:hover {
  background-color: rgba(16, 185, 129, 0.1) !important;
  color: #10b981 !important;
  border: 2px solid #10b981 !important;
}
</style>
