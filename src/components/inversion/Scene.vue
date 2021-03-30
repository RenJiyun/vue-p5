<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";
import { CoordinateSystem } from "@/lib/CoordinateSystem";

export default {
  name: "Scene",
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

  data() {
    return {
      coord: null,
      scale: 5000,
    };
  },

  methods: {
    setup(p5) {
      p5.createCanvas(1280, 720);
      let coordConfig = {
        defaultCanvas: p5,
        ox: 0,
        oy: 0,
        width: p5.width,
        height: p5.height,
        xInterval: 20,
        grid: false,
        labelInterval: 2,
      };
      this.coord = new CoordinateSystem(coordConfig);
    },

    draw(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      this.coord.show();
    },
  },
};
</script>
