<template>
  <div class="overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="header-top">
          <h3>{{ isEditMode ? "Edit Rule" : "Add rule" }}</h3>
          <button @click="$emit('close')" class="close-btn" aria-label="Close">
            <img :src="CloseIcon" alt="X" />
          </button>
        </div>
        <p class="subtitle">
          {{
            isEditMode
              ? "Modify the existing rule information."
              : "Build custom rules with conditions and actions"
          }}
        </p>
      </div>

      <div class="form">
        <div class="form-group">
          <hlx-input
            v-model:value="rule.name"
            :pre-val="rule.name"
            :label-animation="true"
            label-value="Rule name"
            type="text"
            required="true"
          />
        </div>

        <div class="form-group">
          <hlx-input
            v-model:value="rule.description"
            :pre-val="rule.description"
            :label-animation="true"
            label-value="Description"
            type="textarea"
          />
        </div>

        <div class="form-group">
          <hlx-select
            v-model:value="rule.section"
            :pre-value="rule.section"
            :options="sectionOptions"
            :placeholder-value="'Choose Section'"
            :clearable="false"
          />
        </div>
        <div class="form-group">
          <section class="card">
            <div class="card-header">
              <label>Condition</label>
              <hlx-select
                class="cond-operator"
                v-model:name="rule.conditionOperator"
                v-model:value="rule.conditionOperator"
                :pre-value="rule.conditionOperator"
                :options="conditionOperators"
                :label="'name'"
                :prop-value="'value'"
                :clearable="false"
                @selected-value="emitFilters"
              />
            </div>

            <div class="condition-list">
              <template
                v-for="(c, idx) in rule.conditions"
                :key="'cond-' + idx"
              >
                <div class="inline-operator" v-if="idx > 0" aria-hidden="true">
                  {{ rule.conditionOperator }}
                </div>
                <div class="condition-row">
                  <hlx-select
                    class="grow"
                    v-model:value="c.field"
                    :pre-value="c.field"
                    :options="fieldOptions"
                    :placeholder-value="'Field'"
                  />
                  <hlx-select
                    class="grow"
                    v-model:value="c.operation"
                    :pre-value="c.operation"
                    :options="operationOptions"
                    label-value="Operator"
                  />
                  <div class="grow">
                    <hlx-select
                      v-if="c.field === 'Priority'"
                      v-model:value="c.fieldValue"
                      :pre-value="c.fieldValue"
                      :options="priorityOptions"
                      :placeholder-value="'Value'"
                    />
                    <hlx-select
                      v-else-if="c.field === 'Status'"
                      v-model:value="c.fieldValue"
                      :pre-value="c.fieldValue"
                      :options="statusOptions"
                      :placeholder-value="'Value'"
                    />
                    <hlx-input
                      v-else-if="c.field === 'Due Date'"
                      v-model:value="c.fieldValue"
                      :pre-value="c.fieldValue"
                      type="date"
                      :placeholder-value="'Value'"
                      icon="calender-regular"
                      icon-position="right"
                    />
                    <hlx-select
                      v-else-if="c.field === 'Frequency'"
                      v-model:value="c.fieldValue"
                      :pre-value="c.fieldValue"
                      :options="frequencyOptions"
                      :placeholder-value="'Value'"
                    />

                    <hlx-input
                      v-else-if="c.field === 'Streak'"
                      v-model:value="c.fieldValue"
                      :pre-value="c.fieldValue"
                      type="number"
                      :placeholder-value="'No of days'"
                    />

                    <hlx-input
                      v-else
                      v-model:value="c.fieldValue"
                      type="text"
                      :placeholder-value="'Value'"
                    />
                  </div>
                  <div class="del-cell">
                    <button
                      v-if="rule.conditions.length > 1"
                      type="button"
                      class="icon-btn delete-cond"
                      @click="removeCondition(idx)"
                      aria-label="Delete condition"
                      title="Delete condition"
                    >
                      <img
                        :src="DeleteIcon"
                        alt="Delete condition"
                        class="delete-icon-img"
                      />
                    </button>
                  </div>
                </div>
              </template>
            </div>

            <button
              type="button"
              class="add-condition-btn"
              @click="addCondition"
            >
              + Add condition
            </button>
          </section>
        </div>
        <!-- <section class="card">
          <div class="card-header">
            <label>Condition</label>
            <hlx-select
              class="cond-operator"
              v-model:name="rule.conditionOperator"
              v-model:value="rule.conditionOperator"
              :pre-value="rule.conditionOperator"
              :options="conditionOperators"
              :label="'name'"
              :prop-value="'value'"
              :clearable="false"
              @selected-value="emitFilters"
            />
          </div>

          <div class="condition-list">
            <template v-for="(c, idx) in rule.conditions" :key="'cond-' + idx">
              <div class="inline-operator" v-if="idx > 0" aria-hidden="true">
                {{ rule.conditionOperator }}
              </div>
              <div class="condition-row">
                <hlx-select
                  class="grow"
                  v-model:value="c.field"
                  :pre-value="c.field"
                  :options="fieldOptions"
                  :placeholder-value="'Field'"
                />
                <hlx-select
                  class="grow"
                  v-model:value="c.operation"
                  :pre-value="c.operation"
                  :options="operationOptions"
                  label-value="Operator"
                />
                <div class="grow">
                  <hlx-select
                    v-if="c.field === 'Priority'"
                    v-model:value="c.fieldValue"
                    :pre-value="c.fieldValue"
                    :options="priorityOptions"
                    :placeholder-value="'Value'"
                  />
                  <hlx-select
                    v-else-if="c.field === 'Status'"
                    v-model:value="c.fieldValue"
                    :pre-value="c.fieldValue"
                    :options="statusOptions"
                    :placeholder-value="'Value'"
                  />
                  <hlx-input
                    v-else-if="c.field === 'Due Date'"
                    v-model:value="c.fieldValue"
                    :pre-value="c.fieldValue"
                    type="date"
                    :placeholder-value="'Value'"
                    icon="calender-regular"
                    icon-position="right"
                  />
                  <hlx-select
                    v-else-if="c.field === 'Frequency'"
                    v-model:value="c.fieldValue"
                    :pre-value="c.fieldValue"
                    :options="frequencyOptions"
                    :placeholder-value="'Value'"
                  />

                  <hlx-input
                    v-else-if="c.field === 'Streak'"
                    v-model:value="c.fieldValue"
                    :pre-value="c.fieldValue"
                    type="number"
                    :placeholder-value="'No of days'"
                  />

                  <hlx-input
                    v-else
                    v-model:value="c.fieldValue"
                    type="text"
                    :placeholder-value="'Value'"
                  />
                </div>
                <div class="del-cell">
                  <button
                    v-if="rule.conditions.length > 1"
                    type="button"
                    class="icon-btn delete-cond"
                    @click="removeCondition(idx)"
                    aria-label="Delete condition"
                    title="Delete condition"
                  >
                    <img
                      :src="DeleteIcon"
                      alt="Delete condition"
                      class="delete-icon-img"
                    />
                  </button>
                </div>
              </div>
            </template>
          </div>

          <button type="button" class="add-condition-btn" @click="addCondition">
            + Add condition
          </button>
        </section> -->

        <section class="card">
          <div class="card-header">
            <label>Action</label>
          </div>

          <div class="action-stack">
            <hlx-select
              v-model:value="rule.action"
              :options="actionOptions"
              :pre-value="rule.action"
            />
            <hlx-input
              v-if="rule.action === 'showBadge'"
              type="text"
              :placeholder-value="'Badge text'"
              v-model:value="rule.actionValue"
              :pre-value="rule.actionValue"
            />
            <hlx-select
              v-if="rule.action === 'highlight'"
              v-model:value="rule.actionValue"
              :options="highlightColors"
              :pre-value="rule.actionValue"
              :placeholder-value="'Choose color'"
              :label="'name'"
              :prop-value="'value'"
              @change="handleColorChange"
            />
          </div>
        </section>
      </div>

      <div class="modal-footer">
        <div class="footer-actions">
          <hlx-button class="secondary sm" @click="$emit('close')">
            Cancel
          </hlx-button>
          <hlx-button class="primary sm" @click="submitRule">
            {{ isEditMode ? "Save" : "Submit" }}
          </hlx-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/assets/icons/close.svg";
