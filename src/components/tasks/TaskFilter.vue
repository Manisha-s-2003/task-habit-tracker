<template>
  <div class="filters">
    <div class="filters-row">
      <div class="filter-label">
        <img :src="Filter" class="filter-icon" />
        <span>Filters:</span>
      </div>
      <div class="filter-options">
        <hlx-select
          :key="`status-${filterKey}`"
          v-model:name="statusModel.key"
          v-model:value="statusModel.value"
          :options="statusOptions"
          :placeholder-value="'All Status'"
          :label="'name'"
          :prop-value="'value'"
          :clearable="true"
          @selected-value="emitFilters"
        />

        <hlx-select
          :key="`priority-${filterKey}`"
          v-model:name="priorityModel.key"
          v-model:value="priorityModel.value"
          :options="priorityOptions"
          :placeholder-value="'All Priority'"
          :label="'name'"
          :prop-value="'value'"
          :clearable="true"
          @selected-value="emitFilters"
        />
      </div>
    </div>
    <button
      v-if="hasActiveFilters"
      class="clear-filter-btn"
      @click="clearFilters"
    >
      Clear filter
    </button>

    <div class="sort">
      <img :src="sortIcon" class="sort-icon" />
      <span>Sort by:</span>
      <hlx-select
        v-model:name="sortModel.key"
        v-model:value="sortModel.value"
        :pre-value="sortModel.value"
        :options="sortOptions"
        :label="'name'"
        :prop-value="'value'"
        :clearable="false"
        @selected-value="emitFilters"
      />
    </div>
  </div>
</template>

<script>
import sortIcon from "@/assets/icons/sort.svg";
import Filter from "@/assets/icons/filter.svg";
export default {
  name: "TasksFilters",
  data() {
    return {
      sortIcon,
      Filter,
      statusModel: { key: "", value: "" },
      priorityModel: { key: "", value: "" },
      sortModel: { key: "Created at", value: "createdAt" },
      filterKey: 0,

      statusOptions: [
        { name: "All Status", value: "" },
        { name: "Todo", value: "Todo" },
        { name: "In progress", value: "In progress" },
        { name: "On hold", value: "On hold" },
        { name: "Completed", value: "Completed" },
      ],

      priorityOptions: [
        { name: "All Priority", value: "" },
        { name: "Low", value: "Low" },
        { name: "Medium", value: "Medium" },
        { name: "High", value: "High" },
      ],

      sortOptions: [
        { name: "Created at", value: "createdAt" },
        { name: "Due date", value: "dueDate" },
        { name: "Priority", value: "priority" },
        { name: "Ascending", value: "asc" },
        { name: "Descending", value: "desc" },
        { name: "None", value: "none" },
      ],
    };
  },

  computed: {
    hasActiveFilters() {
      return this.statusModel.value !== "" || this.priorityModel.value !== "";
    },
  },

  methods: {
    emitFilters() {
      this.$nextTick(() => {
        this.$emit("filter-change", {
          status: this.statusModel.value,
          priority: this.priorityModel.value,
          sort: this.sortModel.value,
        });
      });
    },
    setSort(sortObj) {
      this.sortModel = sortObj;
      this.emitFilters();
    },
    clearFilters() {
      this.statusModel = { key: "All Status", value: "" };
      this.priorityModel = { key: "All Priority", value: "" };
      this.filterKey++;
      this.$nextTick(() => {
        this.emitFilters();
      });
    },
  },
};
</script>

<style scoped>
.filters {
  display: flex;
  gap: 15px;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 15px;
  padding: 20px;
  flex-wrap: wrap;
  background-color: var(--card-bg);
  transition: all 0.3s ease;
}

.filters-row {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
  flex-wrap: wrap;
  transition: color 0.3s ease;
}

.filter-label span {
  font-size: 14px;
}

.filter-icon {
  width: 16px;
  height: 16px;
  margin-top: 0px;
}

.filter-options {
  display: flex;
  gap: 15px;
}

.clear-filter-btn {
  background: none;
  border: none;
  color: #10b981;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}

.clear-filter-btn:hover {
  opacity: 0.7;
}

.sort {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.sort span {
  white-space: nowrap;
}

.sort-icon {
  width: 16px;
  height: 16px;
}

/* Deep styles for hlx-select components */
:deep(.hlx-select-wrapper),
:deep(.hlx-select-container),
:deep(.hlx-select) {
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

:deep(.hlx-select-wrapper input),
:deep(.hlx-select-container input),
:deep(.hlx-select input) {
  background-color: var(--input-bg) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

:deep(.hlx-select-dropdown),
:deep(.hlx-select-menu),
:deep(.hlx-dropdown-menu) {
  background-color: var(--card-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

:deep(.hlx-select-option),
:deep(.hlx-option),
:deep(.hlx-dropdown-item) {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
}

:deep(.hlx-select-option:hover),
:deep(.hlx-option:hover),
:deep(.hlx-dropdown-item:hover) {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
}

:deep(.hlx-select-option.selected),
:deep(.hlx-option.selected),
:deep(.hlx-dropdown-item.selected) {
  background-color: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
}

@media (max-width: 1024px) {
  .filters {
    gap: 8px;
    padding: 15px;
    flex-wrap: nowrap;
  }

  .filter-options {
    padding: 6px 10px;
    min-width: 110px;
    font-size: 14px;
  }

  .sort {
    gap: 6px;
  }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 16px;
  }

  .filters-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .filter-label {
    flex-shrink: 0;
  }

  .filter-options {
    display: flex;
    gap: 8px;
    flex: 1;
  }

  .filter-options :deep(.hlx-select-wrapper),
  .filter-options :deep(.hlx-select-container) {
    flex: 1;
    min-width: 0;
  }

  .clear-filter-btn {
    align-self: flex-start;
  }

  .sort {
    margin-left: 0;
    justify-content: flex-start;
    gap: 8px;
    width: 100%;
  }

  .sort :deep(.hlx-select-wrapper),
  .sort :deep(.hlx-select-container) {
    flex: 1;
    min-width: 0;
  }
}
</style>
