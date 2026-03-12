<template>
  <div class="rule-page">
    <RulesFilter @filter-change="applyRuleFilter" />
    <div class="rule-header">
      <h3>Rules</h3>
      <div class="right-section">
        <div class="search-wrapper">
          <img :src="Search" class="search-icon" />
          <input
            type="text"
            placeholder="Search"
            class="search"
            @input="applyRuleFilter({ searchText: filters.searchText })"
            v-model="filters.searchText"
          />
        </div>
        <hlx-button class="primary sm add-rule-btn" @click="openModal">
          <img :src="AddRule" class="button-img" @click="openModal" />
          <span>Add Rule</span>
        </hlx-button>
      </div>
    </div>

    <div v-if="filteredRules.length === 0" class="empty-state">
      <img :src="NoRuleFound" />
      <p>No rules found. Create your first rule to get started!</p>
    </div>
    <div v-else>
      <RulesCard
        v-for="(rule, index) in filteredRules"
        :key="rule.id"
        :rule="rule"
        :index="index"
        @edit-rule="openRuleEdit"
        @update-rule="handleUpdateRule"
        @delete-rule="openRuleDelete"
        @toggle-rule="toggleRule"
      />
    </div>

    <RulesForm
      v-if="isModalOpen"
      :ruleData="selectedRule"
      :isEditMode="editingRuleIndex != null"
      @close="closeModal"
      @save-rule="handleSaveRule"
      @update-rule="handleUpdateRule"
    />

    <DeleteModal
      v-if="showDeleteModal"
      :itemToDelete="ruleToDeleteName"
      @confirm-delete="handleDeleteRule"
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
import RulesForm from "@/components/rules/RulesForm.vue";
import RulesCard from "@/components/rules/RulesCard.vue";
import RulesFilter from "@/components/rules/RulesFilter.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import Search from "@/assets/icons/search.svg";
import AddRule from "@/assets/icons/add-task.svg";
import NoRuleFound from "@/assets/icons/rule.svg";

export default {
  name: "RulesView",
  components: {
    RulesForm,
    RulesCard,
    RulesFilter,
    DeleteModal,
  },
  data() {
    return {
      rules: [],
      filteredRules: [],
      isModalOpen: false,
      showDeleteModal: false,
      editingRuleIndex: null,
      selectedRule: null,
      ruleToDeleteId: null,
      notification: {},
      ruleToDeleteName: "",
      Search,
      AddRule,
      NoRuleFound,
      filters: {
        searchText: "",
        status: "",
        section: "",
        sort: "asc",
      },
    };
  },
  mounted() {
    this.loadRules();
  },

  methods: {
    showToast(message) {
      this.notification = {
        type: "success",
        message: message,
      };
    },
    toggleRule(index) {
      const ruleToToggle = this.filteredRules[index];
      const actualIndex = this.rules.findIndex((r) => r.id === ruleToToggle.id);
      if (actualIndex !== -1) {
        this.rules[actualIndex].active = !this.rules[actualIndex].active;
        localStorage.setItem("rules", JSON.stringify(this.rules));
        this.applyRuleFilter();
      }
    },
    loadRules() {
      this.rules = JSON.parse(localStorage.getItem("rules")) || [];
      this.applyRuleFilter();
    },
    saveRules() {
      localStorage.setItem("rules", JSON.stringify(this.rules));
    },
    openModal() {
      this.selectedRule = null;
      this.editingRuleIndex = null;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.editingRuleIndex = null;
    },
    openRuleEdit(rule) {
      this.editingRuleIndex = this.rules.findIndex((r) => r.id === rule.id);
      this.selectedRule = { ...rule };
      this.isModalOpen = true;
    },
    openRuleDelete(rule) {
      this.ruleToDeleteId = rule.id;
      this.ruleToDeleteName = rule.name;
      this.showDeleteModal = true;
    },
    handleSaveRule(newRule) {
      this.rules.push(newRule);
      this.saveRules();
      this.applyRuleFilter();
      this.closeModal();
      this.showToast(`Nice work! Your new rule
      ${newRule.name} is now in the list.`);
    },
    handleUpdateRule(updatedRule) {
      const index = this.rules.findIndex((r) => r.id === updatedRule.id);
      if (index !== -1) {
        this.rules[index] = updatedRule;
      }
      this.applyRuleFilter();
      this.saveRules();
      this.showToast("All Set! Your changes have  been saved successfully!");
    },
    handleDeleteRule() {
      this.rules = this.rules.filter((r) => r.id !== this.ruleToDeleteId);
      this.applyRuleFilter();
      this.saveRules();
      this.showDeleteModal = false;
      this.showToast("Done! Your item has been removed.");
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.ruleToDeleteId = null;
    },
    applyRuleFilter(newFilters = {}) {
      this.filters = { ...this.filters, ...newFilters };
      let result = [...this.rules];
      if (this.filters.status && this.filters.status !== "") {
        if (this.filters.status === "Enabled rule") {
          result = result.filter((rule) => rule.active === true);
        } else if (this.filters.status === "Disabled rule") {
          result = result.filter((rule) => rule.active === false);
        }
      }
      if (this.filters.section && this.filters.section !== "") {
        result = result.filter((rule) => rule.section === this.filters.section);
      }
      if (this.filters.sort) {
        if (this.filters.sort === "asc") {
          result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.filters.sort === "desc") {
          result.sort((a, b) => b.name.localeCompare(a.name));
        } else if (this.filters.sort === "createdAt") {
          result.sort((a, b) => a.createdAt - b.createdAt);
        }
      } else {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (this.filters.searchText) {
        const searchLower = this.filters.searchText.toLowerCase();
        result = result.filter(
          (rule) =>
            (rule.name && rule.name.toLowerCase().includes(searchLower)) ||
            (rule.description &&
              rule.description.toLowerCase().includes(searchLower)) ||
            (rule.section && rule.section.toLowerCase().includes(searchLower))
        );
      }
      this.filteredRules = result;
    },
  },
};
</script>

<style>
.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.rule-header h3 {
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
  border-radius: 17px;
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

.add-rule-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-rule-btn .button-img {
  width: 17px;
  height: 15px;
}

.empty-state {
  margin-top: 80px;
  text-align: center;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.empty-state p {
  color: var(--text-primary);
  transition: color 0.3s ease;
}

@media (max-width: 1024px) {
  .rule-header {
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
</style>
