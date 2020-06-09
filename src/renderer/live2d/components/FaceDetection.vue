<template>
  <div class="wrapper">
    <video
      id="video"
      ref="video"
      width="100%"
      height="auto"
      autoplay
      muted
    ></video>
    <div>摄像机控制</div>
  </div>
</template>

<script>
export default {
  name: "FaceDetection",
  mounted: function() {
    this.initCamera();
  },
  methods: {
    initCamera: async function() {
      // create cam reference
      let cam = this.$refs["video"];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: cam.width
        }
      });
      cam.srcObject = stream;
      return new Promise(resolve => {
        cam.onloadedmetadata = () => {
          resolve(cam);
        };
      });
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
.video {
  width: 100%;
  height: 100%;
}
</style>
