<template>
  <AppLayout />
</template>

<script>
import AppLayout from "./components/layouts/AppLayout";

export default {
  name: "App",
  components: {
    AppLayout,
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "Quicksand";
  src: url("@/assets/fonts/Quicksand.ttf") format("truetype");
  font-weight: 600;
  font-style: SemiBold;
}

@font-face {
  font-family: "OpenSans";
  src: url("@/assets/fonts/OpenSans.ttf") format("truetype");
  font-weight: 400;
  font-style: Regular;
}
#app {
  font-family: OpenSans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 12px;
}
</style>