import DeleteIcon from "@/assets/icons/delete.svg";

export default {
  name: "RulesForm",
  props: {
    ruleData: {
      type: Object,
      default: null,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rule: this.ruleData
        ? JSON.parse(JSON.stringify(this.ruleData))
        : {
            id: Date.now(),
            name: "",
            section: "Tasks",
            conditionOperator: "AND",
            conditions: [{ field: "", operation: "Equals To", fieldValue: "" }],
            action: "showBadge",
            actionValue: "",
            active: true,
            createdAt: Date.now(),
          },

      sectionOptions: [
        { name: "Tasks", value: "Tasks" },
        { name: "Habits", value: "Habits" },
      ],
      conditionOperators: [
        { name: "AND", value: "AND" },
        { name: "OR", value: "OR" },
      ],
      operationOptions: [
        { name: "Equals To", value: "Equals To" },
        { name: "Not Equals To", value: "Not Equals To" },
        { name: "Greater Than", value: "Greater Than" },
        { name: "Less Than", value: "Less Than" },
        { name: "Greater than or equals", value: "Greater than or equals" },
        { name: "Less than or equals", value: "Less than or equals" },
      ],
      priorityOptions: [
        { name: "High", value: "High" },
        { name: "Medium", value: "Medium" },
        { name: "Low", value: "Low" },
      ],
      statusOptions: [
        { name: "Todo", value: "Todo" },
        { name: "In progress", value: "In progress" },
        { name: "On Hold", value: "On Hold" },
        { name: "Completed", value: "Completed" },
      ],
      actionsOptions: [
        { name: "Show badge", value: "showBadge" },
        { name: "Highlight", value: "highlight" },
      ],
      highlightColors: [
        { name: "Blue", value: "#3b82f6" },
        { name: "Green", value: "#22c55e" },
        { name: "Red", value: "#ef4444" },
        { name: "Yellow", value: "#eab308" },
        { name: "Purple", value: "#a855f7" },
      ],
      habitFieldOptions: [
        { name: "Frequency", value: "Frequency" },
        { name: "Streak", value: "Streak" },
      ],

      frequencyOptions: [
        { name: "Daily", value: "Daily" },
        { name: "Weekly", value: "Weekly" },
        { name: "Custom", value: "Custom" },
      ],
      CloseIcon,
      DeleteIcon,
    };
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

    handleColorChange(event) {
      const value = event?.value !== undefined ? event.value : event;
      this.rule.actionValue = value;
    },
    submitRule() {
      if (this.isEditMode) {
        this.$emit("update-rule", this.rule);
      } else {
        this.$emit("save-rule", this.rule);
      }
      this.$emit("close");
    },
    emitFilters() {
      this.$nextTick(() => {
        this.$emit("filter-change", {
          conditionOperator: this.rule.conditionOperator,
        });
      });
    },

    addCondition() {
      if (this.rule.conditions.length >= 2) return;
      this.rule.conditions.push({ field: "", operation: "", fieldValue: "" });
    },
    removeCondition(idx) {
      if (this.rule.conditions.length <= 1) return;
      this.rule.conditions.splice(idx, 1);
    },
  },
  computed: {
    fieldOptions() {
      if (this.rule.section === "Habits") {
        return this.habitFieldOptions;
      }
      return [
        { name: "Priority", value: "Priority" },
        { name: "Status", value: "Status" },
        { name: "Due Date", value: "Due Date" },
      ];
    },
    actionOptions() {
      if (this.rule.section === "Habits") {
        return [{ name: "Highlight", value: "highlight" }];
      }
      return this.actionsOptions;
    },
  },
  watch: {
    "rule.field"(nv) {
      if (!this.rule.conditions[0])
        this.rule.conditions.splice(0, 0, {
          field: "",
          operation: "Equals To",
          fieldValue: "",
        });
      if (this.rule.conditions[0].field !== nv)
        this.rule.conditions[0].field = nv || "";
    },
    "rule.operation"(nv) {
      if (!this.rule.conditions[0])
        this.rule.conditions.splice(0, 0, {
          field: "",
          operation: "Equals To",
          fieldValue: "",
        });
      if (this.rule.conditions[0].operation !== nv)
        this.rule.conditions[0].operation = nv || "";
    },
    "rule.fieldValue"(nv) {
      if (!this.rule.conditions[0])
        this.rule.conditions.splice(0, 0, {
          field: "",
          operation: "Equals To",
          fieldValue: "",
        });
      if (this.rule.conditions[0].fieldValue !== nv)
        this.rule.conditions[0].fieldValue = nv || "";
    },
    "rule.conditions": {
      deep: true,
      handler(nv) {
        const first =
          nv && nv[0] ? nv[0] : { field: "", operation: "", fieldValue: "" };
        if (this.rule.field !== first.field)
          this.rule.field = first.field || "";
        if (this.rule.operation !== first.operation)
          this.rule.operation = first.operation || "";
        if (this.rule.fieldValue !== first.fieldValue)
          this.rule.fieldValue = first.fieldValue || "";
      },
    },
    "rule.action"(newVal) {
      // Reset actionValue when action changes
      if (newVal === "highlight" && !this.rule.actionValue) {
        this.rule.actionValue = "#3b82f6"; // Default to blue
      }
    },
    "rule.section"(newVal) {
      // When section changes to Habits, set action to highlight
      if (newVal === "Habits") {
        this.rule.action = "highlight";
        if (!this.rule.actionValue) {
          this.rule.actionValue = "#3b82f6"; // Default to blue
        }
      }
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
  padding: 12px;
  z-index: 1000;
  transition: background 0.3s ease;
}

.modal {
  width: 520px;
  max-height: 90vh;
  background: var(--modal-bg);
  border-radius: 8px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  position: relative;
  z-index: 1001;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.modal-header {
  padding: 16px 20px 8px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 18px;
  line-height: 24px;
  margin: 0;
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.close-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
  transition: color 0.3s ease;
}

.form {
  padding: 8px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: auto;
}

.form-group {
  width: 100%;
}

section {
  width: 100%;
}
.card {
  width: 100% !important;
  transform: none !important;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  box-sizing: border-box;
  padding: 6px 6px 6px 6px;
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px;
  margin-bottom: 10px;
}

.card-header label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  font-style: normal;
  transition: color 0.3s ease;
}

.cond-operator {
  min-width: 120px;
}

.condition-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 10px;
  align-items: center;
}

.condition-row .grow {
  width: 100%;
}

.inline-operator {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  padding: 6px 2px;
  transition: color 0.3s ease;
}

.condition-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px;
}

