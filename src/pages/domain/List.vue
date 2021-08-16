<template>
  <el-row class="container">
    <el-col class="search">
      <el-form :inline="true" size="small" ref="form" :model="form">
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
                           :width="column.width" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="analysis(scope.row)" plain>解析</el-button>
              <el-button size="mini" type="danger" @click="deleteDomain(scope.row)" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination"
                       background
                       layout="prev, pager, next"
                       :total="pager.total" v-show="pager.total !== 0" :page-size="pager.size"
                       :current-page.sync="pager.page"
                       @current-change="getDomainList">
        </el-pagination>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      form: {
        "domain": ""
      },
      pager: {
        total: 1000,
        size: 10,
        page: 1
      },
      domainData: [],
      columns: [
        {
          prop: "domain",
          label: "域名"
        },
        {
          prop: "path",
          label: "区域文件位置"
        },
        {
          prop: "analysis",
          label: "解析数量"
        },
        {
          prop: "create_time",
          label: "创建时间"
        }
      ]
    }
  },
  methods: {
    search() {
      this.pager.page = 1
      this.getDomainList()
    },
    deleteDomain(row) {
      this.$api.req(this.$api.deleteDomain, {domain: [row.domain]}).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getDomainList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getDomainList() {
      let {size, page} = this.pager
      let {domain} = this.form
      this.$api.req(this.$api.listDomain, {size, page, domain}).then(res => {
        if (res["code"] === 200) {
          const {page_num, data} = res.data
          this.pager.total = page_num.count || 0
          this.domainData = data || []
        }
      })
    },
    analysis(value) {
      this.$router.push({
        name: "analysis",
        params: {
          domain: value.domain
        }
      })
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
