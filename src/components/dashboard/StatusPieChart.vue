<template>
  <div class="chart-card">
    <h3>Status Overview</h3>
    <p class="chart-subtitle">
      Get a snapshot of the status of your work items.
    </p>

    <div class="pie-wrapper">
      <div class="pie-container">
        <svg viewBox="0 0 200 200" class="pie-svg">
          <circle
            v-for="(segment, index) in segments"
            :key="index"
            cx="100"
            cy="100"
            r="80"
            fill="none"
            :stroke="segment.color"
            stroke-width="40"
            :stroke-dasharray="`${(segment.percentage * 502.4) / 100} 502.4`"
            :stroke-dashoffset="segment.offset"
            transform="rotate(-90 100 100)"
            class="pie-segment"
            @mouseenter="showTooltip($event, segment, index)"
            @mouseleave="hideTooltip"
          />
        </svg>

        <!-- Tooltip -->
        <div
          v-if="tooltip.visible"
          class="tooltip"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          <div class="tooltip-status">{{ tooltip.status }}</div>
          <div class="tooltip-count">{{ tooltip.count }} Tasks</div>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item">
          <span class="legend-dot todo"></span>
          <span class="legend-text">Todo - {{ todo }}</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot hold"></span>
          <span class="legend-text">On hold - {{ hold }}</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot progress"></span>
          <span class="legend-text">In progress - {{ progress }}</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot complete"></span>
          <span class="legend-text">Completed - {{ completed }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatusPieChart",

  props: {
    tasks: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      tooltip: {
        visible: false,
        x: 0,
        y: 0,
        status: "",
        count: 0,
        percentage: 0,
      },
    };
  },

  computed: {
    todo() {
      return this.tasks.filter((t) => t.status === "Todo").length;
    },

    progress() {
      return this.tasks.filter((t) => t.status === "In progress").length;
    },

    hold() {
      return this.tasks.filter((t) => t.status === "On hold").length;
    },

    completed() {
      return this.tasks.filter((t) => t.status === "Completed").length;
    },

    total() {
      return this.todo + this.progress + this.hold + this.completed || 1;
    },

    segments() {
      const colors = {
        todo: "#9CA3AF",
        hold: "#F59E0B",
        progress: "#3B82F6",
        complete: "#10B981",
      };

      const statuses = ["Todo", "On hold", "In progress", "Completed"];

      const data = [
        { count: this.todo, color: colors.todo, status: statuses[0] },
        { count: this.hold, color: colors.hold, status: statuses[1] },
        { count: this.progress, color: colors.progress, status: statuses[2] },
        { count: this.completed, color: colors.complete, status: statuses[3] },
      ];

      let offset = 0;
      return data.map((item) => {
        const percentage = (item.count / this.total) * 100;
        const segment = {
          percentage,
          color: item.color,
          offset: (-offset * 502.4) / 100,
          count: item.count,
          status: item.status,
        };
        offset += percentage;
        return segment;
      });
    },
  },

  methods: {
    showTooltip(event, segment) {
      const container = event.target.closest(".pie-container");
      const rect = container.getBoundingClientRect();

      this.tooltip.visible = true;
      this.tooltip.status = segment.status;
      this.tooltip.count = segment.count;
      this.tooltip.percentage = segment.percentage.toFixed(1);
      this.tooltip.x = rect.width / 2 + 20;
      this.tooltip.y = rect.height / 2 - 40;
    },

    hideTooltip() {
      this.tooltip.visible = false;
    },
  },
};
</script>

<style scoped>
.chart-card {
  background: var(--card-bg, white);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color, #e0e0e0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.chart-card h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #0a0a0a);
}

.chart-subtitle {
  margin: 0 0 20px 0;
  font-size: 13px;
  color: var(--text-secondary, #717182);
}

.pie-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  min-height: 250px;
}

.pie-container {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  position: relative;
}

.pie-svg {
  width: 100%;
  height: 100%;
  display: block;
  margin: 0 auto;
}

.pie-segment {
  cursor: pointer;
  transition: opacity 0.2s;
}

.pie-segment:hover {
  opacity: 0.8;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 0 0 auto;
  min-width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  font-size: 14px;
  color: var(--text-primary, #0a0a0a);
}

.todo {
  background: #9ca3af;
}

.hold {
  background: #f59e0b;
}

.progress {
  background: #3b82f6;
}

.complete {
  background: #10b981;
}

.tooltip {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 10;
  min-width: 120px;
}

.tooltip-status {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #0a0a0a);
  margin-bottom: 6px;
}

.tooltip-count {
  font-size: 13px;
  color: var(--text-secondary, #717182);
  margin-bottom: 4px;
}

.tooltip-percentage {
  font-size: 13px;
  color: #3b82f6;
}

@media (max-width: 768px) {
  .pie-wrapper {
    gap: 20px;
  }

  .pie-container {
    width: 160px;
    height: 160px;
  }

  .tooltip {
    padding: 8px;
    min-width: 100px;
  }

  .tooltip-status {
    font-size: 12px;
  }

  .tooltip-count,
  .tooltip-percentage {
    font-size: 11px;
  }
}
</style>
