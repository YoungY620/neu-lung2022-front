<template>
  <cropper
    class="cropper"
    :src="imgUrl"
    ref="cropper"
    :default-position="{
      left: oriBox[0],
      top: oriBox[1]
    }"
    :default-size="{
      width: oriBox[2]-oriBox[0],
      height: oriBox[3]-oriBox[1]
    }"
    :stencil-props="{
      
    }"
    @change="change"
  />
</template>
<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  components: {
    Cropper,
  },
  props:{
    oriBox: Array,
    imgUrl:String
  },
  emits:["update:oriBox"],

  data(){
    return {
      img: "http://localhost:5000/data/images/2-100-1.jpg",
    }
  },
  methods: {
    change({ coordinates, canvas }) {
      let co = coordinates;
      console.log(co, canvas);
      this.$emit("update:oriBox", [co['left'], co['top'], co['left']+co['width'], co['top']+co['height']])
    },
  },
};
</script>
<style>
.cropper {
	/* height: 400px;
	width: 400px; */
	background: #DDD;
}
</style>