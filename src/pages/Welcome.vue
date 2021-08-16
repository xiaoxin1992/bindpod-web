<template>
  <el-row class="container">
    <el-col class="title">
      <div>
        <div class="title-h2">欢迎使用</div>
        <div class="title-h1">BindPod管理平台</div>
        <div class="tips">- Bind解析管理</div>
      </div>
      <div>
        <img src="../assets/image/login-logo.png" alt="logo">
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.container {
  background-color: #FFFFFF;
  border-radius: 5px;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 150px;
    line-height: 50px;

    img {
      width: 200px;
      height: 200px;
    }

    .title-h2 {
      font-size: 28px;
      color: #333;
    }

    .title-h1 {
      font-size: 38px;
      color: #409EFF;
    }

    .tips {
      color: #999;
      text-align: right;
      font-size: 16px;
    }
  }
}
</style>
