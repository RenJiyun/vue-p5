<template>
  <div id="canvas">
    <audio src="/static/audios/do_wrong.mp3"></audio>
  </div>
</template>

<script>
const $math = require("mathjs");
const $bazier = require("bezier-easing");
import * as p5 from "p5";
window.p5 = p5;
require("p5/lib/addons/p5.sound");

import Coord from "@/lib/Coord";
import Scene from "@/lib/Scene";
import Arc from "@/lib/Arc";
import Parallel from "@/lib/Parallel";
import Alpha from "@/lib/Alpha";
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
      // let ding = p5.loadSound("http://localhost:2015/audio/ding.mp3");

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
        display: false,
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
      // this.scene.add(obj);

      let arc = new Arc(
        $math.complex(0, 0),
        10,
        ($math.pi * 3) / 2,
        $math.pi,
        { fill: [0, 255, 0, 100], stroke: false, strokeWeight: 3 },
        { duration: 1000, easing: $bazier(0.09, 0.75, 0.96, 0.49) },
        { p5: p5, coord: coord }
      );

      // this.scene.add(arc);

      let parallel = new Parallel(
        $math.complex(3, 4),
        $math.complex(5, 0),
        { fill: false, stroke: [255, 255, 255, 255], strokeWeight: 2 },
        {},
        { p5: p5, coord: coord }
      );

      parallel.draw();

      this.scene.add(new Alpha(parallel, { duration: 1000 }));
    },

    draw(p5) {
      this.scene.show();
    },
  },
};
</script>
