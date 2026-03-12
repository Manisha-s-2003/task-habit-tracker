<template>
  <div class="overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="header-top">
          <h3>{{ isEditMode ? "Edit Habit" : "Add Habit" }}</h3>
          <button @click="$emit('close')" class="close-btn">
            <img :src="CloseIcon" alt="X" />
          </button>
        </div>
        <p class="subtitle">
          {{
            isEditMode
              ? "Modify existing habit information and schedule."
              : "Create a new habit to track daily,weekly, or on custom days."
          }}
        </p>
      </div>

      <div class="form">
        <div class="form-group">
          <hlx-input
            v-model:value="habit.name"
            :pre-val="habit.name"
            :label-animation="true"
            label-value="Habit name"
            type="text"
            required="true"
            :display-error="fieldError.name.error"
            :custom-error="fieldError.name.error"
            :custom-error-message="fieldError.name.message"
          />
        </div>
        <div class="form-group">
          <hlx-input
            v-model:value="habit.description"
            :pre-val="habit.description"
            :label-animation="true"
            label-value="Description"
            type="textarea"
          />
        </div>
        <div class="form-group">
          <hlx-select
            v-model:value="habit.frequency"
            :pre-value="habit.frequency"
            :label-animation="true"
            :options="frequencyOptions"
            label-value="Description"
            :placeholder-value="'Frequency'"
            required
            :display-error="fieldError.frequency.error"
            :custom-error="fieldError.frequency.message"
          />
        </div>
        <div class="form-group" v-if="habit.frequency === 'Weekly'">
          <hlx-select
            v-model:value="habit.weeklyDay"
            :pre-value="habit.weeklyDay"
            :options="daysOfWeek"
            :label-animation="true"
            label-value="Choose Day"
            :placeholder-value="'Choose Day'"
            required
            :display-error="fieldError.weeklyDay.error"
            :custom-error="fieldError.weeklyDay.message"
          />
        </div>
        <div class="form-group" v-if="habit.frequency === 'Custom'">
          <hlx-multi-select
            v-model:value="habit.customDays"
            :pre-value="habit.customDays"
            :required="true"
            :display-error="fieldError.customDays.error"
            :custom-error="fieldError.customDays.message"
            :options="daysOfWeek"
            :placeholder="'Choose Day'"
            :label-animation="true"
            :prop-value="'value'"
            :label="'name'"
            @selected-array="getSelectedDays"
          />
        </div>
        <div class="actions">
          <div class="actions-button">
            <hlx-button
              type="button"
              class="secondary sm"
              @click="$emit('close')"
            >
              Cancel
            </hlx-button>
            <hlx-button
              type="button"
              class="primary sm"
              @click="submitHabitForm"
            >
              {{ isEditMode ? "Save" : "Submit" }}
            </hlx-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/assets/icons/close.svg";
