<template>
  <div id="canvas"></div>
</template>

<script>
import * as p5 from "p5";
export default {
  mounted() {
    const script = (_) => {
      (_.setup = () => {
        this.setup(_);
      }),
        (_.draw = () => {
          this.draw(_);
        });
    };

    new p5(script, "canvas");
  },

  data() {
    return {};
  },

  methods: {
    setup(p5) {},

    draw(p5) {},

  },
};
</script>
