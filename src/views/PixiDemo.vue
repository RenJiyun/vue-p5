<template>
  <div></div>
</template>

<script>
import * as PIXI from "pixi.js";
export default {
  mounted() {
    let app = new PIXI.Application();
    app.renderer.backgroundColor = 0xf6f8fa;
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(app.view);

    app.ticker.add((delta) => this.ticker(delta));
  },

  methods: {
    ticker(delta) {
      
    },
  },
};
</script>
