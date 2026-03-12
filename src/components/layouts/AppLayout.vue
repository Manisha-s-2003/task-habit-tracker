<template>
  <div class="layout">
    <AppHeader />
    <AppNavbar />
    <div class="page-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";

export default {
  name: "AppLayout",
  components: {
    AppHeader,
    AppNavbar,
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-content {
  margin-top: 10px;
}
</style>
