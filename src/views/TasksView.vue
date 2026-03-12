<template>
  <div class="task-page">
    <TaskFilters ref="taskFilters" @filter-change="applyFilters" />

    <div class="task-header">
      <h3>Tasks</h3>

      <div class="right-section">
        <div class="search-wrapper">
          <img :src="Search" class="search-icon" />
          <input
            type="text"
            placeholder="Search"
            class="search"
            @input="applyFilters({ searchText: filters.searchText })"
            v-model="filters.searchText"
          />
        </div>

        <hlx-button class="primary sm add-task-btn" @click="openModal">
          <img :src="AddTask" class="button-img" />
          <span>Add Task</span>
        </hlx-button>
      </div>
    </div>

    <div v-if="filteredTasks.length === 0" class="empty-state">
      <img :src="NoTaskFound" />
      <p>No tasks found. Create your first task to get started!</p>
    </div>

    <draggable
      v-else
      v-model="filteredTasks"
      class="task-grid"
      item_key="id"
      :animation="200"
      chosen-class="drag-chosen"
      drag-class="drag-dragging"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <TaskCard
          :task="element"
          @edit-task="openEditModal"
          @delete-task="openDeleteModal"
          @task-updated="handleTaskUpdated"
          @move-up="moveTaskUp"
          @move-down="moveTaskDown"
          @show-toast="showToast"
        />
      </template>
    </draggable>

    <TaskForm
      v-if="isModalOpen"
      :key="selectedTask ? selectedTask.id : 'new'"
      :edit-task="selectedTask"
      @close="closeModal"
      @task-added="handleTaskAdded"
      @task-updated="handleTaskUpdated"
    />
    <DeleteModal
      v-if="showDeleteModal"
      :itemToDelete="taskToDeleteTitle"
      @confirm-delete="handleTaskDelete"
      @cancel-delete="cancelDelete"
    />
    <hlx-alert-notification
      :notify="notification"
      :auto-close="true"
      :delay="3000"
    />
  </div>
</template>

<script>
import TaskFilters from "@/components/tasks/TaskFilter";
import TaskForm from "@/components/tasks/TaskForm";
import TaskCard from "@/components/tasks/TaskCard";
import DeleteModal from "@/components/DeleteModal";
import NoTaskFound from "@/assets/icons/no-task-found.svg";
import AddTask from "@/assets/icons/add-task.svg";
import Search from "@/assets/icons/search.svg";
import { applyRules } from "@/utils/ruleEngine";
import draggable from "vuedraggable";

