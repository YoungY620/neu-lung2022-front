<template>
  <div class="res-card">
    <el-image :src="url" 
    :preview-src-list="[url]" fit="contain" />
    <div class="res-left">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-radio-group v-model="showOrigin" size="large" @change="handleRadiusChange">
            <el-radio-button label="true">展示原图</el-radio-button>>
            <el-radio-button label="false">展示标记</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="8" style="margin:0">
          <el-button size="large" @click="handleSubmit"> 提交结果</el-button>
        </el-col>
      </el-row>

      <el-collapse v-model="activeName" @change="handleCollapseChange" accordion>
        <el-collapse-item v-for="(de, i) in localDetections" v-bind:key="i" :title="de.deType" :name="i">
          <el-radio-group class="res-item" v-model="de.deType" size="middle" @change="handleDetectionClsChange">
            <el-radio-button label="bronchus">(细)支气管</el-radio-button>>
            <el-radio-button label="vessel">血管</el-radio-button>
          </el-radio-group>
          <el-button class=" res-item" size="middle">修改标注框</el-button>
          <div class="res-ratings res-item" v-for="(ratingNum,index) in de.deRatings" v-bind:key="index">
            <span>{{index}}: </span>
            <el-input-number v-model="de.deRatings[index]" precision="1" step="0.1" max="3" min="0"/>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    originUrl: String,
    fullyMarkedUrl: String,
    detections: Array
  },
  emits:["submit"],
  data(){
    return {
      localDetections: this.detections,
      showOrigin: false,
      activeName: "",
      url:this.fullyMarkedUrl,
      showRadius: true
    }
  },
  methods: {
    handleRadiusChange(showOrigin){
      if(showOrigin==="true"){
        this.url = this.originUrl
      }else{
        console.log("active name", this.activeName)
        this.url = (this.activeName === "")?this.fullyMarkedUrl:this.localDetections[this.activeName].url
      }
    },
    handleCollapseChange(activeName){
      if(activeName === ""){
        this.url = (this.showOrigin==="true")?this.originUrl:this.fullyMarkedUrl
        this.showRadius = true
      }else{
        this.url = (this.showOrigin==="true")?this.originUrl:this.localDetections[activeName].url
        this.showRadius = false
      }
    },
    handleSubmit(){
      console.log(this.activeName, this.localDetections)
      this.$emit("submit")
    },
    handleDetectionClsChange(deCls){
      if(this.activeName===""){
        return;
      }
      let de = this.localDetections[this.activeName]
      if(!(("standbyRatings") in de)){
        de.standbyRatings = deCls==="vessel"?{d:1}:{a:1,b:1,c:1};
      }
      let tmp = de.standbyRatings
      de.standbyRatings = de.deRatings
      de.deRatings = tmp
    }
  }
}
</script>

<style>
.el-image{
  width: 700px;
}
.el-collapse{
  width: 400px;
}

.el-collapse-item__header {
   padding-left: 10px;
}

.el-collapse-item__content {
  padding: 0 20px 20px 20px;
}
.res-card{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  padding: 20px;
  gap: 20px;
}
.res-card .res-left{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.res-card .res-left .el-collapse-item .el-button{
  width: 100%;
}
.res-card .res-left .res-ratings{
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.res-item{
  margin: 10px;
}
</style>
