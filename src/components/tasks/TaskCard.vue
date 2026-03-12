<template>
  <div
    class="task-card"
    :class="{ 'highlight-task': task.ruleHighlight }"
    :style="
      task.ruleHighlight ? { '--highlight-color': task.ruleHighlight } : {}
    "
  >
    <div class="card-actions">
      <button @click="$emit('move-up', task)">
        <p
          class="bg-default border"
          data-tooltip="Move Up"
          data-tooltip-location="bottom"
        >
          <i class="icon-angle-up-filled"></i>
        </p>
      </button>
      <button @click="$emit('move-down', task)">
        <p
          class="bg-default border"
          data-tooltip="Move Down"
          data-tooltip-location="bottom"
        >
          <i class="icon-angle-down-filled"></i>
        </p>
      </button>
      <button @click="$emit('edit-task', task)">
        <p
          class="bg-default border"
          data-tooltip="Edit"
          data-tooltip-location="bottom"
        >
          <img :src="EditIcon" />
        </p>
      </button>
      <button @click="$emit('delete-task', task)">
        <p
          class="bg-default border"
          data-tooltip="Delete"
          data-tooltip-location="bottom"
        >
          <img :src="DeleteIcon" />
        </p>
      </button>
    </div>

    <h4 :class="{ 'completed-task': task.status === 'Completed' }">
      {{ task.title }}
    </h4>
    <p :class="{ 'completed-task': task.status === 'Completed' }">
      {{ task.description }}
    </p>
    <div class="meta">
      <span class="priority" :class="task.priority.toLowerCase()">
        <img :src="PriorityFlag" /> {{ task.priority }}
      </span>
      <span class="due-date">
        <img :src="Calender" /> {{ formattedDueDate }}
      </span>
      <div v-if="task.ruleBadge" class="rule-badge">
        {{ task.ruleBadge }}
      </div>
    </div>

    <div class="status">
      <label>Status</label>
      <div class="status-select">
        <hlx-select
          :pre-value="task.status"
          :options="[
            { name: 'Todo', value: 'Todo' },
            { name: 'In progress', value: 'In progress' },
            { name: 'Completed', value: 'Completed' },
            { name: 'On hold', value: 'On hold' },
          ]"
          :placeholder-value="'Status'"
          :clearable="false"
          @change="onStatusChange"
        />
      </div>
    </div>
    <div class="subtask-section">
      <div class="subtask-header" @click="toggleSubtasks">
        <span class="icon-angle-right-filled" :class="{ open: isSubtaskOpen }">
        </span>
        <span>Subtasks ({{ subtasks.length }})</span>
      </div>

      <div v-if="isSubtaskOpen" class="subtask-body">
        <div class="add-subtask">
          <div class="subtask-input-wrapper">
            <input
              v-model="newSubtask"
              type="text"
              placeholder="Add subtask"
              @keyup.enter="addSubtask"
            />
          </div>
          <hlx-button class="primary" @click="addSubtask">
            <i class="icon-plus-filled"></i>
          </hlx-button>
        </div>

        <div
          v-for="(subtask, index) in subtasks"
          :key="index"
          class="subtask-item"
        >
          <label class="custom-checkbox">
            <input type="checkbox" v-model="subtask.completed" />
            <span class="checkmark"></span>
          </label>
          <span :class="{ completed: subtask.completed }">
            {{ subtask.title }}
          </span>

          <div class="subtask-actions">
            <button @click="editSubtask(index)">
              <p
                class="bg-default border"
                data-tooltip="Edit"
                data-tooltip-location="bottom"
              >
                <img :src="EditIcon" />
              </p>
            </button>
            <button @click="deleteSubtask(index)">
              <p
                class="bg-default border"
                data-tooltip="Delete"
                data-tooltip-location="bottom"
              >
                <img :src="DeleteIcon" />
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
import PriorityFlag from "@/assets/icons/priority-flag.svg";
import Calender from "@/assets/icons/calender.svg";

