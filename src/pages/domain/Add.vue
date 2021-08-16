<template>
  <el-row class="container" type="flex" justify="center">
    <el-col class="form" :span="12">
      <el-form size="small" label-width="80px" :model="form" ref="form" :rules="rules">
        <el-form-item label="域名" prop="domain">
          <el-input placeholder="请输入域名" v-model="form.domain"></el-input>
        </el-form-item>
        <el-form-item label="区域文件" prop="path">
          <el-input placeholder="请输入输入区域文件路径" v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="$refs.form.resetFields()" plain>重置</el-button>
          <el-button type="primary" @click="submit" plain>立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col>
      <div class="tip">
        <p>域名:</p>
        <p> 需要输入顶级域名。例如: test.com</p>
        <br/>
        <p>区域文件:</p>
        <p>需要输入绝对路径。例如: /var/named/test.com.zone</p>
        <p></p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      form: {
        domain: "",
        path: ""
      },
      rules: {
        domain: [
          {required: true, message: "请输入域名", target: "blur"}
        ],
        path: [
          {required: true, message: "请输入区域文件路径", target: "blur"}
        ],
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(validate => {
        if (validate) {
          const load = this.$loading({
            lock: false,
            text: '数据提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.$api.req(this.$api.createDomain, this.form).then(res => {
            if (res["code"] === 200) {
              this.$message.success(res["msg"])
            } else {
              this.$message.error(res["msg"])
            }
          })
          load.close()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 5px;
  padding-top: 50px;
  padding-left: 30px;

  .form {
    width: 80%;
    margin-right: 20px;
  }

  .tip {
    height: 150px;
    width: 80%;
    color: #606266;
    font-size: 14px;
  }
}
</style>
