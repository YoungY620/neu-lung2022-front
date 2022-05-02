<template>
  <div>
    <el-container>
        <el-header class="header">
          <img @click="handleClickLogo" alt="neu lung" style="height: 60px;margin-right:20px" src="../assets/name.png">
          <button @click="chooseTab0" :class="tab0Class">
            开始分析
          </button>
          <button @click="chooseTab1" :class="tab1Class">
            模型管理
          </button>
        </el-header>
        <el-main class="main">
          <el-scrollbar>
            <hello-world v-if="currentTab===-1" @choose0="chooseTab0" @choose1="chooseTab1"></hello-world>
            <analyze-page v-if="currentTab===0"></analyze-page>
            <data-manage v-if="currentTab===1"></data-manage>
          </el-scrollbar>
        </el-main>
    </el-container>
  </div>
</template>

<script>
  import { ElContainer, ElHeader, ElMain} from 'element-plus'
  import AnalyzePage from "./AnalyzePage.vue"
  import DataManage from "./DataManage.vue"
  import HelloWorld from "./HelloWorld.vue"
  export default {
    components: {
      ElContainer,  ElHeader, ElMain, 
      // ElAffix, 
      // ElScrollbar,
      AnalyzePage,
      HelloWorld,
      DataManage
    },
    data() {
      return {
        currentTab: -1,
        tab0Class: "tab-button",
        tab1Class: "tab-button",
      }
    },
    methods: {
      chooseTab0: function(){
        this.currentTab = 0
        this.tab0Class = "tab-button-active";
        this.tab1Class = "tab-button";
      },
      chooseTab1: function(){
        this.currentTab = 1
        this.tab0Class = "tab-button";
        this.tab1Class = "tab-button-active";
      },
      handleClickLogo(){
        this.currentTab = -1
        this.tab0Class = "tab-button";
        this.tab1Class = "tab-button";
      }
    }
  }

</script>

<style>

.tab-button {
  background-color: #324057;
  height: 60px;
  width: 120px;
  color: white;
  border-width: 0;
  padding: 10px;
  margin: 0;
}
.tab-button:hover {
  background-color:#485b79;
}
.tab-button-active {
  background-color:#485b79;
  height: 60px;
  width: 120px;
  color: white;
  border-width: 0 0 4px 0;
  border-color: whitesmoke;
  padding: 10px;
  margin: 0;
}



.header{
  position: relative;
  background-color: #324057;
  height: 60px;
  border-radius: 20px 20px 0px 0px ;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.main{
  position: absolute;
  background-color: #e5e9f2;
  height: auto;

  left: 8px;
  right: 8px;
  top: 68px;
  bottom: 0;
  /* overflow-y: scroll; */
  padding: 0;
}

</style>