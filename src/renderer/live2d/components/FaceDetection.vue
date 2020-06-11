<template>
  <div class="wrapper">
    <video
      id="video"
      ref="video"
      width="100%"
      height="auto"
      autoplay
      muted
      @play="onVideoPlay"
    ></video>
    <div>
      <button @click="initCamera">播放</button>
      <button @click="closeVideo">停止</button>
      <select id="videoDevices" ref="videoDevices" @change="switchStream">
        <option
          v-for="videoDevice in videoDevices"
          :key="videoDevice.deviceId"
          :value="videoDevice.deviceId"
          >{{ videoDevice.label }}</option
        >
      </select>
    </div>
  </div>
</template>

<script>
// import { ipcRenderer } from "electron";
export default {
  name: "FaceDetection",
  data: function() {
    return {
      videoDevices: undefined
    };
  },
  mounted: function() {
    this.getVideoDevices().then(data => {
      this.videoDevices = data;
    });
  },
  methods: {
    initCamera: async function() {
      let cam = this.$refs["video"];

      if (cam.srcObject != null) {
        return;
      }

      let device = this.$refs["videoDevices"];
      let deviceId = device.options[device.selectedIndex].value;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: cam.width,
          deviceId: deviceId
        }
      });
      cam.srcObject = stream;
      return new Promise(resolve => {
        cam.onloadedmetadata = () => {
          resolve(cam);
        };
      });
    },
    switchStream: async function() {
      let cam = this.$refs["video"];

      if (cam.srcObject == null) {
        return;
      }

      let device = this.$refs["videoDevices"];
      let deviceId = device.options[device.selectedIndex].value;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: cam.width,
          deviceId: deviceId
        }
      });

      cam.srcObject.getTracks().forEach(function(track) {
        track.stop();
      });

      cam.srcObject = stream;
    },
    closeVideo() {
      let cam = this.$refs["video"];
      cam.srcObject.getTracks().forEach(function(track) {
        track.stop();
      });
      cam.srcObject = null;
    },
    onVideoPlay() {
      console.log(navigator.mediaDevices.enumerateDevices());
      // ipcRenderer.send("launch-detection");
    },
    getVideoDevices: async function() {
      let retval = [];
      // data format: [{deviceId:"",groupId:"",kind:"",label:""}]
      await navigator.mediaDevices.enumerateDevices().then(allDevices => {
        for (let i = 0; i < allDevices.length; i++) {
          if (allDevices[i]["kind"] == "videoinput") {
            retval.push({
              deviceId: allDevices[i]["deviceId"],
              label: allDevices[i]["label"]
            });
          }
        }
      });
      return retval;
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
