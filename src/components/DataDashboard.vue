<template>
  <div class="dashboard">
    <el-progress type="circle" 
    :percentage="detectionNum(data)[2]*100">
        <span class="percentage-value">{{
          purify([detectionNum(data)[0]])
        }}</span>
        <span class="percentage-label">支气管/血管</span>
        <span class="percentage-label">样本比例</span>
    </el-progress>
    <div class="stat-block">
      <span class="percentage-label">图像数量</span>
      <span class="percentage-value">{{ imageNum(data) }}</span>
    </div>
    <div class="stat-block">
      <span class="percentage-label">实体标注量</span>
      <span class="percentage-value">{{ detectionNum(data)[1] }}</span>
    </div>
    <div class="demo-progress" :key="currentIndex">
      <el-progress 
      v-for="(itm, idx) in getIndexNumBins(data, currentIndex)" 
      v-bind:key="idx" 
      :percentage="itm" :format="format"> 
        <span>{{idx}}~{{(idx+1)}}: {{itm}}%</span>
      </el-progress>
    </div>
    <el-select v-model="currentIndex" class="m-2" placeholder="选择指标" size="large">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
  },
  data() {
    return {
      options: [{value: "a", label: "A",},{value: "b", label: "B",},
        {value: "c",label: "C",},{value: "d",label: "D",},{value: "e",label: "E",}],
      currentIndex: "a"
    };
  },
  methods: {
    purify: function (list) {
      var x, y;
      var temp = [];
      for (var i = 0; i < list.length; i++) {
        var son = list[i][0],
          mother = list[i][1];
        var j = 2;
        while (j <= son && j <= mother) {
          x = son / j;
          y = mother / j;
          ++j;
          if ((x + "").indexOf(".") == -1 && (y + "").indexOf(".") == -1) {
            son = x;
            mother = y;
            j = 2;
          }
          // console.log(x, y);
        }
        temp.push([son, mother]);
      }
      return temp[0][0] + ":" + temp[0][1];
    },
    imageNum(dataArr){
      let fnameSet = new Set()
      dataArr.forEach(element => {
        fnameSet.add(element['file_name'])
      });
      return fnameSet.size
    },
    detectionNum(dataArr){
      let vnum = 0, bnum = 0;
      dataArr.forEach(ele=>{
        if(ele["type"]==="vessel"){
          vnum ++;
        }else if(ele['type']==="bronchus"){
          bnum++;
        }
      });
      return [[vnum, bnum], bnum+vnum, bnum/(bnum+vnum)];
    },
    getIndexNumBins(dataArr, indexName){
      let bins;
      if(indexName === 'e') bins = [0,0,0,0,0];
      else if (indexName === 'c') bins = [0,0];
      else bins = [0,0,0];
      let sum = 0;

      for(let i in dataArr){
        if(dataArr[i][indexName] !== undefined){
          let whichBin = parseInt(dataArr[i][indexName])
          if (whichBin < bins.length && whichBin >= 0){
            bins[whichBin]++;
            sum++;
          }
        }
      }
      for(let i in bins){
        bins[i] = (bins[i]/sum*100).toFixed(2)
      }
      console.log(bins)
      return bins;
    }
  },
};
</script>

<style>
.dashboard {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}
.dashboard .el-progress {
  margin: 20px 0px 30px 20px;
}
.dashboard .stat-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}

.dashboard .el-select {
  width: 150px;
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.demo-progress .el-progress--circle {
  margin-right: 15px;
}
</style>
