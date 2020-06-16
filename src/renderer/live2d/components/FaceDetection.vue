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

<script lang="ts">
import { ipcRenderer } from "electron";
import {
  resizeResults,
  draw,
  FaceLandmarks,
  FaceLandmarks68,
  FaceDetection,
  Rect,
  Dimensions,
  Point
} from "face-api.js";
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
      let detections = arg.payload.Landmark;
      let typedDetections = this.AddTypeToDetections(detections);
      if (detections) {
        let canvas = this.$refs["canvas"];
        canvas.getContext("2d").clearRect(1, 1, canvas.width, canvas.height);
        // canvas.getContext("2d").fillStyle = "black";
        // canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
        console.log(typedDetections);
        const displaySize = { width: canvas.width, height: canvas.height };
        const resizedDetections = resizeResults(typedDetections, displaySize);
        console.log("resize", resizedDetections);
        draw.drawFaceLandmarks(canvas, resizedDetections);
      }
    });
  },
  methods: {
    AddTypeToDetections: function(detections) {
      // console.log(detections);
      // unshiftedLandmarks
      let unshiftedLandmarks = detections.unshiftedLandmarks;
      let typedPositions: Point[] = unshiftedLandmarks._positions.map(
        pt => new Point(pt._x, pt._y)
      );
      let typedDim: Dimensions = new Dimensions(
        unshiftedLandmarks._imgDims._width,
        unshiftedLandmarks._imgDims._height
      );
      let typedShift: Point = new Point(
        unshiftedLandmarks._shift._x,
        unshiftedLandmarks._shift._y
      );

      unshiftedLandmarks._positions = typedPositions;
      unshiftedLandmarks._shift = typedShift;
      unshiftedLandmarks._imgDims = typedDim;

      let typedUnshiftedLandmarks: FaceLandmarks = Object.assign(
        new FaceLandmarks68(typedPositions, typedDim, typedShift),
        unshiftedLandmarks
      );
      // console.log(typedUnshiftedLandmarks);
      // landmarks
      let landmarks = detections.landmarks;
      let typedLMPositions: Point[] = landmarks._positions.map(
        pt => new Point(pt._x, pt._y)
      );
      let typedLMDim: Dimensions = new Dimensions(
        landmarks._imgDims._width,
        landmarks._imgDims._height
      );
      let typedLMShift: Point = new Point(
        landmarks._shift._x,
        landmarks._shift._y
      );

      landmarks._positions = typedLMPositions;
      landmarks._shift = typedLMShift;
      landmarks._imgDims = typedLMDim;

      let typedLandmarks: FaceLandmarks = Object.assign(
        new FaceLandmarks68(typedLMPositions, typedLMDim, typedLMShift),
        unshiftedLandmarks
      );
      // console.log(typedLandmarks);
      // detection
      let detection = detections.detection;
      let typedRect: Rect = new Rect(
        detection._box._x,
        detection._box._y,
        detection._box._width,
        detection._box._height
      );
      let typedImageDims = new Dimensions(
        detection._imageDims._width,
        detection._imageDims._height
      );

      detection._box = typedRect;
      detection._imageDims = typedImageDims;

      let typedDetection: FaceDetection = Object.assign(
        new FaceDetection(0, typedRect, typedImageDims),
        detection
      );
      // console.log(typedDetection);

      // alignedRect
      let alignedRect = detections.alignedRect;
      let typedARect: Rect = new Rect(
        alignedRect._box._x,
        alignedRect._box._y,
        alignedRect._box._width,
        alignedRect._box._height
      );
      let typedAImageDims = new Dimensions(
        alignedRect._imageDims._width,
        alignedRect._imageDims._height
      );

      alignedRect._box = typedARect;
      alignedRect._imageDims = typedAImageDims;

      let typedADetection: FaceDetection = Object.assign(
        new FaceDetection(0, typedARect, typedAImageDims),
        alignedRect
      );
      // console.log(typedADetection);

      return {
        unshiftedLandmarks: typedUnshiftedLandmarks,
        landmarks: typedLandmarks,
        detection: typedDetection,
        alignedRect: typedADetection
      };
    },
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
