<template>
  <el-row type="flex" justify="between" class="header">
    <div class="fold" @click="isCollapse=!isCollapse"><i :class="[isCollapse?'el-icon-s-unfold':'el-icon-s-fold']"></i>
    </div>
    <el-col class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index">
          <router-link :to="item.path === '' ? '/' : item.path" v-if="index===0">{{ item.meta["title"] }}</router-link>
          <span v-else>{{ item.meta["title"] }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="12" class="userinfo">
      {{ display_name }} ({{ is_staff ? "管理员" : "普通用户" }})
      <el-dropdown @command="handleDropDown">
      <span class="el-dropdown-link downMenu">
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown" style="width: 120px">
          <el-dropdown-item command="1" icon="el-icon-edit-outline">修改密码</el-dropdown-item>
          <el-dropdown-item command="2" icon="el-icon-switch-button">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-dialog
        title="修改密码"
        :visible.sync="dialog.dialogShow"
        width="450px" @closed="dialogFormReset">
      <el-form :model="form" size="small" label-position="right" :rules="rules" ref="form">
        <el-form-item prop="old_password">
          <el-input v-model="form.old_password" show-password prefix-icon="el-icon-lock"
                    placeholder="输入当前密码"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" show-password prefix-icon="el-icon-lock" placeholder="输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.dialogShow = false" size="small" plain>取 消</el-button>
          <el-button type="primary" @click="changePassword" size="small" plain>修 改</el-button>
        </span>
    </el-dialog>
  </el-row>
</template>

<script>
import {mapState} from "vuex"

export default {
  name: "NavHeader",
  watch: {
    isCollapse: function (newValue) {
      this.$emit('update:isCollapse', newValue)
    }
  },
  computed: {
    ...mapState(["username", "display_name", "is_staff"])
  },
  data() {
    return {
      rules: {
        password: [{required: true, message: "新密码不能为空", trigger: "blur"}],
        old_password: [{required: true, message: "当前密码不能为空", trigger: "blur"}]
      },
      form: {
        password: "",
        old_password: ""
      },
      dialog: {
        dialogShow: false
      },
      isCollapse: false
    }
  },
  methods: {
    dialogFormReset() {
      this.$refs.form.resetFields()
    },
    handleDropDown(command) {
      switch (command) {
        case "1":
          this.dialog.dialogShow = true
          break
        case "2":
          this.logout()
          break
      }
    },
    logout() {
      this.$cookie.del("token")
      this.$router.push({name: "login"})
    },
    changePassword() {
      this.$refs.form.validate(validate => {
        if (validate) {
          const {password, old_password} = this.form
          this.$api.req(this.$api.changePassword, {
            username: this.username,
            password,
            old_password
          }).then(res => {
            let {code, msg} = res
            if (code === 200) {
              this.$message.success(msg)
              setTimeout(() => {
                this.logout()
              }, 1000)
            } else {
              this.$message.error(msg)
            }
          })
          this.dialog.dialogShow = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  color: #000000;
  height: 60px;
  padding: 0 20px;

  .fold {
    font-size: 22px;
    margin-right: 20px;
  }

  .userinfo {
    text-align: right;
    font-size: 14px;
    color: #5d5a5a;

    .downMenu {
      color: #000000;
    }
  }
}
</style>
