<template>
  <transition name="slide-fade">
    <div v-if="visible" class="toast-container">
      <div class="toast-box">
        <div class="toast-icon">
          <div class="icon">
            <img :src="ToasterTick" />
          </div>
        </div>
        <div class="message" v-html="message"></div>
        <div class="close-btn" @click="closeToast">
          <img :src="CloseIcon" alt="X" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ToasterTick from "@/assets/icons/toaster-tick.svg";
import CloseIcon from "@/assets/icons/close.svg";

export default {
  name: "CommonToaster",
  props: {
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      visible: false,
      ToasterTick,
      CloseIcon,
    };
  },
  watch: {
    message: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.showToast();
        }
      },
    },
  },
  methods: {
    showToast() {
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
        this.$emit("update:message", "");
      }, this.duration);
    },
    closeToast() {
      this.visible = false;
      this.$emit("update:message", "");
    },
  },
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toast-box {
  display: flex;
  align-items: center;
  background-color: #e1f2eb;
  color: #000000;
  border-radius: 8px;
  width: 380px;
  min-height: 68px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.toast-icon {
  background-color: #54bd95;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 68px;
}

.icon img {
  width: 20px;
  height: 20px;
}

.message {
  flex: 1;
  padding: 0 16px;
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
  align-items: center;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  cursor: pointer;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