export default {
  name: "TasksView",

  components: {
    TaskFilters,
    TaskForm,
    TaskCard,
    DeleteModal,
    draggable,
  },

  data() {
    return {
      isModalOpen: false,
      tasks: [],
      filteredTasks: [],
      selectedTask: null,
      showDeleteModal: false,
      taskToDeleteId: null,
      taskToDeleteTitle: "",
      notification: {},
      NoTaskFound,
      AddTask,
      Search,
      filters: {
        status: "",
        priority: "",
        sort: "createdAt",
        searchText: "",
      },
    };
  },

  mounted() {
    this.loadTasks();
  },

  methods: {
    showToast(message) {
      this.notification = {
        type: "success",
        message: message,
      };
    },
    openModal() {
      this.selectedTask = null;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    openEditModal(task) {
      this.selectedTask = { ...task };
      this.isModalOpen = true;
    },
    openDeleteModal(task) {
      this.taskToDeleteId = task.id;
      this.taskToDeleteTitle = task.title;
      this.showDeleteModal = true;
    },
    loadTasks() {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = applyRules(tasks);
      this.tasks = tasks;
      this.applyFilters({
        status: this.filters.status || "",
        priority: this.filters.priority || "",
        sort: "createdAt",
      });
    },
    saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    applyFilters(newFilters = {}) {
      this.filters = { ...this.filters, ...newFilters };
      let result = [...this.tasks];
      if (this.filters.status !== "") {
        result = result.filter((task) => task.status === this.filters.status);
      }
      if (this.filters.priority !== "") {
        result = result.filter(
          (task) => task.priority === this.filters.priority
        );
      }
      if (this.filters.searchText && this.filters.searchText.trim() !== "") {
        const search = this.filters.searchText.trim().toLowerCase();
        result = result.filter(
          (task) =>
            (task.title && task.title.toLowerCase().includes(search)) ||
            (task.description &&
              task.description.toLowerCase().includes(search)) ||
            (task.priority && task.priority.toLowerCase().includes(search)) ||
            (task.status && task.status.toLowerCase().includes(search))
        );
      }
      switch (this.filters.sort) {
        case "createdAt":
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;

        case "dueDate":
          result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          break;

        case "priority": {
          const order = { Low: 1, Medium: 2, High: 3 };
          result.sort((a, b) => order[a.priority] - order[b.priority]);
          break;
        }

        case "asc":
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;

        case "desc":
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;

        case "none":
          break;

        default:
          break;
      }
      this.filteredTasks = result;
    },
    handleTaskAdded(newTask) {
      if (!newTask.subtasks) {
        newTask.subtasks = [];
      }

      this.tasks.push(newTask);
      this.tasks = applyRules(this.tasks);
      this.saveTasks();
      this.applyFilters(this.filters);
      this.showToast(`Nice work! Your new task
       ${newTask.title} is now in the list.`);
    },
    handleTaskUpdated(updatedTask) {
      const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
      this.tasks = applyRules(this.tasks);
      this.saveTasks();
      this.applyFilters(this.filters);
      this.showToast("All Set! Your changes have  been saved successfully!");
    },
    handleTaskDelete() {
      this.tasks = this.tasks.filter((t) => t.id !== this.taskToDeleteId);
      this.saveTasks();
      this.applyFilters(this.filters);
      this.showDeleteModal = false;
      this.showToast("Done! Your item has been removed.");
    },
    cancelDelete() {
      this.showDeleteModal = false;
    },

    moveTaskUp(task) {
      const index = this.tasks.findIndex((t) => t.id === task.id);

      if (index > 0) {
        const temp = this.tasks[index - 1];
        this.tasks[index - 1] = this.tasks[index];
        this.tasks[index] = temp;
        this.saveTasks();
        this.filters.sort = "none";
        this.$refs.taskFilters.setSort({ key: "None", value: "none" });
      }
    },

    moveTaskDown(task) {
      const index = this.tasks.findIndex((t) => t.id === task.id);

      if (index < this.tasks.length - 1) {
        const temp = this.tasks[index + 1];
        this.tasks[index + 1] = this.tasks[index];
        this.tasks[index] = temp;
        this.saveTasks();
        this.filters.sort = "none";
        this.$refs.taskFilters.setSort({ key: "None", value: "none" });
      }
    },
    onDragEnd() {
      this.tasks = [...this.filteredTasks];
      this.saveTasks();

      this.filters.sort = "none";
      this.$refs.taskFilters.setSort({ key: "None", value: "none" });
    },
  },
};
</script>

<style scoped>
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.task-header h3 {
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
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 17px;
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  pointer-events: none;
  filter: var(--icon-filter, none);
}

.search {
  padding: 8px 12px 8px 34px;
  border: none;
  outline: none;
  width: 200px;
  height: 42px;
  max-width: 100%;
  flex: 1;
  background-color: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.search::placeholder {
  color: var(--input-placeholder);
}

.search:focus {
  border-color: var(--input-focus);
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-task-btn .button-img {
  width: 17px;
  height: 15px;
}

.task-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
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

.task-card {
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  transition: all 0.3s ease;
}

.highlight-task {
  border: 2px solid var(--highlight-color);
}

.drag-ghost {
  opacity: 0.5;
  background: var(--bg-tertiary);
}

.drag-chosen {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.drag-dragging {
  cursor: grabbing;
}

.task-card:hover {
  cursor: grab;
}

@media (max-width: 1024px) {
  .task-grid {
    grid-template-columns: 1fr;
  }

  .task-header {
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
  .task-header {
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
    border: none;
    outline: none;
    width: 100%;
  }

  .task-grid {
    grid-template-columns: 1fr;
  }
}
</style>
