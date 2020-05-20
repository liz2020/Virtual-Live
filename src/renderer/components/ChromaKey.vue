<template>
  <div>
    <button v-if="!requestId" @click="initializeCanvas">开始</button>
    <button v-else @click="stop">停止</button>
    <button @click="reset">重置</button>
    <input v-model="color" />
    <canvas
      ref="ChromaKey"
      :width="RenderTargetWidth"
      :height="RenderTargetHeight"
    ></canvas>
  </div>
</template>

<script lang="ts">
export let canvas = null;
export let gl = null;
export let frameBuffer = null;
export default {
  data: function() {
    return {
      RenderTargetWidth: 1900,
      RenderTargetHeight: 1000,
      color: 0.5,
      requestId: undefined
    };
  },
  methods: {
    reset() {
      this.requestId = undefined;
      this.color = 0.5;
    },
    initializeCanvas() {
      console.log("[func] initializeCanvas in ChromaKey.vue");
      canvas = this.$refs["ChromaKey"];
      gl = canvas.getContext("webgl") || canvas.getContext("webgl2");

      // gl fail to initialize
      if (!gl) {
        alert("Cannot initialize WebGL. This browser does not support.");
        gl = null;
        return false;
      }

      if (!frameBuffer) {
        frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
      }

      // 透明度设定
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      this.start();
    },
    start() {
      // random color
      this.color = this.color + 0.05 * (Math.random() - 0.5);

      // 画面の初期化
      gl.clearColor(0.0, 0.0, this.color, 1.0);

      // 深度テストを有効化
      gl.enable(gl.DEPTH_TEST);

      // 近くにある物体は、遠くにある物体を覆い隠す
      gl.depthFunc(gl.LEQUAL);

      // カラーバッファや深度バッファをクリアする
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.clearDepth(1.0);

      // 透過設定
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      this.requestId = window.requestAnimationFrame(this.start);
    },
    stop() {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
    }
  }
};
</script>

<style></style>
