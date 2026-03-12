<template>
  <div class="dashboard-card">
    <div class="content">
      <p class="title">{{ title }}</p>
      <p class="value">{{ value }}</p>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
    <div class="icon-wrapper">
      <img v-if="icon" :src="icon" alt="icon" class="icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    iconColor: {
      type: String,
      default: "#3B82F6",
    },
  },
};
</script>

<style scoped>
.dashboard-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card-bg, #fff);
  border-radius: 12px;
  border: 1px solid var(--border-color, #e0e0e0);
  padding: 24px;
  min-height: 120px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.dashboard-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #54bd95;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  color: var(--text-secondary, #717182);
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  font-family: OpenSans;
}

.value {
  font-size: 36px;
  font-weight: 600;
  color: var(--text-primary, #0a0a0a);
  margin: 6px 0;
  line-height: 1;
}

.subtitle {
  font-size: 12px;
  color: var(--text-tertiary, #999);
  margin: 0;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.icon {
  width: 40px;
  height: 40px;
}
</style>
