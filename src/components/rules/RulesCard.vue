<template>
  <div class="rule-card">
    <div class="rule-actions">
      <button @click="$emit('delete-rule', rule)" class="action-btn delete-btn">
        <img :src="DeleteIcon" alt="Delete" />
      </button>

      <button
        @click="$emit('edit-rule', rule, index)"
        class="action-btn edit-btn"
      >
        <img :src="EditIcon" alt="Edit" />
      </button>

      <label class="switch">
        <input
          type="checkbox"
          :checked="rule.active"
          @change="$emit('toggle-rule', index)"
        />
        <span class="slider"></span>
      </label>
    </div>
    <div class="rule-header">
      <h4>{{ rule.name }}</h4>
      <span class="apply-tag">{{ rule.section }}</span>
    </div>

    <p class="rule-desc">{{ rule.description }}</p>
  </div>
</template>

<script>
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/delete.svg";

export default {
  name: "RuleCard",
  props: {
    rule: Object,
    index: Number,
  },
  data() {
    return {
      EditIcon,
      DeleteIcon,
    };
  },
};
</script>

<style scoped>
.rule-card {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 16px;
  margin-top: 12px;
  position: relative;
  background: var(--card-bg);
  transition: all 0.3s ease;
  overflow: hidden;
  word-wrap: break-word;
  max-width: 100%;
}

.rule-header {
  margin: 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  padding-right: 140px;
}

.rule-header h4 {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 400;
  font-family: Arial;
  color: #0a0a0a;
  margin: 0;
  transition: color 0.3s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.rule-desc {
  color: #717182;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  margin-top: 8px;
  padding-right: 140px;
}

/* .meta {
  display: flex;
  gap: 15px;
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  flex-wrap: wrap;
} */

.apply-tag {
  color: #0a0a0a;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid;
  font-size: 13px;
  transition: all 0.3s ease;
}

/* .rule-desc {
  font-family: Arial;
  font-weight: 400;
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  transition: color 0.3s ease;
} */

.rule-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .rule-header {
    padding-right: 120px;
  }

  .rule-desc {
    padding-right: 0;
    font-size: 13px;
  }

  .rule-actions {
    flex-direction: row;
    gap: 6px;
  }

  .action-btn img {
    width: 18px;
    height: 18px;
  }

  .switch {
    width: 42px;
    height: 24px;
  }

  .slider:before {
    height: 18px;
    width: 18px;
  }

  input:checked + .slider:before {
    transform: translateX(18px);
  }
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.action-btn:hover {
  opacity: 0.7;
}

.action-btn img {
  width: 20px;
  height: 20px;
}

.delete-btn img {
  filter: brightness(0) saturate(100%) invert(47%) sepia(89%) saturate(2477%)
    hue-rotate(333deg) brightness(98%) contrast(95%);
}

.edit-btn img {
  filter: brightness(0) saturate(100%) invert(70%) sepia(48%) saturate(457%)
    hue-rotate(101deg) brightness(91%) contrast(87%);
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  background-color: #ccc;
  border-radius: 26px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: #10b981;
}

input:checked + .slider:before {
  transform: translateX(22px);
}
</style>
