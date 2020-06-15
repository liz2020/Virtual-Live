<template>
  <div class="wrapper">
    <div v-show="container" class="container">
      <video
        class="container video"
        ref="video"
        width="100%"
        height="auto"
        autoplay
        muted
        @play="onVideoPlay"
      ></video>
      <canvas ref="canvas" class="container canvas"></canvas>
    </div>
    <div class="controller">
      <select ref="videoDevices" @change="switchStream">
        <option
          v-for="videoDevice in videoDevices"
          :key="videoDevice.deviceId"
          :value="videoDevice.deviceId"
        >
          {{ videoDevice.label }}
        </option>
      </select>
      <button class="play" @click="initCamera">播放</button>
      <button class="close" @click="closeVideo">停止</button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "FaceDetection",
  data: function() {
    return {
      videoDevices: undefined,
      container: false
    };
  },
  mounted: function() {
    this.getVideoDevices().then(data => {
      this.videoDevices = data;
    });
    ipcRenderer.on("window-message-from-worker", (event, arg) => {
      let detection = arg["payload"]["Landmark"];
      if (detection) {
        let canvas = this.$refs["canvas"];
        canvas.getContext("2d").clearRect(1, 1, canvas.width, canvas.height);
        console.log(detection);
      }
    });
  },
  methods: {
    initCamera: async function() {
      let cam = this.$refs["video"];
      this.container = true;

      if (cam.srcObject != null) {
        return;
      }

      let device = this.$refs["videoDevices"];
      let deviceId = device.options[device.selectedIndex].value;
      ipcRenderer.send("startDetection", deviceId);

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
      ipcRenderer.send("setVideoDevice", deviceId);

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
      ipcRenderer.send("stopDetection");
      this.container = false;
      let cam = this.$refs["video"];
      let stream = cam.srcObject;
      cam.srcObject = null;
      if (stream) {
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    },
    onVideoPlay() {
      let device = this.$refs["videoDevices"];
      let deviceId = device.options[device.selectedIndex].value;
      ipcRenderer.send("launch-detection");
      ipcRenderer.send("setVideoDevice", deviceId);
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
  grid-area: 1 / 1 / 1 / 1;
}
.canvas {
  width: 100%;
  height: 100%;
  grid-area: 1 / 1 / 1 / 1;
}
.container {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 230px 1fr;
}
.controller {
  display: flex;
}
.play,
.close {
  width: 100%;
}
</style>
