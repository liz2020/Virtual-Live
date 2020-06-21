<template>
  <div id="wrapper">
    <main>
      <img id="logo" src="@launcher/assets/pumpkin_logo.png" alt="南瓜重工" />
      <button @click="launchLive2dDetection">
        {{ $t("message")["launcher.components.Launcher.live2d"] }}
      </button>
      <button class="alt">
        {{ $t("message")["launcher.components.Launcher.tutorial"] }}
      </button>
      <LanguageSelector :onClick="setLanguage"></LanguageSelector>
    </main>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import LanguageSelector from "@launcher/components/LanguageSelector";
import { UserConfig } from "@/config";

export default {
  name: "launcher",
  components: { LanguageSelector },
  methods: {
    launchLive2dDetection() {
      ipcRenderer.send("launch-live2d", this.locale);
    },
    setLanguage(locale) {
      UserConfig.getInstance().set("locale", locale);
      this.$i18n.locale = locale;
      ipcRenderer.send("setLanguage", locale);
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
