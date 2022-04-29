<template>
  <div class="page-body">
    <el-scrollbar max-height="300px">
      <el-upload
        class="upload-area"
        list-type="text"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        drag
        ref="uploadRef"
        :auto-upload="true"
      >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          only *.jpg files with a size less than 700kb
        </div>
      </template>
      </el-upload>
    </el-scrollbar>
    <div class="slider-demo-block">
      <span class="demonstration">选择置信度</span>
      <el-slider v-model="confidence" :format-tooltip="formatTooltip"/>
    </div>
    <el-button @click="handleClearAll">丢弃所有结果</el-button>
    <el-pagination background layout="prev, pager, next" :page-size=1 
    :total="results.length" v-model:current-page="(current)" hide-on-single-page="true"/>
    <div v-if="results.length!=0">
      <result-card 
      :key="current"
      :detections="results[current-1].detections"
      :fullyMarkedUrl="results[current-1].fullyMarkedUrl"
      :originUrl="results[current-1].originUrl">
      </result-card>
    </div>
  </div>
</template>
<script>
  import { UploadFilled } from '@element-plus/icons-vue'
  import ResultCard from './ResultCard.vue'
  export default {
    components: {
      UploadFilled,
      ResultCard,
    },
    data(){
      return {
        current: 1,
        confidence: 0,
        results: [
          {
            originUrl: "https://user-images.githubusercontent.com/49367723/165727713-80671182-4352-443a-a9e5-ebae754fe875.jpg",
            fullyMarkedUrl: "https://user-images.githubusercontent.com/49367723/165728175-5e779f69-96e1-4924-8535-f96c92531b0e.jpg",
            detections: [
              {
                deType: "vessel", 
                deRatings:{"(D)支气管渗出":2.5, "(D)血管浸润":2.5, "(D)血管渗出定性":2.5},
                url: "https://user-images.githubusercontent.com/49367723/165727744-11dd7846-32ad-4564-911b-3b5c45956631.jpg"
              }
            ]
          },
        ]
      }
    },
    methods: {
      formatTooltip: (val) => {
        return val / 100
      },
      handleClearAll: function(env){
        console.log(env)
        this.results.length = 0
        this.current = 1
      },
      handleUploadSuccess(env){
        console.log(env)
      }
    }
  }
</script>
<style>
.page-body{
  padding: 60px;
  /* width: 900px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
  width: 400px;
}
.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  /* overflow: hidden;
  text-overflow: ellipsis; */
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 70%;
}
</style>
