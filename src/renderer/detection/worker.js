// https://medium.com/@andreas.schallwig/do-not-laugh-a-simple-ai-powered-game-3e22ad0f8166
const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

import * as faceapi from "face-api.js";

// init detection options
const faceapiOptions = new faceapi.TinyFaceDetectorOptions();

// cam reference
let cam;

let isRunning = true;
let isReady = false;

// configure face API
faceapi.env.monkeyPatch({
  Canvas: HTMLCanvasElement,
  Image: HTMLImageElement,
  ImageData: ImageData,
  Video: HTMLVideoElement,
  createCanvasElement: () => document.createElement("canvas"),
  createImageElement: () => document.createElement("img")
});

const loadNet = async () => {
  await faceapi.nets.tinyFaceDetector.load("static/weights");
  await faceapi.nets.faceLandmark68Net.loadFromUri("static/Weights/");
};

const initCamera = async (width, height) => {
  const video = document.getElementById("cam");
  video.width = width;
  video.height = height;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: width,
      height: height
    }
  });
  video.srcObject = stream;

  return new Promise(resolve => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
};

const detectLandmark = async () => {
  let result = await faceapi
    .detectSingleFace(cam, faceapiOptions)
    .withFaceLandmarks();

  if (!isReady) {
    isReady = true;
    onReady();
  }

  if (typeof result !== "undefined") {
    onLandmark();
  }

  if (isRunning) {
    setTimeout(detectLandmark(), 100);
  }
};

let onReady = () => {
  notifyRenderer("ready", {});
};

let onLandmark = type => {
  notifyRenderer("Landmark", {
    type: type
  });
};

let notifyRenderer = (command, payload) => {
  // notify renderer
  ipcRenderer.send("window-message-from-worker", {
    command: command,
    payload: payload
  });
};

loadNet()
  .then(() => {
    console.log("Network has loaded");
    return initCamera(640, 480);
  })
  .then(video => {
    console.log("Camera was initialized");
    cam = video;
    detectLandmark();
  });
