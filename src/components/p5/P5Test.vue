<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";
export default {
  mounted() {
    const script = (p5) => {
      (p5.setup = () => {
        this.setup(p5);
      }),
        (p5.draw = () => {
          this.draw(p5);
        });
    };
    new P5(script, "canvas");
  },
  methods: {
    setup(p5) {
      p5.createCanvas(800, 600);
    },

    draw(p5) {
      p5.background(0);
    },
  },
};
</script>
