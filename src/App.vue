<template>
  <div id="app">
    <CircularInversion></CircularInversion>
  </div>
</template>

<script>
import CircularInversion from './components/p5/CircularInversion'

export default {
  name: "App",
  components: {
    CircularInversion
  },
};
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
