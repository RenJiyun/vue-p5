<template>
  <div id="canvas"></div>
</template>

<script>
const $math = require("mathjs");
import p5 from "p5";
// import 'p5/lib/addons/p5.sound';
import Coord from "@/lib/Coord";
import Scene from "@/lib/Scene";
import { SumOfAnglesOfATriangle } from "@/series/planegeometry/sum_of_angles_of_a_triangle";

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
    return {
      coord: null,
      scale: 5000,
    };
  },

  methods: {
    setup(p5) {
      // 场景配置
      let sceneConfig = {
        p5: p5,
        width: 1280,
        height: 720,
      };

      this.scene = new Scene(sceneConfig);

      // 添加场景中的对象
      let coordConfig = {
        ox: 0,
        oy: 0,
        width: this.scene.width,
        height: this.scene.height,
        xInterval: 20,
        yInterval: 20,
        grid: false,
        label: true,
        labelInterval: 5,
        display: true,
      };

      let coord = new Coord(coordConfig);
      this.scene.add(coord);

      let obj = new SumOfAnglesOfATriangle(
        $math.complex(0, 10),
        $math.complex(-8, -6),
        $math.complex(12, -6),
        {
          p5: p5,
          coord: coord,
        }
      );
      this.scene.add(obj);
    },

    draw() {
      this.scene.show();
    },
  },
};
</script>
