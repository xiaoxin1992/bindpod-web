<template>
  <el-row type="flex" align="middle" justify="center" class="box">
    <el-col :span="12" class="right">
      <img src="../assets/image/404.png" alt="404">
    </el-col>
    <el-col class="left" :span="12">
      <p><span class="error">404</span><span class="eError">NOT FOUND</span></p>
      <p><span class="error">很抱歉</span></p>
      <p class="text">你要找的对象已经失去联系</p>
      <p>
        <el-link href="/" type="primary" class="btn-index">返回首页</el-link>
      </p>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "x400",
}
</script>

<style scoped lang="scss">
.box {
  min-height: 100vh;
  min-width: 100vw;
  background-color: #FFFFFF;

  .right {
    text-align: right;
    margin-right: 100px;

    img {
      height: 219px;
      width: 350px;
    }
  }

  .left {
    text-align: left;

    .error, .btn-index {
      font-size: 16px;
      font-weight: bold;
    }

    .eError {
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
    }

    .text {
      font-size: 14px;
    }

    p {
      color: #606266;
      margin-bottom: 10px;
    }
  }
}
</style>
