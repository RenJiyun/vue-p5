<template>
  <div id="canvas"></div>
</template>

<script>
const $math = require("mathjs");
import P5 from "p5";
import { Coord } from "@/lib/Coord";
import { Scene } from "@/lib/Scene";
// import { TriangleAndCircle } from "@/series/trigonometry/c1/TriangleAndCircle";
import { Polygon } from "@/series/trigonometry/c1/Polygon";

export default {
  mounted() {
    const script = (p5) => {
      (p5.setup = () => {
        this.setup(p5);
      }),
        (p5.draw = () => {
          this.draw();
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
      // 场景配置
      let sceneConfig = {
        canvas: p5,
        width: 1280,
        height: 720,
      };
      this.scene = new Scene(sceneConfig);

      // 添加场景中的对象
      let coordConfig = {
        defaultCanvas: p5,
        ox: 0,
        oy: 0,
        width: this.scene.width,
        height: this.scene.height,
        xInterval: 20,
        grid: false,
        labelInterval: 2,
      };

      let coord = new Coord(coordConfig);
      this.scene.add(coord);

      let polygon = new Polygon(coord, [
        $math.complex(1, 1),
        $math.complex(10, 3),
        $math.complex(4, 12)
      ]) 

      this.scene.add(polygon)

      // let tc = new TriangleAndCircle(
      //   coord,
      //   4,
      //   (progress) => {
      //     return {
      //       c: $math.complex({r: 6, phi: -$math.pi * 2 * progress}),
      //       nc: $math.complex({r: 1, phi: -$math.pi * 2 * progress}),
      //       l: progress * 2 * $math.pi * 6,
      //     };
      //   },
      //   -$math.pi / 6,
      //   $math.pi / 6,
      //   $math.pi
      // );
      // this.scene.add(tc);
    },

    draw() {
      this.scene.show();
    },
  },
};
</script>
