<template>
  <div class="rule-filters">
    <div class="filters-row">
      <div class="filter-label">
        <img :src="Filters" class="filter-icon" />
        <span>Filters:</span>
      </div>
      <div class="filter-options">
        <hlx-select
          :key="`status-${filterKey}`"
          v-model:name="statusData.key"
          v-model:value="statusData.value"
          :options="statusOptions"
          :placeholder-value="'All Status'"
          :label="'name'"
          :prop-value="'value'"
          :clearable="true"
          @selected-value="emitFilters"
        />

        <hlx-select
          :key="`section-${filterKey}`"
          v-model:name="sectionData.key"
          v-model:value="sectionData.value"
          :options="sectionOptions"
          :placeholder-value="'All Sections'"
          :label="'name'"
          :prop-value="'value'"
          :clearable="true"
          @selected-value="emitFilters"
        />
      </div>
    </div>

    <button v-if="hasActiveFilters" class="clear-filter" @click="clearFilters">
      Clear filter
    </button>

    <div class="sort">
      <img :src="sortIcon" class="sort-icon" />
      <span> Sort by:</span>
      <hlx-select
        v-model:name="sortData.key"
        v-model:value="sortData.value"
        :pre-value="sortData.value"
        :options="sortOptions"
        :label="'name'"
        :prop-value="'value'"
        :clearable="true"
        @selected-value="emitFilters"
      />
    </div>
  </div>
</template>

<script>
import Filters from "@/assets/icons/filter.svg";
import sortIcon from "@/assets/icons/sort.svg";
export default {
  name: "RulesFilter",
  data() {
    return {
      Filters,
      sortIcon,
      statusData: { key: "All Status", value: "" },
      sectionData: { key: "All Section", value: "" },
      sortData: { key: "Ascending", value: "asc" },
      filterKey: 0,
      statusOptions: [
        { name: "All Status", value: "" },
        { name: "Enabled rule", value: "Enabled rule" },
        { name: "Disabled rule", value: "Disabled rule" },
      ],
      sectionOptions: [
        { name: "All Sections", value: "" },
        { name: "Tasks", value: "Tasks" },
        { name: "Habits", value: "Habits" },
      ],
      sortOptions: [
        { name: "Ascending", value: "asc" },
        { name: "Descending", value: "desc" },
        { name: "Created At", value: "createdAt" },
      ],
    };
  },
  computed: {
    hasActiveFilters() {
      return this.statusData.value !== "" || this.sectionData.value !== "";
    },
  },
  methods: {
    emitFilters() {
      this.$nextTick(() => {
        this.$emit("filter-change", {
          status: this.statusData.value,
          section: this.sectionData.value,
          sort: this.sortData.value,
        });
      });
    },
    clearFilters() {
      this.statusData = { key: "All Status", value: "" };
      this.sectionData = { key: "All Sections", value: "" };
      this.filterKey++;
      this.$nextTick(() => {
        this.emitFilters();
      });
    },
  },
};
</script>

<style>
.rule-filters {
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

.clear-filter {
  background: none;
  border: none;
  color: #10b981;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}

.clear-filter:hover {
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
  font-size: 14px;
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
  .rule-filters {
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
  .rule-filters {
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

  .clear-filter {
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
