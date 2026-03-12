<template>
  <div class="overlay">
    <div class="delete-modal">
      <div class="modal-header">
        <h3>Delete</h3>
        <img
          :src="CloseIcon"
          class="close-btn"
          @click="$emit('cancel-delete')"
        />
      </div>
      <div class="modal-content">
        <p>
          Are you sure you want to delete the <span>{{ itemToDelete }}?</span>
        </p>
      </div>
      <div class="modal-footer">
        <div class="actions">
          <hlx-button class="secondary sm" @click="$emit('cancel-delete')">
            Cancel
          </hlx-button>
          <hlx-button class="primary sm" @click="$emit('confirm-delete')">
            Delete
          </hlx-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/assets/icons/close.svg";

export default {
  name: "DeleteModal",
  data() {
    return {
      CloseIcon,
    };
  },
  props: {
    itemToDelete: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.delete-modal {
  width: 400px;
  height: fit-content;
  background: var(--card-bg);
  border-radius: 5px;
  /* padding: 12px; */
  position: relative;
  z-index: 1001;
}

.modal-header {
  display: flex;
  flex-direction: row !important;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 1;
  color: var(--text-primary);
  padding: 2px 0;
}

.close-btn {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.modal-content p {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 400;
}

.modal-content span {
  font-weight: 700;
  font-style: bold;
}

.modal-footer {
  display: flex;
  gap: 12px;
  border-top: 1px solid #ebebeb;
  justify-content: flex-end;
  align-items: center;
  padding: 12px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
