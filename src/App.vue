<template>
  <div id="app">
    <AnimationTest></AnimationTest>
  </div>
</template>

<script>
import AnimationTest from './components/p5/AnimationTest'

export default {
  name: "App",
  components: {
    AnimationTest
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
