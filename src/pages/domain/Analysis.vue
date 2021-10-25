<template>
  <el-row class="container">
    <el-col class="search">
      <el-form :inline="true" size="small" :model="form">
        <el-form-item>
          <el-button class="el-icon-plus" @click="openAddAnalysis" plain> 添加</el-button>
        </el-form-item>
        <el-form-item prop="name">
          <el-input clearable placeholder="请输入解析名称" suffix-icon="el-icon-search" v-model="form.name"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" class="el-icon-search" plain></el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col class="content-table">
      <el-col class="baseTable">
        <el-table
            :v-loading="true"
            :data="data"
            size="small" class="dataTable">
          <el-table-column v-for="column in columns" :key="column.prop"
                           :prop="column.prop"
                           :label="column.label"
                           :width="column.width"
                           :formatter="column.formatter"
                           :show-overflow-tooltip="column.tooltip" align="center">
            <template slot-scope="scope">
              <el-switch v-if="column.prop === 'is_active'" v-model="scope.row.is_active" active-color="#13ce66"
                         inactive-color="#ff4949" @change="isActive($event, scope.row)"></el-switch>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="openEditAnalysis(scope.row)" plain>编辑</el-button>
              <el-button size="mini" type="text" @click="deleteAnalysis(scope.row)" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background class="pagination"
            layout="prev, pager, next"
            :total="pager.total" v-show="pager.total !== 0" :page-size="pager.size" :current-page.sync="pager.page"
            @current-change="resolveList">
        </el-pagination>
      </el-col>
    </el-col>
    <el-col>
      <el-dialog :title="dialog.type === 'add' ? '添加解析': '编辑解析'" :visible.sync="dialog.showDialog" width="580px"
                 @closed="resetForm">
        <el-form ref="form" :model="analysisForm" :inline="true" size="small" label-position="right" label-width="80px"
                 :rules="rules">
          <el-form-item label="域名名称" prop="name">
            <el-input v-model="analysisForm.name" placeholder="域名名称" :disabled="dialog.type === 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="域名类型" prop="type">
            <el-select v-model="analysisForm.type" placeholder="域名类型" @change="selectChange" style="width: 177px"
                       :disabled="dialog.type === 'edit'">
              <el-option v-for="item in dialog.typeOptions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="TTL值" prop="ttl">
            <el-input v-model.number="analysisForm.ttl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="MX值" prop="mx">
            <el-input v-model.number="analysisForm.mx" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="解析地址" prop="address">
            <el-input v-model="analysisForm.address" autocomplete="off" style="width: 445px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog" size="small" plain>取 消</el-button>
          <el-button type="primary" @click="submit" size="small" plain>确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Analysis",
  props: ["domain"],
  data() {
    let checkValue = (rule, value, callback) => {
      const reg = "^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^::([\\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:):([\\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){2}:([\\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){3}:([\\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$|^:((:[\\da-fA-F]{1,4}){1,6}|:)$|^[\\da-fA-F]{1,4}:((:[\\da-fA-F]{1,4}){1,5}|:)$|^([\\da-fA-F]{1,4}:){2}((:[\\da-fA-F]{1,4}){1,4}|:)$|^([\\da-fA-F]{1,4}:){3}((:[\\da-fA-F]{1,4}){1,3}|:)$|^([\\da-fA-F]{1,4}:){4}((:[\\da-fA-F]{1,4}){1,2}|:)$|^([\\da-fA-F]{1,4}:){5}:([\\da-fA-F]{1,4})?$|^([\\da-fA-F]{1,4}:){6}:$\n"
      if (rule.field === "ttl" && value === 0) {
        callback(new Error('TTL值不能为空'))
      } else if (rule.field === "mx" && value === 0 && this.analysisForm.type === "MX") {
        callback(new Error('MX值不能为空'))
      } else if (rule.field === "address" && (this.analysisForm.type === "A" || this.analysisForm.type === "AAAA") && !new RegExp(reg).test(value)) {
        callback(new Error('请输入正确的解析地址'))
      } else {
        callback()
      }

    }

    return {
      dialog: {
        type: "add",
        showDialog: false,
        typeOptions: ["A", "MX", "CNAME", "AAAA", "TEXT"]
      },
      rules: {
        name: [{required: true, message: "请输入解析名称"}],
        address: [{required: true, message: "请输入解析地址"}, {
          validator: checkValue,
          trigger: 'blur'
        }],
        ttl: [{required: true, message: 'TTL不能为空'}, {type: 'number', message: 'TTL必须为数字值'}, {
          validator: checkValue,
          trigger: 'blur'
        }],
        mx: [{required: true, message: 'MX不能为空'}, {type: 'number', message: 'MX必须为数字值'}, {
          validator: checkValue,
          trigger: 'blur'
        }]
      },
      analysisForm: {
        name: "",
        ttl: 600,
        mx: 0,
        address: "",
        type: "A",
      },
      form: {
        "name": ""
      },
      pager: {
        total: 0,
        size: 10,
        page: 1
      },
      data: [],
      columns: [
        {
          prop: "name",
          label: "名称",
          tooltip: true,
        },
        {
          prop: "type",
          label: "记录类型",
          width: "70px"
        },
        {
          prop: "mx",
          label: "MX",
          width: "50px"
        },
        {
          prop: "ttl",
          label: "TTL",
          width: "60px"
        },
        {
          prop: "address",
          label: "地址",
          width: "165px"
        },
        {
          prop: "is_active",
          label: "状态",
          width: "50px"
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
    resetForm() {
      this.$refs.form.resetFields()
    },
    search() {
      this.pager.page = 1
      this.resolveList()
    },
    selectChange(value) {
      if (value === "MX") {
        this.analysisForm.name = "@"
        this.analysisForm.mx = 50
      }
    },
    resolveList() {
      let {size, page} = this.pager
      let {name} = this.form
      this.$api.req(this.$api.resolveList, {size, page, name, domain: this.domain}).then(res => {
        if (res["code"] === 200) {
          const {page_num, data} = res.data
          this.pager.total = page_num.count || 0
          this.data = data || []
        }
      })
    },
    isActive(status, row) {
      this.$api.req(this.$api.isActive, {domain: this.domain, resolve_id: row.id, is_active: status}).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    closeDialog() {
      this.dialog.showDialog = false
    },
    openAddAnalysis() {
      this.dialog.type = "add"
      this.dialog.showDialog = true
    },
    openEditAnalysis(row) {
      this.analysisForm = {...row}
      this.dialog.type = "edit"
      this.dialog.showDialog = true
    },
    analysis(action, data) {
      const load = this.$loading({
        lock: false,
        text: '数据提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$api.req(action, data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.closeDialog()
          this.resolveList()
        } else {
          this.$message.error(res.msg)
        }
      })
      load.close()
    },
    submit() {
      this.$refs.form.validate(validate => {
        if (!validate) {
          return false
        }
        const {name, id, mx, ttl, address, type} = this.analysisForm
        if (this.dialog.type === "add") {
          this.analysis(this.$api.createResolve, {name, mx, ttl, address, type, resolve_id: id, domain: this.domain})
        } else if (this.dialog.type === "edit") {
          this.analysis(this.$api.editResolve, {mx, ttl, address, resolve_id: id, domain: this.domain})
        }
      })
    },
    deleteAnalysis(row) {
      this.$api.req(this.$api.deleteResolve, {domain: this.domain, resolve_id: row.id}).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.resolveList()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  mounted() {
    this.resolveList()
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

      .pagination {
        margin-top: 20px;
        background-color: #FFFFFF;
      }
    }
  }
}
</style>
