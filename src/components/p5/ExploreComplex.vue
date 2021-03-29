<template>
  <div id="canvas"></div>
</template>

<script>
// 复数基本性质的可视化
import P5 from "p5";
// const $math = require("mathjs");
import { CoordinateSystem } from "@/lib/CoordinateSystem";

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
      p5.createCanvas(1000, 700);
    },

    draw(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      let coord = new CoordinateSystem({
        ox: 0,
        oy: 0,
        width: 800,
        height: 600,
        xInterval: 10,
        grid: false,
        labelInterval: 5,
      });
      coord.show(p5);

      coord.showFunctions(p5, [(x) => x * x + 2 * x - 10]);

      // let c1 = $math.complex("2 + 3i");
      // let c2 = $math.complex(
      //   (p5.mouseX - p5.width / 2) / 50,
      //   -(p5.mouseY - p5.height / 2) / 50
      // );

      // let c3 = c1.add(c2);
      // coord.showComplexes(p5, [c1, c2, c3]);
    },
  },
};
</script>
