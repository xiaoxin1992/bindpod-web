<template>
  <el-menu
      class="nav-menu"
      :collapse="isCollapse"
      :default-active="$route.path"
      background-color="#545c64"
      text-color="#fff"
      router
  >
    <el-menu-item index="/welcome">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-c-scale-to-original"></i>
        <span>域名管理</span>
      </template>
      <el-menu-item index="/domain/list">域名列表</el-menu-item>
      <el-menu-item index="/domain/add">添加域名</el-menu-item>
    </el-submenu>
    <el-submenu index="3" v-if="is_staff">
      <template slot="title">
        <i class="el-icon-s-custom"></i>
        <span>账号管理</span>
      </template>
      <el-menu-item index="/user/list">用户管理</el-menu-item>
      <el-menu-item index="/user/domain">域名授权</el-menu-item>
    </el-submenu>
    <el-menu-item index="/logs">
      <i class="el-icon-s-home"></i>
      <span slot="title">操作记录</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import {mapState} from "vuex"

export default {
  name: "NavMenu",
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["is_staff"])
  }
}
</script>

<style scoped lang="scss">
.el-menu {
  border-right: none;
}
</style>
