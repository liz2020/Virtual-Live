<template>
  <div>
    <button @click="initializeCanvas">实例化画布</button>
    <canvas
      ref="ChromaKey"
      :width="RenderTargetWidth"
      :height="RenderTargetHeight"
    ></canvas>
  </div>
</template>

<script>
export let canvas = null;
export let gl = null;
export let frameBuffer = null;
export default {
  data: function() {
    return {
      RenderTargetWidth: 1900,
      RenderTargetHeight: 1000
    };
  },
  methods: {
    initializeCanvas() {
      console.log("[func] initializeCanvas in ChromaKey.vue");
      canvas = this.$refs["ChromaKey"];
      gl = canvas.getContext("webgl") || canvas.getContext("webgl2");

      // gl初期化失敗
      if (!gl) {
        alert("Cannot initialize WebGL. This browser does not support.");
        gl = null;
        return false;
      }

      if (!frameBuffer) {
        frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
      }

      // 透過設定
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
  }
};
</script>

<style></style>
