<template>
  <div id="app">
    <ExploreComplex></ExploreComplex>
  </div>
</template>

<script>
import ExploreComplex from './components/p5/ExploreComplex'

export default {
  name: "App",
  components: {
    ExploreComplex
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
