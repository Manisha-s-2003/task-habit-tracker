<template>
  <div class="overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="header-top">
          <h3>{{ isEditMode ? "Edit task" : "Add Task" }}</h3>
          <button @click="$emit('close')" class="close-btn">
            <img :src="CloseIcon" alt="X" />
          </button>
        </div>
        <p class="subtitle">
          {{
            isEditMode
              ? "Modify the existing task information."
              : "Add a new task with details, priority, and due date."
          }}
        </p>
      </div>

      <div class="form">
        <div class="form-group">
          <hlx-input
            v-model:value="task.title"
            :pre-val="task.title"
            :label-animation="true"
            label-value="Task Title"
            type="text"
            required="true"
            :display-error="fieldError.title.error"
            :custom-error="fieldError.title.error"
            :custom-error-message="fieldError.title.message"
          />
        </div>

        <div class="form-group">
          <hlx-input
            v-model:value="task.description"
            :pre-val="task.description"
            :label-animation="true"
            label-value="Description"
            type="textarea"
          />
        </div>

        <div class="form-group">
          <hlx-input
            v-model:value="task.dueDate"
            type="date"
            label-value="Due Date"
            :label-animation="true"
            :date-format="currentDateFormat"
            :clearable="false"
            icon="calendar-regular"
            icon-position="right"
            :required="true"
            :display-error="fieldError.dueDate.error"
            :custom-error="fieldError.dueDate.error"
            :custom-error-message="fieldError.dueDate.message"
            :pre-val="task.dueDate"
          />
        </div>

        <div class="form-group">
          <hlx-select
            v-model:value="task.priority"
            :pre-value="task.priority"
            :options="priority_data"
            :placeholder-value="'Priority'"
            :label-animation="true"
            :label="'name'"
            :prop-value="'value'"
            required
            :display-error="fieldError.priority.error"
            :custom-error="fieldError.priority.message"
          >
          </hlx-select>
        </div>

        <div class="form-group">
          <hlx-select
            v-model:value="task.status"
            :pre-value="task?.status"
            :options="status_data"
            :placeholder-value="'Status'"
            :label-animation="true"
            :label="'value'"
            :prop-value="'value'"
            :display-error="true"
            required
          >
          </hlx-select>
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
            <hlx-button class="primary sm" type="button" @click="submitForm">
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
  name: "AddTaskModal",

  emits: ["close", "task-added", "task-updated"],

  props: {
    editTask: Object,
  },

  data() {
    return {
      priority_data: [
        { name: "Low", value: "Low" },
        { name: "Medium", value: "Medium" },
        { name: "High", value: "High" },
      ],
      status_data: [
        { name: "Todo", value: "Todo" },
        { name: "In progress", value: "In progress" },
        { name: "On hold", value: "On hold" },
        { name: "Completed", value: "Completed" },
      ],
      task: {
        id: null,
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "Todo",
        createdAt: new Date().toISOString(),
        subtasks: [],
      },
      fieldError: {
        title: {
          error: false,
          message: "",
        },
        dueDate: {
          error: false,
          message: "",
        },
        priority: {
          error: false,
          message: "",
        },
      },
      dueDateInputType: "text",
      dueDatePlaceholder: "Due Date",
      CloseIcon,
    };
  },

  mounted() {
    // Lock body scroll when modal opens
    document.body.classList.add("modal-open");

    if (this.editTask) {
      this.task = { ...this.editTask, subtasks: this.editTask.subtasks || [] };
    } else {
      this.task.id = Date.now();
    }

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

    submitForm() {
      if (!this.validateForm()) {
        return;
      }
      if (this.isEditMode) {
        this.$emit("task-updated", this.task);
      } else {
        this.$emit("task-added", this.task);
      }
      this.$emit("close");
    },
    resetForm() {
      this.task = {
        id: Date.now(),
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "Todo",
        createdAt: new Date().toISOString(),
        subtasks: [],
      };
    },
    validateForm() {
      let isValid = true;
      Object.keys(this.fieldError).forEach((key) => {
        this.fieldError[key].error = false;
        this.fieldError[key].message = "";
      });

      Object.keys(this.fieldError).forEach((field) => {
        switch (field) {
          case "title":
            if (!this.task.title?.trim()) {
              this.fieldError.title.error = true;
              this.fieldError.title.message = "Please fill this field";
              isValid = false;
            }
            break;

          case "dueDate":
            if (!this.task.dueDate) {
              this.fieldError.dueDate.error = true;
              this.fieldError.dueDate.message = "Please fill this field";
              isValid = false;
            }
            break;

          case "priority":
            if (!this.task.priority) {
              this.fieldError.priority.error = true;
              this.fieldError.priority.message = "Please fill this field";
              isValid = false;
            }
            break;

          default:
            break;
        }
      });

      return isValid;
    },
  },

  computed: {
    isEditMode() {
      return !!this.editTask;
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
  margin-top: 2px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.actions-button {
  display: flex;
  margin-top: 7px;
  gap: 15px;
}

.error-text {
  color: var(--error-color);
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.error-field ::v-deep input,
.error-field ::v-deep textarea,
.error-field ::v-deep .hlx-input-wrapper,
.error-field ::v-deep .hlx-select-wrapper {
  border-color: var(--error-color) !important;
}

/* Deep styles for hlx components */
:deep(.hlx-input-wrapper),
:deep(.hlx-input-container),
:deep(.hlx-input),
:deep(.hlx-select-wrapper),
:deep(.hlx-select-container),
:deep(.hlx-select) {
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
:deep(.hlx-select input) {
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
:deep(.hlx-select-container label) {
  color: var(--text-primary) !important;
}

:deep(.hlx-select-dropdown),
:deep(.hlx-select-menu),
:deep(.hlx-dropdown-menu) {
  background-color: var(--card-bg) !important;
  border-color: var(--border-color) !important;
}

:deep(.hlx-select-option),
:deep(.hlx-option) {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
}

:deep(.hlx-select-option:hover),
:deep(.hlx-option:hover) {
  background-color: var(--bg-secondary) !important;
}

/* Date picker icon */
:deep(.hlx-input-wrapper .icon),
:deep(.hlx-input-container .icon),
:deep(.hlx-input .icon) {
  filter: invert(1) brightness(1.2);
}
</style>
