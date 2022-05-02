<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <vue-layout></vue-layout>
  <!-- <detection-labeling imgUrl="http://localhost:5000/processing/data/images/2-100-1.jpg?boxes=[[254,36,526,203]]" v-model:oriBox="bbox"></detection-labeling>
  <button @click="handleClick">buton</button> -->
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import VueLayout from './components/VueLayout.vue'
// import DetectionLabeling from "./components/DetectionLabeling.vue"

export default {
  name: 'App',
  components: {
    // HelloWorld,
    VueLayout,
    // DetectionLabeling
  },
  // data(){
  //   return {
  //     bbox: [254,36,526,203]
  //   }
  // },
  // methods:{
  //   handleClick(){
  //     console.log(this.bbox)
  //   }
  // }
}
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
  margin: 0;
}
/* body{
  margin: 0
} */
</style>
