<template>
  <div class="dropdown">
    <button @click="expandDropdown" class="dropbtn">
      <div>
        <div class="icon"></div>
        <div class="icon"></div>
        <div class="icon"></div>
      </div>
      <div class="title">{{ title }}</div>
    </button>
    <div ref="dropdownList" class="dropdown-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { debounce } from "@/utill";
export default {
  props: ["title"],
  created() {
    window.addEventListener("click", debounce(this.hideDropdown, 100));
  },
  destroyed() {
    window.removeEventListener("click", this.hideDropdown);
  },
  methods: {
    expandDropdown() {
      this.$refs["dropdownList"].classList.toggle("show");
    },
    hideDropdown(event) {
      if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.icon {
  width: 13px;
  height: 2px;
  background-color: white;
  margin: 3px 1px 1px 3px;
}

.title {
  margin-left: auto;
  margin-right: auto;
}

/* https://www.w3schools.com/howto/howto_js_dropdown.asp */
/* Dropdown Button */
.dropbtn {
  background-color: #3498db;
  color: white;
  width: 100%;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex;
}

/* Dropdown button on hover & focus */
.dropbtn:hover,
.dropbtn:focus {
  background-color: #2980b9;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display: block;
}
</style>