export default {
  name: "HabitsForm",
  props: {
    editHabit: Object,
  },
  data() {
    return {
      habit: {
        name: "",
        description: "",
        frequency: "",
        weeklyDay: "",
        customDays: [],
        progress: {},
        completedStreak: 0,
        missedStreak: 0,
        createdAt: "",
      },
      isEditMode: false,
      CloseIcon,
      frequencyOptions: [
        { name: "Daily", value: "Daily" },
        { name: "Weekly", value: "Weekly" },
        { name: "Custom", value: "Custom" },
      ],
      daysOfWeek: [
        { name: "Monday", value: "Monday" },
        { name: "Tuesday", value: "Tuesday" },
        { name: "Wednesday", value: "Wednesday" },
        { name: "Thursday", value: "Thursday" },
        { name: "Friday", value: "Friday" },
        { name: "Saturday", value: "Saturday" },
        { name: "Sunday", value: "Sunday" },
      ],
      fieldError: {
        name: { error: false, message: "" },
        frequency: { error: false, message: "" },
        weeklyDay: { error: false, message: "" },
        customDays: { error: false, message: "" },
      },
    };
  },
  watch: {
    editHabit: {
      immediate: true,
      handler(newHabit) {
        if (newHabit) {
          this.habit = { ...newHabit };
          this.isEditMode = true;
        }
      },
    },
  },
  mounted() {
    // Lock body scroll when modal opens
    document.body.classList.add("modal-open");

    // Force dark theme styles on hlx components
    this.$nextTick(() => {
      this.applyDarkThemeStyles();
    });
  },
  beforeUnmount() {
    // Unlock body scroll when modal closes
    document.body.classList.remove("modal-open");
  },
  methods: {
    applyDarkThemeStyles() {
      if (!document.body.classList.contains("dark-theme")) return;

      // Force styles on all inputs, textareas, and selects
      const inputs = this.$el.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        input.style.setProperty("background-color", "#0a0a0a", "important");
        input.style.setProperty("color", "#ffffff", "important");
        input.style.setProperty("border-color", "#374151", "important");
      });

      // Force styles on all labels (floating labels)
      const labels = this.$el.querySelectorAll("label, [class*='label']");
      labels.forEach((label) => {
        label.style.setProperty("color", "#ffffff", "important");
        label.style.setProperty("background-color", "transparent", "important");
      });

      // Force all wrapper divs and spans to be transparent
      const allElements = this.$el.querySelectorAll("div, span");
      allElements.forEach((el) => {
        if (
          el.tagName !== "INPUT" &&
          el.tagName !== "TEXTAREA" &&
          el.tagName !== "SELECT" &&
          el.tagName !== "LABEL" &&
          el.tagName !== "BUTTON"
        ) {
          el.style.setProperty("background-color", "transparent", "important");
        }
      });
    },

    getSelectedDays(data) {
      this.habit.customDays = data;
    },
    submitHabitForm() {
      if (!this.validationHabitForm()) return;
      if (this.isEditMode) {
        this.$emit("task-updated", { ...this.habit });
      } else {
        const habitData = {
          ...this.habit,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        this.$emit("task-added", habitData);
      }
      this.$emit("close");
    },
    validationHabitForm() {
      let isValid = true;

      Object.keys(this.fieldError).forEach((key) => {
        this.fieldError[key].error = false;
        this.fieldError[key].message = "";
      });

      if (!this.habit.name.trim()) {
        this.fieldError.name.error = true;
        this.fieldError.name.message = "Please fill this field";
        isValid = false;
      }

      if (!this.habit.frequency) {
        this.fieldError.frequency.error = true;
        this.fieldError.frequency.message = "Please fill this field";
        isValid = false;
      }

      if (this.habit.frequency === "Weekly" && !this.habit.weeklyDay) {
        this.fieldError.weeklyDay.error = true;
        this.fieldError.weeklyDay.message = "Please fill this field";
        isValid = false;
      }

      if (
        this.habit.frequency === "Custom" &&
        this.habit.customDays.length === 0
      ) {
        this.fieldError.customDays.error = true;
        this.fieldError.customDays.message = "Please fill this field";
        isValid = false;
      }

      return isValid;
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--modal-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  z-index: 1000;
}

.modal {
  width: 400px;
  background: var(--modal-bg);
  padding: 20px;
  border-radius: 5px;
  position: relative;
  z-index: 1001;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.modal-header {
  padding: 5px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 16px;
  margin: 0;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  border: none;
  background: transparent;
  cursor: pointer;
}

.subtitle {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  transition: color 0.3s ease;
}

.form {
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  position: relative;
  width: 100%;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 2x;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.actions-button {
  display: flex;
  margin-top: 7px;
  gap: 15px;
}

/* Deep styles for hlx components */
:deep(.hlx-input-wrapper),
:deep(.hlx-input-container),
:deep(.hlx-input),
:deep(.hlx-select-wrapper),
:deep(.hlx-select-container),
:deep(.hlx-select),
:deep(.hlx-multi-select-wrapper),
:deep(.hlx-multi-select-container),
:deep(.hlx-multi-select) {
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
}

:deep(.hlx-input-wrapper input),
:deep(.hlx-input-container input),
:deep(.hlx-input input),
:deep(.hlx-input-wrapper textarea),
:deep(.hlx-input-container textarea),
:deep(.hlx-input textarea),
:deep(.hlx-select-wrapper input),
:deep(.hlx-select-container input),
:deep(.hlx-select input),
:deep(.hlx-multi-select-wrapper input),
:deep(.hlx-multi-select-container input),
:deep(.hlx-multi-select input) {
  background-color: var(--input-bg) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

:deep(.hlx-input-wrapper input::placeholder),
:deep(.hlx-input-container input::placeholder),
:deep(.hlx-input input::placeholder),
:deep(.hlx-input-wrapper textarea::placeholder),
:deep(.hlx-input-container textarea::placeholder),
:deep(.hlx-input textarea::placeholder) {
  color: var(--input-placeholder) !important;
}

:deep(.hlx-input-wrapper label),
:deep(.hlx-input-container label),
:deep(.hlx-select-wrapper label),
:deep(.hlx-select-container label),
:deep(.hlx-multi-select-wrapper label),
:deep(.hlx-multi-select-container label) {
  color: var(--text-primary) !important;
}

:deep(.hlx-select-dropdown),
:deep(.hlx-select-menu),
:deep(.hlx-dropdown-menu),
:deep(.hlx-multi-select-dropdown),
:deep(.hlx-multi-select-menu) {
  background-color: var(--card-bg) !important;
  border-color: var(--border-color) !important;
}

:deep(.hlx-select-option),
:deep(.hlx-option),
:deep(.hlx-multi-select-option) {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
}

:deep(.hlx-select-option:hover),
:deep(.hlx-option:hover),
:deep(.hlx-multi-select-option:hover) {
  background-color: var(--bg-secondary) !important;
}

/* Date picker icon */
:deep(.hlx-input-wrapper .icon),
:deep(.hlx-input-container .icon),
:deep(.hlx-input .icon) {
  filter: invert(1) brightness(1.2);
}

/* Multi-select tags/chips */
:deep(.hlx-tag),
:deep(.hlx-chip),
:deep(.hlx-selected-item) {
  background-color: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}
</style>
