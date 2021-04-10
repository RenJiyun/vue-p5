<template>
  <div id="canvas">
    <audio src="/static/audios/do_wrong.mp3"></audio>
  </div>
</template>

<script>
import * as p5 from "p5";
import Coord from "@/lib/Coord";
import Scene from "@/lib/Scene";
const $m = require("@/lib/mobjs");
import { pi } from "mathjs";

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
    setup(p5) {
      this.init(p5);
      let se = this.scene;
      se.add(
        $m
          .square([0, 0], 10)
          .stroke(255, 255, 255, 255)
          .strokeWeight(3)
          .create(500)
          // .translate([2, 10], 5000)
          .rotate(pi / 6, 5000)
      );
    },

    draw(p5) {
      this.scene.show();
    },

    init(p5) {
      let sceneConfig = {
        p5: p5,
        width: 1280,
        height: 720,
      };

      this.scene = new Scene(sceneConfig);

      let coordConfig = {
        ox: 0,
        oy: 0,
        width: this.scene.width,
        height: this.scene.height,
        xInterval: 20,
        yInterval: 20,
        grid: false,
        label: true,
        labelInterval: 3,
        display: true,
      };

      let coord = new Coord(
        coordConfig,
        {},
        {},
        {
          p5: p5,
        }
      );

      this.scene.add(coord);
      $m.init(p5, coord);
    },
  },
};
</script>
