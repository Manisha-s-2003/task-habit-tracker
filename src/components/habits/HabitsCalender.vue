<template>
  <div class="last7-wrapper">
    <p class="title">Last 7 days</p>

    <div class="calendar-position">
      <div
        v-for="day in calendarDays"
        :key="day.fullDate"
        class="day-container"
      >
        <div
          class="day-box"
          :class="[day.status, { clickable: day.isClickable }]"
          @click="handleDateClick(day)"
        >
          <span class="date">{{ day.date }}</span>
        </div>
        <small class="label">{{ day.label }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    habit: Object,
  },

  data() {
    return {
      calendarDays: [],
    };
  },

  mounted() {
    this.generateCalendar();
  },

  watch: {
    habit: {
      handler() {
        this.generateCalendar();
      },
      deep: true,
    },
  },

  methods: {
    handleDateClick(day) {
      if (!day.isClickable) return;
      this.$emit("date-clicked", day.fullDate);
    },
    generateCalendar() {
      const today = new Date();
      const frequency = this.habit.frequency.toLowerCase();
      let days = [];
      switch (frequency) {
        case "daily":
          {
            let startDate = new Date(today);
            if (this.habit.createdAt) {
              const createdDate = new Date(this.habit.createdAt);
              createdDate.setHours(0, 0, 0, 0);
              const todayDate = new Date(today);
              todayDate.setHours(0, 0, 0, 0);

              if (createdDate <= todayDate) {
                const daysDiff = Math.floor(
                  (todayDate - createdDate) / (1000 * 60 * 60 * 24)
                );
                if (daysDiff <= 6) {
                  startDate = createdDate;
                } else {
                  startDate.setDate(today.getDate() - 6);
                }
              }
            }

            // Generate 7 days starting from startDate
            for (let i = 0; i < 7; i++) {
              const d = new Date(startDate);
              d.setDate(startDate.getDate() + i);
              days.push(this.createDayObject(d));
            }
          }
          break;

        case "weekly":
          {
            const targetDay = this.habit.weeklyDay;
            let weeklyDate = new Date(today);
            while (
              weeklyDate.toLocaleDateString("en-us", { weekday: "long" }) !==
              targetDay
            ) {
              weeklyDate.setDate(weeklyDate.getDate() + 1);
              for (let i = 0; i < 7; i++) {
                days.push(this.createDayObject(new Date(weeklyDate)));
                weeklyDate.setDate(weeklyDate.getDate() + 7);
              }
            }
          }
          break;

        case "custom":
          {
            const selectedDays = (this.habit.customDays || []).map(
              (day) => day.value
            );
            if (selectedDays.length === 0) {
              this.calendarDays = [];
              return;
            }

            // Start from creation date
            let startDate = new Date(today);
            if (this.habit.createdAt) {
              const createdDate = new Date(this.habit.createdAt);
              createdDate.setHours(0, 0, 0, 0);
              startDate = createdDate;
            }

            let customDate = new Date(startDate);
            let addedDays = 0;
            let safety = 0;

            // Collect days from creation date onwards
            while (addedDays < 7 && safety < 60) {
              const weekday = customDate.toLocaleDateString("en-us", {
                weekday: "long",
              });

              // Only include days that match the selected custom days
              if (selectedDays.includes(weekday)) {
                const dayObj = this.createDayObject(new Date(customDate));

                // Only add if it's a future day or a completed day
                const checkDate = new Date(customDate);
                checkDate.setHours(0, 0, 0, 0);
                const todayDate = new Date(today);
                todayDate.setHours(0, 0, 0, 0);

                if (checkDate >= todayDate || dayObj.status === "completed") {
                  days.push(dayObj);
                  addedDays++;
                }
              }
              customDate.setDate(customDate.getDate() + 1);
              safety++;
            }
          }
          break;

        default:
          break;
      }
      days.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
      this.calendarDays = days;
    },
    createDayObject(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      const formattedDate = this.formattedDate(checkDate);
      let status = "pending";
      if (this.habit.progress && this.habit.progress[formattedDate]) {
        status = this.habit.progress[formattedDate];
      } else if (checkDate < today) {
        const frequency = this.habit.frequency.toLowerCase();
        if (frequency == "daily" && this.shouldTrackDate(checkDate)) {
          status = "missed";
        } else {
          status = "pending";
        }
      }

      // Determine if date is clickable (today or past dates that should be tracked)
      const isClickable = checkDate <= today && this.shouldTrackDate(checkDate);

      return {
        label: date.toLocaleString("en-us", { weekday: "short" }),
        date: date.getDate(),
        // fullDate: date.toISOString().split("T")[0],
        fullDate: formattedDate,
        status: status,
        isClickable: isClickable,
      };
    },
    shouldTrackDate(date) {
      const frequency = this.habit.frequency.toLowerCase();
      const dayName = date.toLocaleDateString("en-us", { weekday: "long" });

      if (frequency === "daily") {
        return true;
      } else if (frequency === "weekly") {
        return dayName === this.habit.weeklyDay;
      } else if (frequency === "custom") {
        const selectedDays = (this.habit.customDays || []).map((d) => d.value);
        return selectedDays.includes(dayName);
      }
      return false;
    },
    formattedDate(date) {
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
.last7-wrapper {
  margin-top: 20px;
}

.title {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  font-family: Quicksand;
}

.calendar-position {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-box {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.date {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.label {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.day-box.completed {
  background: #15803d;
  color: white;
}

.day-box.completed .date {
  color: white;
}

.day-box.missed {
  background: #dc2626;
  color: white;
}

.day-box.missed .date {
  color: white;
}

.day-box.pending {
  background: #e5e7eb;
}

body.dark-theme .day-box.pending {
  background: #374151;
}

body.dark-theme .day-box.pending .date {
  color: #ffffff;
}

.day-box.not-tracked {
  background: #f3f4f6;
  color: #9ca3af;
}

body.dark-theme .day-box.not-tracked {
  background: #1f2937;
  color: #6b7280;
}

.day-box.clickable {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.day-box.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

body.dark-theme .day-box.clickable:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.date {
  font-size: 14px;
}

.label {
  font-size: 11px;
}

@media (min-width: 768px) {
  .calendar-position {
    gap: 12px;
  }

  .day-box {
    height: 42px;
  }

  .date {
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .calendar-position {
    gap: 6px;
  }

  .day-box {
    height: 32px;
  }

  .date {
    font-size: 12px;
  }

  .label {
    font-size: 10px;
  }
}
</style>
