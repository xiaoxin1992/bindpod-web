<template>
  <el-row class="home">
    <el-col :class="['menu', isCollapse?'collapse':'unCollapse']">
      <div class="logo">
        <img src="../assets/image/logo.png" alt="logo">
        <span :class="[isCollapse? 'hideLogo' :'showLogo']" v-if="!isCollapse">BindPod</span>
      </div>
      <nav-menu :is-collapse.sync=isCollapse></nav-menu>
    </el-col>
    <el-row type="flex" justify="center">
      <el-col class="right">
        <nav-header :is-collapse.sync=isCollapse></nav-header>
        <router-view class="content"></router-view>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import NavHeader from "@/components/NavHeader";
import NavMenu from "@/components/NavMenu";

export default {
  name: "Home",
  components: {NavMenu, NavHeader},
  data() {
    return {
      isCollapse: false
    }
  },
}
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  width: 100vw;
  min-height: 100vh;
  min-width: 1200px;

  .menu {
    min-height: 770px;
    position: relative;
    background-color: #545c64;
    color: #FFFFFF;
    height: 100vh;
    width: 210px;
    overflow-y: auto;
    transition: width .3s;
    border-right: solid 1px #545c64;

    &.collapse {
      width: 65px;
    }

    &.unCollapse {
      width: 210px;
    }

    .showLogo {
      opacity: 1;
      transition: opacity 1.5s;
    }

    .hideLogo {
      opacity: 0;
      top: 0;
      left: 0;
    }

    .logo {
      padding-left: 20px;
      padding-top: 20px;

      span {
        position: absolute;
        margin-left: 15px;
        height: 30px;
        line-height: 30px;
      }
    }

    img {
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
    }
  }

  .right {
    .content {
      min-height: calc(770px - 80px);
      margin: 20px 20px 0 20px;
      height: calc(100vh - 80px);
    }
  }
}
</style>
