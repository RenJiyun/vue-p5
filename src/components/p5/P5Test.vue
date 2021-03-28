<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";
export default {
  name: "P5Test",
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
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
    },

    draw(p5) {
      p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
    },
  },
};
</script>
