<template>
  <div id="canvas"></div>
</template>

<script>
import * as p5 from "p5";
import Coord from "@/lib/Coord";
import Scene from "@/lib/Scene";
const $mode = require("@/lib/Mode");
const $m = require("@/lib/mobjs");
import { pi, complex, Complex } from "mathjs";

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
      let mode = $mode.M_CREATE;
      se.add(mode)
    },

    draw(p5) {
      this.scene.show();
    },

    init(p5) {
      let sceneConfig = {
        p5: p5,
        width: 1280 * 0.8,
        height: 720 * 0.8,
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
      $mode.init(p5, coord);
    },
  },
};
</script>