export default {
  name: "TaskCard",
  props: {
    task: Object,
  },
  data() {
    return {
      EditIcon,
      DeleteIcon,
      PriorityFlag,
      Calender,
      taskStatus: this.task.status,
      isSubtaskOpen: false,
      newSubtask: "",
      editingIndex: null,
    };
  },
  computed: {
    formattedDueDate() {
      if (!this.task.dueDate) return "";
      const date = new Date(this.task.dueDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    subtasks() {
      return this.task.subtasks || [];
    },
  },
  watch: {
    "task.status"(val) {
      this.taskStatus = val;
    },
  },
  methods: {
    toggleSubtasks() {
      this.isSubtaskOpen = !this.isSubtaskOpen;
    },
    onStatusChange(newStatus) {
      this.taskStatus = newStatus;
      const updatedTask = {
        ...this.task,
        status: newStatus,
      };

      this.$emit("task-updated", updatedTask);
    },
    addSubtask() {
      if (!this.newSubtask.trim()) return;
      const updatedSubtasks = [...this.subtasks];
      if (this.editingIndex !== null) {
        updatedSubtasks[this.editingIndex].title = this.newSubtask;
        this.$emit(
          "show-toast",
          "All Set! Your changes have  been saved successfully!"
        );
        this.editingIndex = null;
      } else {
        updatedSubtasks.push({
          title: this.newSubtask,
          completed: false,
        });
        this.$emit(
          "show-toast",
          `Nice work! Your new subtask <strong>${this.newSubtask}</strong> is now in the list.`
        );
      }
      const updatedTask = {
        ...this.task,
        subtasks: updatedSubtasks,
      };
      this.newSubtask = "";
      this.$emit("task-updated", updatedTask);
    },
    editSubtask(index) {
      this.newSubtask = this.subtasks[index].title;
      this.editingIndex = index;
    },

    deleteSubtask(index) {
      const updatedSubtasks = [...this.subtasks];
      updatedSubtasks.splice(index, 1);
      const updatedTask = {
        ...this.task,
        subtasks: updatedSubtasks,
      };
      this.$emit("task-updated", updatedTask);
      this.$emit("show-toast", "Done! Your item has been removed.");
    },

    emitSubtaskUpdate() {
      const updatedTask = {
        ...this.task,
        subtasks: this.subtasks,
      };
      this.$emit("task-updated", updatedTask);
    },
  },
};
</script>

<style scoped>
.task-card {
  background: var(--card-bg);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-top: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.task-card h4 {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  transition: color 0.3s ease;
}

.task-card h4.completed-task {
  text-decoration: line-through;
  color: var(--text-tertiary);
}

.task-card p {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 400;
  transition: color 0.3s ease;
}

.task-card p.completed-task {
  text-decoration: line-through;
  color: var(--text-tertiary);
}

.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
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
  flex-wrap: wrap;
}

.meta img {
  padding-right: 5px;
  padding-left: 3px;
}

.priority {
  border: 1px solid;
  border-radius: 9px;
  padding: 5px;
  color: #ffffff;
  font-weight: 400;
  font-size: 12px;
}

.priority.high {
  background-color: var(--priority-high);
  border-color: var(--priority-high);
}

.priority.medium {
  background-color: var(--priority-medium);
  border-color: var(--priority-medium);
}

.priority.low {
  background-color: var(--priority-low);
  border-color: var(--priority-low);
}

.due-date {
  border: 1px solid var(--border-color);
  border-radius: 9px;
  padding: 5px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.rule-badge {
  border: 1px solid var(--border-color);
  border-radius: 9px;
  padding: 5px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.status {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 0;
}

.status label {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 400;
  transition: color 0.3s ease;
}

.status-select-wrapper {
  width: 180px;
}

.subtask-section {
  margin-top: 16px;
}

.subtask-header {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.icon-angle-right-filled {
  display: inline-block;
  transition: transform 0.2s ease;
  font-weight: bold;
}

.icon-angle-right-filled.open {
  transform: rotate(90deg);
}

.subtask-body {
  margin-top: 10px;
}

.add-subtask {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  align-items: stretch;
}

.subtask-input-wrapper {
  position: relative;
  flex: 1;
}

.subtask-input-wrapper input {
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background-color: var(--input-bg);
  color: var(--input-text);
  transition: all 0.3s ease;
}

.subtask-input-wrapper input::placeholder {
  color: var(--input-placeholder);
}

.subtask-input-wrapper input:focus {
  border-color: var(--input-focus);
}

.add-subtask .primary {
  height: auto;
  min-height: 38px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.subtask-item span {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.subtask-item span.completed {
  text-decoration: line-through;
  color: var(--text-tertiary);
}

.subtask-actions {
  display: flex;
  gap: 6px;
}

.subtask-actions button {
  background: transparent;
  border: none;
  cursor: pointer;
}

.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.custom-checkbox input {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
}

.custom-checkbox input:checked + .checkmark {
  background-color: var(--success-color);
  border-color: var(--success-color);
}

.custom-checkbox input:checked + .checkmark::after {
  content: "";
  display: block;
  position: absolute;
  left: 3px;
  top: 0;
  width: 5px;
  height: 10px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.edit-indicator {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  opacity: 0.6;
}
</style>