.del-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.icon-btn.delete-cond {
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.delete-icon-img {
  width: 16px;
  height: 16px;
  display: block;
}
.grow {
  min-width: 0;
  width: 100%;
  max-width: 400px;
}

.add-condition-btn {
  margin-top: 8px;
  margin-left: auto;
  background: transparent;
  border: none;
  color: var(--success-color);
  font-size: 13px;
  cursor: pointer;
  padding: 2px 0;
  text-align: left;
  display: block;
  transition: color 0.3s ease;
}

.action-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-footer {
  border-top: 1px solid var(--border-color);
  padding: 12px 16px;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-ghost {
  color: var(--success-color);
  background: transparent;
  border-color: var(--border-color);
}
.btn-ghost:hover {
  background: var(--bg-secondary);
}

.btn-primary {
  color: #fff;
  background: var(--success-color);
  border-color: var(--success-color);
}
.btn-primary:hover {
  background: var(--button-primary-hover);
}
@media (max-width: 870px) {
  .modal {
    width: 92%;
    max-height: 92vh;
    border-radius: 10px;
  }

  .card {
    width: 100% !important;
    transform: none !important;
    padding: 6px 6px 6px 6px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .condition-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    max-width: 100%;
  }

  .cond-operator {
    width: 120px;
  }

  hlx-input,
  hlx-select {
    display: block;
    width: 100%;
  }

  .condition-row .grow {
    width: 100%;
    max-width: 100%;
  }

  .inline-operator {
    margin: 6px 0;
    font-size: 12px;
  }

  .del-cell {
    justify-content: flex-start;
  }

  .add-condition-btn {
    text-align: left;
  }

  .action-stack hlx-select,
  .action-stack hlx-input {
    width: 100%;
  }

  .footer-actions {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .footer-actions hlx-button {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .card-header {
    gap: 12px;
  }
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
  background-color: var(--modal-bg) !important;
  padding: 0 4px !important;
}

:deep(.hlx-input-wrapper label.float),
:deep(.hlx-input-container label.float),
:deep(.hlx-input-wrapper label.active),
:deep(.hlx-input-container label.active),
:deep(.hlx-input-wrapper label[class*="float"]),
:deep(.hlx-input-container label[class*="float"]),
:deep(.hlx-input-wrapper label[class*="active"]),
:deep(.hlx-input-container label[class*="active"]) {
  background-color: var(--modal-bg) !important;
  padding: 0 4px !important;
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
