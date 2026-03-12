export function applyRules(tasks) {
  const rules = JSON.parse(localStorage.getItem("rules")) || [];

  const activeRules = rules.filter(
    (rule) => rule.active !== false && rule.section === "Tasks"
  );

  return tasks.map((task) => {
    let updatedTask = { ...task };

    delete updatedTask.ruleHighlight;
    delete updatedTask.ruleBadge;

    activeRules.forEach((rule) => {
      const results = rule.conditions.map((condition) => {
        const taskValue = task[condition.field.toLowerCase()];
        const ruleValue = condition.fieldValue;

        switch (condition.operation) {
          case "Equals To":
            return taskValue === ruleValue;

          case "Not Equals To":
            return taskValue !== ruleValue;

          case "Greater Than":
            return taskValue > ruleValue;

          case "Less Than":
            return taskValue < ruleValue;

          case "Greater than or equals":
            return taskValue >= ruleValue;

          case "Less than or equals":
            return taskValue <= ruleValue;

          default:
            return false;
        }
      });

      let matched = false;

      if (rule.conditionOperator === "AND") {
        matched = results.every(Boolean);
      } else {
        matched = results.some(Boolean);
      }

      if (matched) {
        if (rule.action === "showBadge") {
          updatedTask.ruleBadge = rule.actionValue;
        }

        if (rule.action === "highlight") {
          updatedTask.ruleHighlight = rule.actionValue || "#ffffff";
        }
      }
    });
    return updatedTask;
  });
}

export function applyHabitRules(habits) {
  const rules = JSON.parse(localStorage.getItem("rules")) || [];

  const activeRules = rules.filter(
    (rule) => rule.active !== false && rule.section === "Habits"
  );

  return habits.map((habit) => {
    let updatedHabit = { ...habit };

    delete updatedHabit.ruleHighlight;
    delete updatedHabit.ruleBadge;
    delete updatedHabit.ruleHighlightColor;

    activeRules.forEach((rule) => {
      const results = rule.conditions.map((condition) => {
        const field = condition.field;
        let habitValue;
        let ruleValue = condition.fieldValue;

        if (field === "Frequency") {
          habitValue = habit.frequency;
        } else if (field === "Streak") {
          habitValue = habit.completedStreak || 0;
          ruleValue = parseInt(ruleValue, 10);
        }

        switch (condition.operation) {
          case "Equals To":
            return habitValue === ruleValue;

          case "Not Equals To":
            return habitValue !== ruleValue;

          case "Greater Than":
            return habitValue > ruleValue;

          case "Less Than":
            return habitValue < ruleValue;

          case "Greater than or equals":
            return habitValue >= ruleValue;

          case "Less than or equals":
            return habitValue <= ruleValue;

          default:
            return false;
        }
      });

      let matched = false;

      if (rule.conditionOperator === "AND") {
        matched = results.every(Boolean);
      } else if (rule.conditionOperator === "OR") {
        matched = results.some(Boolean);
      } else if (rule.conditionOperator === "NOT") {
        matched = !results[0];
      }

      if (matched) {
        if (rule.action === "showBadge") {
          updatedHabit.ruleBadge = rule.actionValue;
        }

        if (rule.action === "highlight") {
          updatedHabit.ruleHighlight = true;
          updatedHabit.ruleHighlightColor = rule.actionValue || "#3b82f6";
        }
      }
    });
    return updatedHabit;
  });
}
