<template>
  <div class="dm-page-body">
    <div class="data-body">
      <data-dashboard :data="tableData"></data-dashboard>
      <el-table height="250" :data="tableData" style="width: 100%">
        <el-table-column label="Image">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                :src="scope.row.url"
                :initial-index="4"
                fit="cover" lazy
              />
            </div>
          </template> </el-table-column
        >>
        <el-table-column prop="file_name" label="File Name" />
        <el-table-column prop="a" label="A" />
        <el-table-column prop="b" label="B" />
        <el-table-column prop="c" label="C" />
        <el-table-column prop="d" label="D" />
        <el-table-column prop="e" label="E" />
      </el-table>
    </div>
    <div class="page-left">
      <el-progress
        type="dashboard"
        color="#85ce61"
        width="200"
        :percentage="80"
      >
        <el-button type="success" circle @click="dialogFormVisible = true"
          >开始训练</el-button
        >
      </el-progress>
      <el-upload
        class="upload-area"
        list-type="text"
        action="http://localhost:5000/importbyzip"
        method="post"
        :data="{ drop_before: dropBefore }"
        name="data"
        multiple
        drag
        :auto-upload="true"
        :on-change="handleUpdateData"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">批量上传数据</div>
        <div class="el-upload__text">拖拽文件到此处或 <em>点击</em></div>
        <template #tip>
          <div class="el-upload__tip">only *.zip files</div>
        </template>
      </el-upload>
      <el-switch
        v-model="dropBefore"
        class="mb-2"
        active-text="覆盖之前数据"
        inactive-text=""
      />
    </div>
  </div>
  <el-dialog
    close-on-press-escape="false"
    v-model="dialogFormVisible"
    title="训练选项"
  >
    <div class="train-form">
      <span>特征抽取训练次数</span>
      <el-input-number label="特征抽取训练次数" v-model="clEpoch" :min="1" />
      <span>目标检测训练次数</span>
      <el-input-number
        label="目标检测训练次数"
        v-model="detectionEpoch"
        :min="1"
      />
      <span>测试数据比例</span>
      <el-input-number
        label="测试数据比例"
        v-model="testRatio"
        :min="0"
        :max="1"
        :step="0.01"
      />
      <el-switch
        v-model="fromScratch"
        active-text="重新开始训练"
        inactive-text="在现有模型上继续"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleStartTraining"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import DataDashboard from "./DataDashboard.vue";
import { dynamicBBoxImgUrl } from "./utils";
const axios = require("axios");
export default {
  components: {
    DataDashboard,
    // UploadFilled,
  },
  data() {
    return {
      tableData: [],
      dropBefore: false,
      dialogFormVisible: false,
      clEpoch: 200,
      detectionEpoch: 50,
      testRatio: 0.2,
      fromScratch: true,
    };
  },
  methods: {
    handleUpdateData() {
      let that = this;
      axios.get("http://localhost:5000/fetch").then(function (response) {
        that.tableData = eval("(" + response["data"] + ")").data;
        for (let i in that.tableData) {
          let item = that.tableData[i];
          let file = "/data/images/" + item["file_name"];
          let detection;
          detection =
            item["e"] === undefined
              ? [
                  {
                    bbox: [
                      item["xmin"],
                      item["ymin"],
                      item["xmax"],
                      item["ymax"],
                    ],
                    deType: item["type"],
                  },
                ]
              : [];
          that.tableData[i]["url"] = dynamicBBoxImgUrl(file, detection);
        }
      });
    },
    handleStartTraining() {
      let formdata = new FormData();
      formdata.append("from_scratch", this.fromScratch);
      formdata.append("cl_epoch", this.clEpoch);
      formdata.append("detection_epoch", this.detectionEpoch);
      formdata.append("test_ratio", this.testRatio);
      axios.post("http://localhost:5000/train", formdata);
      this.dialogFormVisible = false;
    },
  },
  created: function () {
    let that = this;
    axios.get("http://localhost:5000/fetch").then(function (response) {
      that.tableData = eval("(" + response["data"] + ")").data;
      for (let i in that.tableData) {
        let item = that.tableData[i];
        let file = "/data/images/" + item["file_name"];
        let detection;
        detection =
          item["e"] === undefined
            ? [
                {
                  bbox: [
                    item["xmin"],
                    item["ymin"],
                    item["xmax"],
                    item["ymax"],
                  ],
                  deType: item["type"],
                },
              ]
            : [];
        that.tableData[i]["url"] = dynamicBBoxImgUrl(file, detection);
      }
    });
  },
};
</script>

<style>
.dm-page-body {
  display: flex;
  flex-direction: row;
  margin: 20px;
  margin: 0;
  width: 100%;
  /* height: 300px; */
  /* background-color: aquamarine; */
}
.dm-page-body .data-body {
  width: 70%;
  padding: 20px 0 20px 40px;
  /* height: 300px */
  /* margin-bottom: 20px; */
}
.dm-page-body .page-left {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
}
.page-left .el-button {
  margin-top: 30px;
}
.dm-page-body .page-left .el-progress .el-button {
  margin-top: 0;
  width: 70px;
  height: 70px;
}

.page-left .el-upload {
  width: 100%;
}
.page-left .upload-area {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.train-form {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  padding-left: 40px;
  gap: 20px;
}
.el-dialog {
  margin-top: 30px;
  margin-bottom: auto;
}
</style>
