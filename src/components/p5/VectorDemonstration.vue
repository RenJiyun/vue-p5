<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";
// import Complex from "complex-js";
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
      p5.noCursor();
    },

    draw(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      p5.stroke(255);
      let x = p5.mouseX - p5.width / 2;
      let y = p5.mouseY - p5.height / 2;
      p5.line(0, 0, x, y);
    },
  },
};
</script>
