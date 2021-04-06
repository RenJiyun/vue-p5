<template>
  <div id="canvas"></div>
</template>

<script>
const $math = require("mathjs");
import P5 from "p5";
import { Coord } from "@/lib/Coord";
import { Scene } from "@/lib/Scene";
// import { Partical, Line, Ellipse } from "@/series/trigonometry/c1/mobjs";

import { Polyline } from "@/lib/Mobj";
import { Text } from "@/lib/Text";
// const $bazier = require("bezier-easing");

// TODO 暂时可以用手写代替
import katex from "katex";

import { SumOfAnglesOfATriangle } from "@/series/planegeometry/sum_of_angles_of_a_triangle";

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
        ox: 0,
        oy: 0,
        width: this.scene.width,
        height: this.scene.height,
        xInterval: 20,
        yInterval: 20,
        grid: false,
        label: true,
        labelInterval: 2,
        display: false,
      };

      let coord = new Coord(coordConfig);
      this.scene.add(coord);

      this.scene.add(
        new SumOfAnglesOfATriangle(
          $math.complex(0, 10),
          $math.complex(-8, -6),
          $math.complex(12, -6),

          {
            coord: coord,
          }
        )
      );
    },

    draw() {
      this.scene.show();
    },
  },
};

</script>
