<template>
  <div class="hello-page">
    <img src="../assets/logo.png"/>
    <img src="../assets/name-bk.png"/>
    <div class="hello-buttons">
      <el-button size="large" type="primary" @click="$emit('choose0')">开始分析</el-button>
      <el-button size="large" @click="$emit('choose1')">数据管理</el-button>
    </div>
  </div>
</template>

<style>
.hello-page{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.hello-page img{
  width: 20%;
}
.hello-page .hello-buttons{
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 40px;
  gap: 20px
}
</style>
