import { ipcRenderer } from "electron";
import * as faceapi from "face-api.js";

let faceapiOptions = null;

let isReady = false;
let timmerId = null;

faceapi.env.monkeyPatch({
  Canvas: HTMLCanvasElement,
  Image: HTMLImageElement,
  ImageData: ImageData,
  Video: HTMLVideoElement,
  createCanvasElement: () => document.createElement("canvas"),
  createImageElement: () => document.createElement("img")
});

Promise.all([
  faceapi.nets.tinyFaceDetector.load("static/weights"),
  faceapi.nets.faceLandmark68Net.loadFromUri("static/Weights/")
]);

/* ------------------------------------------------------------ */

ipcRenderer.on("startDetection", (event, deviceId) => {
  initCamera(deviceId).then(() => {
    timmerId = setInterval(() => detectLandmark(), 1000);
  });
});

ipcRenderer.on("stopDetection", () => {
  if (timmerId) {
    clearInterval(timmerId);
  }
  let cam = getVideo();
  let stream = cam.srcObject;
  cam.srcObject = null;
  if (stream) {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
});

ipcRenderer.on("setVideoDevice", (event, deviceId) => {
  switchStream(deviceId);
});

ipcRenderer.on("setFaceOptions", (event, options) => {
  setFaceOptions(options);
});

/* ------------------------------------------------------------ */
let notifyRenderer = (command, payload) => {
  ipcRenderer.send("window-message-from-worker", {
    command: command,
    payload: payload
  });
};

let onReady = () => {
  notifyRenderer("ready", {});
};

let onLandmark = detection => {
  // const Landmark = parseLandmark(detection);
  console.log(detection);
  notifyRenderer("Landmark", {
    Landmark: detection
  });
};

// const parseLandmark = detection => {
//   const width = detection["detection"]["imageWidth"];
//   const height = detection["detection"]["imageHeight"];
//   let landmarks = detection["landmarks"];
//   let shift = landmarks["_shift"];
//   let positions = landmarks["_positions"];
//   return { shift: shift, points: positions, width: width, height: height };
// };

const getFaceOptions = () => {
  if (faceapiOptions == null) {
    faceapiOptions = new faceapi.TinyFaceDetectorOptions();
  }
  return faceapiOptions;
};

const setFaceOptions = options => {
  faceapiOptions = options;
};

const getVideo = () => {
  return document.getElementById("cam");
};
/* ------------------------------------------------------------ */
const initCamera = async deviceId => {
  let cam = getVideo();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      deviceId: deviceId
    }
  });
  cam.srcObject = stream;

  return new Promise(resolve => {
    cam.onloadedmetadata = () => {
      resolve(cam);
    };
  });
};

const switchStream = async function(deviceId) {
  console.log("switchSteram");
  let cam = getVideo();

  if (cam.srcObject == null) {
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      deviceId: deviceId
    }
  });

  cam.srcObject.getTracks().forEach(function(track) {
    track.stop();
  });

  cam.srcObject = stream;
};

const detectLandmark = async () => {
  let result = await faceapi
    .detectSingleFace(getVideo(), getFaceOptions())
    .withFaceLandmarks();

  if (!isReady) {
    isReady = true;
    onReady();
  }

  if (result != undefined) {
    onLandmark(result);
  }
};
