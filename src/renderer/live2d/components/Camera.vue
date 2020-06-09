<template>
  <div class="wrapper">
    <div @click="startVideo">摄像机</div>
    <video id="video" ref="video" autoplay muted></video>
  </div>
</template>

<script>
export default {
  name: "Camera",
  methods: {
    startVideo() {
      // console.log(navigator.getUserMedia.toString());
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
