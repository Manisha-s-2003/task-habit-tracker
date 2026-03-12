<template>
  <div class="chart-card">
    <h3>Habit Completion Trend</h3>
    <p class="chart-subtitle">
      Track your daily habit completion over the past week.
    </p>

    <div class="chart-container">
      <div class="y-axis-label">Total habits</div>
      <svg
        viewBox="0 0 700 300"
        class="line-chart-svg"
        @mousemove="handleMouseMove"
        @mouseleave="hideTooltip"
      >
        <!-- Y-axis -->
        <line
          x1="60"
          y1="20"
          x2="60"
          y2="240"
          stroke="#d1d5db"
          stroke-width="2"
        />

        <!-- X-axis -->
        <line
          x1="60"
          y1="240"
          x2="660"
          y2="240"
          stroke="#d1d5db"
          stroke-width="2"
        />

        <!-- Y-axis labels and grid lines -->
        <g v-for="i in yAxisSteps" :key="i">
          <text
            x="45"
            :y="getYPosition(i) + 5"
            class="axis-label"
            text-anchor="end"
          >
            {{ i }}
          </text>
          <line
            x1="60"
            :y1="getYPosition(i)"
            x2="660"
            :y2="getYPosition(i)"
            class="grid-line"
            stroke-dasharray="5,5"
          />
        </g>

        <!-- Line path -->
        <polyline
          :points="linePoints"
          fill="none"
          stroke="#3B82F6"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Data points -->
        <circle
          v-for="(point, index) in dataPoints"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          r="6"
          fill="#3B82F6"
          class="data-point"
          @mouseenter="showTooltip(index)"
        />

        <!-- X-axis labels -->
        <text
          v-for="(day, index) in days"
          :key="day"
          :x="dataPoints[index].x"
          y="260"
          class="axis-label"
          text-anchor="middle"
        >
          {{ day }}
        </text>
      </svg>

      <!-- Tooltip -->
      <div
        v-if="tooltip.visible"
        class="tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-day">{{ tooltip.day }}</div>
        <div class="tooltip-completed">Completed : {{ tooltip.completed }}</div>
        <div class="tooltip-total">Total habits : {{ totalHabits }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HabitsLineChart",

  props: {
    habits: {
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
        day: "",
        completed: 0,
      },
    };
  },

  computed: {
    days() {
      const result = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        result.push(date.toLocaleDateString("en-US", { weekday: "short" }));
      }

      return result;
    },

    weeklyData() {
      const result = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = this.formatDate(date);

        let completedCount = 0;

        this.habits.forEach((habit) => {
          if (habit.progress && habit.progress[dateKey] === "completed") {
            completedCount++;
          }
        });

        result.push(completedCount);
      }

      return result;
    },

    totalHabits() {
      return this.habits.length;
    },

    maxCompletions() {
      const max = Math.max(...this.weeklyData, this.totalHabits, 1);
      return Math.ceil(max);
    },

    yAxisSteps() {
      const steps = [];
      for (let i = 0; i <= this.maxCompletions; i++) {
        steps.push(i);
      }
      return steps;
    },

    dataPoints() {
      const points = [];
      const chartWidth = 600;
      const chartHeight = 220;
      const startX = 60;
      const startY = 20;
      const spacing = chartWidth / 6;

      this.weeklyData.forEach((value, index) => {
        const x = startX + index * spacing;
        const y =
          startY + chartHeight - (value / this.maxCompletions) * chartHeight;
        points.push({ x, y, value });
      });

      return points;
    },

    linePoints() {
      return this.dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
    },
  },

  methods: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    getYPosition(value) {
      const chartHeight = 220;
      const startY = 20;
      return startY + chartHeight - (value / this.maxCompletions) * chartHeight;
    },

    showTooltip(index) {
      const point = this.dataPoints[index];
      this.tooltip.visible = true;
      this.tooltip.day = this.days[index];
      this.tooltip.completed = point.value;
      this.tooltip.x = point.x + 10;
      this.tooltip.y = point.y - 60;
    },

    hideTooltip() {
      this.tooltip.visible = false;
    },

    handleMouseMove() {
      // Keep tooltip visible when hovering over the chart
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

.chart-container {
  width: 100%;
  position: relative;
}

.y-axis-label {
  position: absolute;
  left: -10px;
  top: 50%;
  transform: rotate(-90deg) translateX(-50%);
  transform-origin: left center;
  font-size: 13px;
  color: var(--text-secondary, #717182);
  font-weight: 500;
}

.line-chart-svg {
  width: 100%;
  height: auto;
  display: block;
}

.axis-label {
  font-size: 12px;
  fill: var(--text-secondary, #717182);
  font-family: system-ui, -apple-system, sans-serif;
}

.grid-line {
  stroke: #e5e7eb;
  stroke-width: 1;
}

.data-point {
  cursor: pointer;
  transition: r 0.2s;
}

.data-point:hover {
  r: 8;
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
  min-width: 140px;
}

.tooltip-day {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #0a0a0a);
  margin-bottom: 6px;
}

.tooltip-completed {
  font-size: 13px;
  color: #3b82f6;
  margin-bottom: 4px;
}

.tooltip-total {
  font-size: 13px;
  color: var(--text-secondary, #717182);
}

@media (max-width: 768px) {
  .chart-card {
    padding: 16px;
  }

  .y-axis-label {
    font-size: 11px;
  }

  .axis-label {
    font-size: 10px;
  }

  .tooltip {
    padding: 8px;
    min-width: 120px;
  }

  .tooltip-day {
    font-size: 12px;
  }

  .tooltip-completed,
  .tooltip-total {
    font-size: 11px;
  }
}
</style>
