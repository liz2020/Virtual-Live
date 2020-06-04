<template>
  <ClickDropdown :title="title">
    <dropdownModelItem
      v-for="(model, index) in models"
      :key="index"
      :model="model"
      :index="index"
      :responseMethod="changeModel"
    />
  </ClickDropdown>
</template>

<script>
import ClickDropdown from "@live2d/components/ClickDropdown";
import dropdownModelItem from "@live2d/components/dropdownModelItem";
import { LAppLive2DManager } from "@live2d/lapp/lapplive2dmanager";
import * as LAppDefine from "@live2d/lapp/lappdefine";
export default {
  name: "ModelSelector",
  components: { ClickDropdown, dropdownModelItem },
  data: function() {
    return {
      models: undefined,
      title: "模型"
    };
  },
  mounted: function() {
    this.models = LAppDefine.ModelDir;
    this.title = this.models[0];
  },
  methods: {
    changeModel(index) {
      LAppLive2DManager.getInstance().changeScene(index);
      this.title = this.models[index];
    }
  }
};
</script>

<style></style>
