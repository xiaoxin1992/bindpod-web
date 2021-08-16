<template>
  <el-row class="container">
    <el-col class="search">
      <el-col>
        <el-form :inline="true" size="small" :model="form">
          <el-form-item>
            <el-button class="el-icon-plus" @click="addUserShow" plain> 添加</el-button>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="用户名" clearable suffix-icon="el-icon-search" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="el-icon-search" @click="search" plain></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
    <el-col class="content-table">
      <el-col class="base-table">
        <el-table
            :v-loading="true"
            :data="dataList"
            size="small"
            class="dataTable" tooltip-effect="light">
          <el-table-column v-for="column in columns" :key="column.prop"
                           :prop="column.prop"
                           :label="column.label"
                           :formatter="column.formatter"
                           :width="column.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag
                  v-if="column.prop === 'is_active' || column.prop === 'is_staff'" effect="plain"
                  :type="scope.row[column.prop] === true ? 'success' : 'danger'"
                  disable-transitions size="small">
                <span v-if="column.prop === 'is_active'">{{ scope.row[column.prop] ? '激活' : '禁止' }}</span>
                <span v-else>{{ scope.row[column.prop] ? '是' : '否' }}</span>
              </el-tag>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center" width="150px">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="editUserShow(scope.row)" plain>编辑</el-button>
              <el-button size="mini" type="text" @click="deleteUser(scope.row)" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background class="pagination"
            layout="prev, pager, next"
            :total="pager.total" v-show="pager.total !== 0" :page-size="pager.size" :current-page.sync="pager.page"
            @current-change="getUserList">
        </el-pagination>
      </el-col>
    </el-col>
    <el-dialog
        :title="userForm.action === 'edit' ? '修改用户信息':'添加用户'"
        :visible.sync="dialog.dialogUser"
        width="700px" @closed="$refs.userForm.resetFields()">
      <el-form :inline="true" size="small" status-icon ref="userForm" :model="userForm" :rules="rules">
        <el-form-item label="用户名" label-width="70px" prop="username">
          <el-input placeholder="请输入用户名" suffix-icon="el-icon-user" :disabled="userForm.userDisabled"
                    class="userInputDialog" v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="70px" prop="first_name">
          <el-input placeholder="请输入姓名" suffix-icon="el-icon-s-custom" class="userInputDialog"
                    v-model="userForm.first_name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="70px" prop="email">
          <el-input placeholder="请输入邮箱" v-model="userForm.email" class="userInputDialog"
                    suffix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" prop="password">
          <el-input placeholder="请输入密码" class="userInputDialog" show-password v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="70px" prop="is_active">
          <el-checkbox border label="激活账号" style="width: 250px; height: 33px"
                       v-model="userForm.is_active"></el-checkbox>
        </el-form-item>
        <el-form-item label="管理员" label-width="70px" prop="is_superuser">
          <el-checkbox border label="超级管理员" style="width: 250px; height: 33px"
                       v-model="userForm.is_staff"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.dialogUser=false" size="small" plain>取 消</el-button>
          <el-button type="primary" @click="submit" size="small" plain>确 定</el-button>
        </span>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: "List",
  data() {
    const validator = (rule, value, callback) => {
      value = value || ""
      if (rule.field === "password" && value.trim().length === 0 && this.userForm.action === "add") {
        callback(new Error("密码不能为空"))
      } else {
        callback();
      }
    }
    return {
      dialog: {
        dialogUser: false
      },
      form: {
        username: "",
      },
      userForm: {
        username: "",
        userDisabled: false,
        first_name: "",
        email: "",
        password: "",
        is_active: true,
        is_staff: false,
        action: ""
      },
      rules: {
        username: [{required: true, message: "用户不能为空", target: "blur"}],
        first_name: [{required: true, message: "姓名不能为空", target: "blur"}],
        email: [{required: true, message: "邮箱不能为空", target: "blur"}, {
          type: "email",
          message: "请输入正确的邮箱地址",
          trigger: ["blur", "change"]
        }],
        password: [{
          validator: validator,
          trigger: "blur"
        }]
      },
      pager: {
        total: 0,
        size: 10,
        page: 1
      },
      dataList: [],
      columns: [
        {
          prop: "username",
          label: "用户名"
        },
        {
          prop: "first_name",
          label: "姓名"
        },
        {
          prop: "email",
          label: "邮箱"
        },
        {
          prop: "is_active",
          label: "状态",
        },
        {
          prop: "is_staff",
          label: "管理员",
        },
        {
          prop: "create_time",
          label: "创建时间",
          width: "150px"
        }
      ]
    }
  },
  methods: {
    search() {
      this.pager.page = 1
      this.getUserList()
    },
    getUserList() {
      const {size, page} = this.pager
      this.$api.req(this.$api.userList, {size, page, username: this.form.username}).then(res => {
        if (res["code"] === 200) {
          const {page_num, data} = res.data
          this.pager.total = page_num.count || 0
          this.dataList = data || []
        }
      })
    },
    addUserShow() {
      this.userForm.action = "add"
      this.userForm.userDisabled = false
      this.dialog.dialogUser = true
    },
    editUserShow(row) {
      this.userForm = {...row}
      this.userForm.action = "edit"
      this.userForm.userDisabled = true
      this.dialog.dialogUser = true
    },
    submit() {
      this.$refs.userForm.validate(validate => {
        if (validate) {
          let action = ""
          if (this.userForm.action === "add") {
            action = this.$api.createUser
          } else if (this.userForm.action === "edit") {
            action = this.$api.editUser
          }
          if (action.length === 0) {
            return
          }
          const load = this.$loading({
            lock: false,
            text: '数据提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const {username, first_name, email, password, is_active, is_staff} = this.userForm
          this.$api.req(action, {username, first_name, email, password, is_active, is_staff}).then(res => {
            if (res["code"] === 200) {
              this.$message.success(res["msg"])
              this.getUserList()
            } else {
              this.$message.error(res["msg"])
            }
          })
          this.dialog.dialogUser = false
          load.close()
        }
      })
    },
    deleteUser(row) {
      this.$api.req(this.$api.deleteUser, {username: [row.username]}).then(res => {
        if (res["code"] === 200) {
          this.$message.success(res["msg"])
          this.getUserList()
        } else {
          this.$message.error(res["msg"])
        }
      })
    }
  },
  mounted() {
    this.getUserList()
  }
}
</script>

<style scoped lang="scss">
.container {
  .search {
    background-color: #FFFFFF;
    height: 70px;
    padding: 18px 20px 0;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .userInputDialog {
    width: 250px;
  }

  .content-table {
    height: calc(100% - 90px);
    background-color: #FFFFFF;
    padding-top: 20px;
    border-radius: 5px;
    text-align: center;

    .base-table {
      padding: 0 20px;
      width: 100%;

      .pagination {
        margin-top: 20px;
        background-color: #FFFFFF;
      }
    }
  }
}
</style>
