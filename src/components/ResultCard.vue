<template>
  <div class="res-card">
    <el-image :src="url" :preview-src-list="[url]" fit="contain" />
    <div class="res-left">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-radio-group
            v-model="showOrigin"
            size="large"
            @change="handleRadiusChange"
          >
            <el-radio-button label="true">展示原图</el-radio-button>>
            <el-radio-button label="false">展示标记</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="8" style="margin: 0">
          <el-popconfirm title="提交后将无法更改"          
            confirm-button-text="确认提交"
            cancel-button-text="取消"
            @confirm="handleSubmit"
          >
            <template #reference>
              <el-button size="large" :disabled="disabled" > 
                提交结果
              </el-button>
            </template>
          </el-popconfirm>
        </el-col>
      </el-row>
      <span>E: </span>
      <el-input-number
        v-model="mutE"
        precision="1"
        step="0.1"
        :max="getIndexMaxVal('e')"
        min="0"
        :disabled="disabled"
      />
      <el-collapse
        v-model="activeDetection"
        @change="handleCollapseChange"
        accordion
      >
        <el-collapse-item
          v-for="(de, i) in mutDetections"
          v-bind:key="i"
          :title="de.deType+'('+i+')'"
          :name="i"
        >
          <el-button type="danger" class="res-item" @click="handleDetectionDelete">
            <el-icon><delete /></el-icon>
          </el-button>
          <el-radio-group
            class="res-item"
            v-model="de.deType"
            size="middle"
            @change="handleDetectionClsChange"
            :disabled="disabled"
          >
            <el-radio-button label="bronchus">(细)支气管</el-radio-button>
            <el-radio-button label="vessel">血管</el-radio-button>
          </el-radio-group>
          <el-button
            class="res-item"
            size="default"
            @click="handleDetectionBoxing"
            :disabled="disabled"
            >修改标注框</el-button
          >
          <div
            class="res-ratings res-item"
            v-for="(ratingNum, index) in de.deRatings"
            v-bind:key="index"
          >
            <span>{{ index }}: </span>
            <el-input-number
              v-model="de.deRatings[index]"
              precision="1"
              step="0.1"
              :max="getIndexMaxVal(index)"
              min="0"
              :disabled="disabled"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-button @click="handleDetectionAdd"><el-icon><plus /></el-icon></el-button>
    </div>
    <el-dialog
      v-model="detectionDialogVisible"
      title="拖动边框修改标注框，滑动滚轮缩放图片"
      width="50%"
      height="70%"
      destroy-on-close
      center
    >
      <detection-labeling
        :imgUrl="originUrl"
        v-model:oriBox="tempBBox"
      ></detection-labeling>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detectionDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleDetectionBoxingConfirm"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import DetectionLabeling from "./DetectionLabeling.vue";
