<template>
  <div id="app">
    <Scene></Scene>
  </div>
</template>

<script>
import Scene from './components/trigonometry/Scene'

export default {
  name: "App",
  components: {
    Scene
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
