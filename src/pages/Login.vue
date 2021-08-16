<template>
  <el-row type="flex" align="middle" justify="center" class="login">
    <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="login-box">
      <el-main>
        <img src="../assets/image/login-logo.png" alt="logo">
        <span class="title">BindPod</span>
        <el-form :model="form" ref="form" class="form" :rules="rules">
          <el-form-item prop="username">
            <el-input class="big" clearable placeholder="请输入用户名" v-model="form.username" prefix-icon="el-icon-user"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="big" clearable show-password placeholder="请输入密码" v-model="form.password"
                      prefix-icon="el-icon-lock"/>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" class="big" @click="login">登陆</el-button>
      </el-main>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [{required: true, message: "请输入用户名", trigger: "blur"}],
        password: [{required: true, message: "请输入密码", trigger: "blur"}]
      },
    }
  },
  methods: {
    keyDown(e) {
      if (e.keyCode === 13) {
        this.login()
      }
    },
    login() {
      this.$refs.form.validate((validate) => {
        if (validate) {
          this.$api.req(this.$api.login, this.form).then(res => {
            this.$cookie.del("token").set("token", res["Token"])
            const {username, display_name, is_staff} = res
            this.$store.dispatch("saveUser", username, display_name)
            this.$store.dispatch("saveUserType", is_staff)
            this.$router.push('/')
          })
        }
      })
    },
  },
  mounted() {
    window.addEventListener('keydown', this.keyDown)
  },
  destroyed() {
    window.removeEventListener('keydown', this.keyDown, false)
  }
}
</script>

<style scoped lang="scss">
.login {
  height: 100vh;
  width: 100vw;
  min-height: 700px;
  min-width: 1200px;

  .login-box {
    background-color: #FFFFFF;
    height: 400px;
    width: 480px;
    border-radius: 5px;
    text-align: center;
    padding-top: 30px;
    transform: translateY(-10%);

    .form {
      margin-top: 30px;
    }

    img {
      height: 50px;
      width: 50px;
      vertical-align: middle;
    }

    .title {
      font-size: 18px;
    }

    .big {
      width: 100%;
      height: 45px;
    }
  }
}
</style>
