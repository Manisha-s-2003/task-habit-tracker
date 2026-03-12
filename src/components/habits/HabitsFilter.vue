<template>
  <div class="habit-filters">
    <div class="filters-row">
      <div class="filter-label">
        <img :src="Filter" class="filter-icon" />
        <span>Filters:</span>
      </div>
      <div class="filter-options">
        <hlx-select
          :key="`frequency-${filterKey}`"
          v-model:name="frequencyModel.key"
          v-model:value="frequencyModel.value"
          :options="frequencyOptions"
          :pre-value="frequencyModel.value"
          :placeholder-value="'All Frequency'"
          :label="'name'"
          :prop-value="'value'"
          :clearable="true"
          @change="handleFrequencyChange"
        />
      </div>
      <button
        v-if="hasActiveFilters"
        class="clear-filter-btn"
        @click="clearFilters"
      >
        Clear filter
      </button>
    </div>

    <div class="sort">
      <img :src="SortIcon" class="sort-icon" />
      <span>Sort by:</span>
      <hlx-select
        v-model:name="sortModel.key"
        v-model:value="sortModel.value"
        :pre-value="sortModel.value"
        :placeholder-value="'Created at'"
        :options="sortOptions"
        :label="'name'"
        :prop-value="'value'"
        :clearable="true"
        @change="handleSortChange"
      />
    </div>
  </div>
</template>

<script>
import Filter from "@/assets/icons/filter.svg";
import SortIcon from "@/assets/icons/sort.svg";
export default {
  name: "HabitsFilter",
  data() {
    return {
      Filter,
      SortIcon,
      frequencyModel: { key: "All Frequency", value: "" },
      sortModel: { key: "Streak", value: "streak" },
      filterKey: 0,
      sortOptions: [
        { name: "Created at", value: "createdAt" },
        { name: "Streak", value: "streak" },
        { name: "Frequency", value: "frequency" },
      ],
      frequencyOptions: [
        { name: "All Frequency", value: "" },
        { name: "Daily", value: "Daily" },
        { name: "Weekly", value: "Weekly" },
        { name: "Custom", value: "Custom" },
      ],
    };
  },
  computed: {
    hasActiveFilters() {
      return this.frequencyModel.value !== "";
    },
  },
  watch: {
    "frequencyModel.value"(newVal) {
      this.$emit("frequency-changed", newVal);
    },
    "sortModel.value"(newVal) {
      this.$emit("sort-changed", newVal);
    },
  },
  methods: {
    handleFrequencyChange(event) {
      const value = event?.value !== undefined ? event.value : event;
      this.frequencyModel.value = value;
      this.$emit("frequency-changed", value);
    },
    handleSortChange(event) {
      const value = event?.value !== undefined ? event.value : event;
      this.sortModel.value = value;
      this.$emit("sort-changed", value);
    },
    clearFilters() {
      this.frequencyModel = { key: "All Frequency", value: "" };
      this.filterKey++;
      this.$nextTick(() => {
        this.$emit("frequency-changed", "");
      });
    },
  },
};
</script>

<style>
.habit-filters {
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
  display: block;
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

.sort-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.sort-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

/* .sort-label span {
  font-size: 14px;
}

.sort-icon {
  width: 16px;
  height: 16px;
  display: block;
  margin-top: 0px;
} */

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

@media (max-width: 768px) {
  .habit-filters {
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
    align-self: center;
  }

  .filter-options {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .filter-options :deep(.hlx-select-wrapper),
  .filter-options :deep(.hlx-select-container) {
    width: 100%;
  }

  .clear-filter-btn {
    flex-shrink: 0;
    align-self: center;
    white-space: nowrap;
  }

  .sort-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-left: 0;
  }

  .sort-label {
    flex-shrink: 0;
    align-self: center;
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
