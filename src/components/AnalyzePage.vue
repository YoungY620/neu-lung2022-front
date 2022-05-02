<template>
  <div class="page-body">
    <el-scrollbar max-height="300px">
      <el-upload
        class="upload-area"
        list-type="text"
        action="http://localhost:5000/analysis"
        name="image"
        :data="{'confidence': confidence}"
        multiple
        drag
        :on-success="handleUploadSuccess"
        :auto-upload="true"
        accept=".jpg"
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
      <el-slider v-model="confidence" :format-tooltip="formatTooltip" />
    </div>
    <el-button @click="handleClearAll">丢弃所有结果</el-button>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="1"
      :total="results.length"
      v-model:current-page="current"
      :hide-on-single-page="true"
    />
    <div v-if="results.length != 0">
      <result-card
        :key="current"
        :detections="results[current - 1].detections"
        v-model:originImgName="results[current - 1].originUrl"
        v-model:e="results[current-1].e"
        v-model:submitted="results[current-1].submitted"
      >
      </result-card>
    </div>
  </div>
</template>
<script>
import { UploadFilled } from "@element-plus/icons-vue";
import ResultCard from "./ResultCard.vue";
export default {
  components: {
    UploadFilled,
    ResultCard,
  },
  data() {
    return {
      current: 1,
      confidence: 0,
      results: [],
    };
  },
  methods: {
    formatTooltip (val) {
      return val / 100;
    },
    handleClearAll () {
      this.results.length = 0;
      this.current = 1;
    },
    handleUploadSuccess(response) {
      console.log("upload success")
      let newRes = {}
      newRes.originUrl = response['origin_img']
      newRes.detections = []
      newRes.e = response['e']
      let de
      for(de in response['bronchus']){
        let newDeItem = {
          deType: "bronchus",
          deRatings: {a:response['a'][de], b:response['b'][de], c:response['c'][de]},
          bbox: response['bronchus'][de],
          conf: response['b_conf'][de]
        }
        newRes.detections.push(newDeItem)
      }
      for(de in response['vessel']){
        let newDeItem = {
          deType: "vessel",
          deRatings: {d:response['d'][de]},
          bbox: response['vessel'][de],
          conf: response['v_conf'][de]
        }
        newRes.detections.push(newDeItem)
      }
      newRes.submitted = false;
      console.log(newRes)
      this.results.push(newRes)
    },
  },
};
</script>
<style>
.page-body {
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