import {dynamicBBoxImgUrl} from "./utils"
import { Plus, Delete } from "@element-plus/icons-vue";
const axios = require('axios');
export default {
  components: {
    DetectionLabeling,
    Plus,
    Delete,
  },
  props: {
    originImgName: String,
    detections: Array,
    e: Number,
    submitted: Boolean
  },
  emits: ["update:detections", "update:e", "update:submitted"],
  data() {
    return {
      // local temp copy. sync when submit
      tempBBox: [0, 0, 400, 400],
      mutE: this.e,
      mutDetections: this.detections,
      disabled:this.submitted,

      fullyMarkedUrl: "",
      originUrl:"",

      showOrigin: "false",
      activeDetection: "",
      url: "",
      showRadius: true,
      detectionDialogVisible: false,
    };
  },
  created: function(){
    this.originUrl = dynamicBBoxImgUrl(this.originImgName, []);
    this.refreshUrl();
  },
  methods: {
    handleRadiusChange(showOrigin) {
      if (showOrigin === "true") {
        this.url = this.originUrl;
      } else {
        console.log("active name", this.activeDetection);
        this.url =
          this.activeDetection === ""
            ? this.fullyMarkedUrl
            : this.mutDetections[this.activeDetection].url;
      }
    },
    handleCollapseChange(activeDetection) {
      if (activeDetection === "") {
        this.url =
          this.showOrigin === "true" ? this.originUrl : this.fullyMarkedUrl;
        this.showRadius = true;
      } else {
        this.url =
          this.showOrigin === "true"
            ? this.originUrl
            : this.mutDetections[activeDetection].url;
        this.showRadius = false;
      }
    },
    handleSubmit() {
      console.log(this.activeDetection, this.mutDetections);
      this.$emit("update:e", this.mutE);
      this.$emit("update:detections", this.mutDetections);
      let imgData = {"originName":this.originImgName, "e":this.mutE, "detections":[]}
      for(let i in this.mutDetections){
        let resItem = {
          "type": this.mutDetections[i].deType,
          "box": this.mutDetections[i].bbox,
        };
        for (let key in this.mutDetections[i].deRatings){
          resItem[key] = this.mutDetections[i].deRatings[key]
        }
        imgData['detections'].push(resItem)
      }
      let that = this;
      axios.post("http://localhost:5000/push",
      {"imgs":[imgData]}).then(function(){
        that.$emit("submit")
      });
      this.disabled = true;
      this.$emit("update:submitted", this.disabled);
    },
    handleDetectionClsChange(deCls) {
      if (this.activeDetection === "") {
        return;
      }
      let de = this.mutDetections[this.activeDetection];
      if (!("standbyRatings" in de)) {
        de.standbyRatings =
          deCls === "vessel" ? { d: 1 } : { a: 1, b: 1, c: 1 };
      }
      let tmp = de.standbyRatings;
      de.standbyRatings = de.deRatings;
      de.deRatings = tmp;

      this.refreshUrl(de);
    },
    handleDetectionBoxing() {
      this.tempBBox = this.mutDetections[this.activeDetection].bbox;
      this.detectionDialogVisible = true;
    },
    handleDetectionBoxingConfirm() {
      this.mutDetections[this.activeDetection].bbox = this.tempBBox;
      this.detectionDialogVisible = false;
      this.refreshUrl(this.mutDetections[this.activeDetection]);
    },
    handleDetectionDelete(){
      this.mutDetections.splice(this.activeDetection, 1);
      this.fullyMarkedUrl = dynamicBBoxImgUrl(this.originImgName, this.mutDetections);
      this.activeDetection = "";
      this.refreshUrl();
    },
    handleDetectionAdd(){
      let newDetection = {
        deType: "vessel",
        deRatings: {d:0},
        bbox: [0, 0, 600, 400],
        conf: 100
      };
      this.mutDetections.push(newDetection);
      this.refreshUrl(newDetection);
    },

    getIndexMaxVal(indexName) {
      if (indexName === "e") return 5;
      if (indexName === "c") return 2;
      return 3;
    },
    refreshUrl(changedDetection){
      if(changedDetection === undefined){
        for (let dei in this.mutDetections){
          this.mutDetections[dei].url = dynamicBBoxImgUrl(this.originImgName, [this.mutDetections[dei]]);
        }
      }else{
        changedDetection.url = dynamicBBoxImgUrl(this.originImgName, [changedDetection]);
      }
      this.fullyMarkedUrl = dynamicBBoxImgUrl(this.originImgName, this.mutDetections)
      if(this.showOrigin==="false"){
        if(this.activeDetection===""){
          this.url = this.fullyMarkedUrl;
        }else{
          this.url = this.mutDetections[this.activeDetection].url
        }
      }else{
        this.url = this.originUrl;
      }
    }
  },
};
</script>

<style>
.el-image {
  width: 700px;
}
.el-collapse {
  width: 400px;
}

.el-collapse-item__header {
  padding-left: 10px;
}

.el-collapse-item__content {
  padding: 0 20px 20px 20px;
}
.res-card {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  padding: 20px;
  gap: 20px;
}
.res-card .res-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.res-card .res-left .el-collapse-item .el-button {
  width: 100%;
}
.res-card .res-left .res-ratings {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.res-item {
  margin: 10px 10px 10px 0;
}
</style>
