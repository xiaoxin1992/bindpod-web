<template>
  <el-row class="container">
    <el-col class="search">
      <el-form :inline="true" size="small" :model="form">
        <el-form-item label="域名" prop="domain">
          <el-input clearable placeholder="请输入域名" suffix-icon="el-icon-search" v-model="form.domain"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" class="el-icon-search" plain></el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col class="content-table">
      <el-col class="baseTable">
        <el-table
            :v-loading="true"
            :data="domainData"
            size="small" class="dataTable" tooltip-effect="light">
          <el-table-column v-for="column in columns" :key="column.prop"
                           :prop="column.prop"
                           :label="column.label"
                           :formatter="column.formatter"
                           :show-overflow-tooltip="column.tooltip"
                           :width="column.width" align="center">
            <template slot-scope="scope">
              <span class="hidden-text"
                    v-if="column.prop === 'users'">
                {{ scope.row[column.prop] | getUser }}
              </span>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="userManage(scope.row)" plain>用户授权</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination"
                       background
                       layout="prev, pager, next"
                       :total="pager.total" v-show="pager.total !== 0" :page-size="pager.size"
                       :current-page.sync="pager.page"
                       @current-change="getDomainList" plain>
        </el-pagination>
      </el-col>
    </el-col>
    <el-dialog :visible.sync="userDialog.isShow" class="userDialog" width="650px" @closed="clearDialog">
      <div slot="title">
        用户管理
        <el-divider></el-divider>
      </div>
      <div slot="default">
        <el-card class="box-card" shadow="never" body-style="padding: 5px">
          <el-tag v-for="(tag, index) in userDialog.tags" :key="index" closable style="margin: 10px"
                  @close="removeUser(tag)">
            {{ tag.username }} ({{ tag.display_name }})
          </el-tag>
          <el-autocomplete
              v-if="userDialog.inputVisible"
              ref="userAdd"
              class="input-new-tag"
              v-model="userDialog.inputValue"
              size="small"
              placeholder="请输入用户名"
              :fetch-suggestions="queryUser"
              @select="selectUser"
          >
            <template slot-scope="{ item }">
              {{item.username}}({{item.display_name}})
            </template>
          </el-autocomplete>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加用户</el-button>
        </el-card>
      </div>
      <div slot="footer">
        <el-button @click="userDialog.isShow = false" size="small" plain>取 消</el-button>
        <el-button type="primary" @click="submit" size="small" plain>确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: "DomainPermission",
  data() {
    return {
      userDialog: {
        domain: "",
        tags: [],
        isShow: false,
        inputVisible: false,
        inputValue: "",
      },
      form: {
        "domain": ""
      },
      pager: {
        total: 0,
        size: 10,
        page: 1
      },
      domainData: [],
      columns: [
        {
          prop: "domain",
          label: "域名",
          tooltip: true
        },
        {
          prop: "users",
          label: "用户"
        }
      ]
    }
  },
  methods: {
    submit() {
      const load = this.$loading({
        lock: false,
        text: '数据提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const {domain, tags} = this.userDialog
      this.$api.req(this.$api.domainAuthorize, {
        domain, users: tags.map(item => {
          return item.username
        })
      }).then(res => {
        const {code, msg} = res
        if (code === 200) {
          this.$message.success(msg)
          this.getDomainList()
        } else {
          this.$message.error(msg)
        }
      })
      load.close()
      this.userDialog.isShow = false
    },
    search() {
      this.pager.page = 1
      this.getDomainList()
    },
    userManage(row) {
      const users = row["users"] || []
      this.userDialog.tags = [...users.map((item) => {
        const {username, display_name} = item
        return {username, display_name}
      })]
      this.userDialog.domain = row.domain
      this.userDialog.isShow = true
    },
    getDomainList() {
      let {size, page} = this.pager
      let {domain} = this.form
      this.$api.req(this.$api.userDomain, {size, page, domain}).then(res => {
        if (res["code"] === 200) {
          const {page_num, data} = res.data
          this.pager.total = page_num.count || 0
          this.domainData = data || []
        }
      })
    },
    clearDialog() {
      this.userDialog.domain = ""
      this.userDialog.tags = []
      this.userDialog.inputVisible = false
      this.userDialog.inputValue = '';
    },
    removeUser(tag) {
      this.userDialog.tags.splice(this.userDialog.tags.findIndex(value => value === tag), 1)
    },
    showInput() {
      this.userDialog.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.userAdd.$refs.input.focus();
      });
    },
    selectUser(item) {
      if (this.userDialog.tags.filter(i => i.username === item.username).length !== 0) {
        this.$message.warning(`${item.username} 用户已授权`)
      } else {
        const {username, display_name} = item
        this.userDialog.tags.push({username, display_name: display_name === "" ? username: display_name})
      }
      this.userDialog.inputVisible = false
      this.userDialog.inputValue = '';
    },
    queryUser(queryString, cb) {
      let results = []
      this.$api.req(this.$api.userList, {size: 20, page: 1, username: queryString}).then(res => {
        const {code, data} = res
        if (code === 200) {
          if (data["data"] === undefined || data["data"].length === 0) {
            this.$message.warning("用户不存在")
          } else {
            data["data"].filter(item => item.username).forEach(item => {
              results.push({username:item.username, display_name: item.first_name})
            })
            cb(results)
          }
        }
      })
    },
  },
  filters: {
    getUser: function (value) {
      const data = value.map((item) => {
        return item.display_name
      })
      return data.join(",")
    }
  },
  mounted() {
    this.getDomainList()
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

  .userDialog {
    ::v-deep .el-dialog__header {
      padding: 20px 20px 0;
    }

    ::v-deep .el-dialog__body {
      padding: 0 20px;
    }

    .input-new-tag {
      width: 150px;
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }

  }

  .content-table {
    padding-top: 20px;
    height: calc(100% - 90px);
    position: relative;
    background-color: #FFFFFF;
    border-radius: 5px;
    text-align: center;

    .baseTable {
      padding: 0 20px;
      width: 100%;

      .dataTable {
        .hidden-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .pagination {
        margin-top: 20px;
        background-color: #FFFFFF;
      }
    }
  }
}
</style>
