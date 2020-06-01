<template>
  <div id="wrapper">
    <main>
      <img id="logo" src="@launcher/assets/pumpkin_logo.png" alt="南瓜重工" />
      <button @click="launchLive2d">
        Live2d viewer
      </button>
      <button class="alt">
        Bongo Cat
      </button>
    </main>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "launcher",
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    launchLive2d() {
      ipcRenderer.send("launch-live2d");
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
}

main {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

#logo {
  width: 80%;
  margin-left: 10%;
  text-align: center;
  margin-bottom: 3px;
}

button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
  margin: 3px;
}

button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
