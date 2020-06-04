<template>
  <a @click="responseMethod(index)">{{ model }}</a>
</template>

<script>
export default {
  name: "DropDownItem",
  props: ["model", "index", "responseMethod"]
};
</script>

<style></style>
