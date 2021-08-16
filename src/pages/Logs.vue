<template>
  <el-row class="container">
    <el-col class="search">
      <el-col>
        <el-form :inline="true" size="small" :model="form">
          <el-form-item label="用户名" prop="username" v-if="this.is_staff">
            <el-input placeholder="用户名" clearable suffix-icon="el-icon-search" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="事件" prop="username">
            <el-select placeholder="请选择" v-model="form.event">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
                v-model="form.time"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="el-icon-search" @click="search"></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
    <el-col class="content-table">
      <el-col class="base-table">
        <el-table
            :data="dataList"
            size="small"
            class="dataTable">
          <el-table-column v-for="column in columns" :key="column.prop"
                           :prop="column.prop"
                           :label="column.label"
                           :formatter="column.formatter"
                           :show-overflow-tooltip="column.tooltip"
                           :width="column.width" align="center">
            <template slot-scope="scope">
              <el-tag
                  v-if="column.prop === 'event'" effect="plain"
                  type="info"
                  disable-transitions size="small">
                {{ scope.row[column.prop] }}
              </el-tag>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background class="pagination"
            layout="prev, pager, next"
            :total="pager.total" v-show="pager.total !== 0" :page-size="pager.size" :current-page.sync="pager.page"
            @current-change="getLogsList">
        </el-pagination>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "Logs",
  computed: {
    ...mapState(["username", "is_staff"])
  },
  data() {
    return {
      form: {
        username: "",
        event: "",
        time: "",
      },
      options: [
        {value: '', label: '全部'},
        {value: 0, label: '登陆'},
        {value: 1, label: '域名'},
        {value: 2, label: '解析'},
        {value: 3, label: '用户'}
      ],
      pager: {
        total: 0,
        size: 10,
        page: 1
      },
      dataList: [],
      columns: [
        {
          prop: "username",
          label: "操作人"
        },
        {
          prop: "create_time",
          label: "时间"
        },
        {
          prop: "event",
          label: "事件"
        },
        {
          prop: "content",
          label: "内容",
          tooltip: true
        },
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  methods: {
    search() {
      this.pager.page = 1
      this.getLogsList()
    },
    setDefaultTime() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      let timeStr = end.getFullYear() + '-' + (end.getMonth() + 1).toString().padStart(2, "0") + '-' + end.getDate().toString().padStart(2, "0")
      let netStr = start.getFullYear() + '-' + (start.getMonth() + 1).toString().padStart(2, "0") + '-' + start.getDate().toString().padStart(2, "0")
      this.form.time = [netStr, timeStr];
    },
    getLogsList() {
      const {size, page} = this.pager
      let {username, event, time} = this.form
      const [start_time, end_time] = time
      if (!this.is_staff) {
        username = this.username
      }
      this.$api.req(this.$api.getLogs, {username, event, start_time, end_time, size, page}).then(res => {
        if (res["code"] === 200) {
          const {page_num, data} = res.data
          this.pager.total = page_num.count || 0
          this.dataList = data || []
        }
      })
    },
  },
  mounted() {
    this.setDefaultTime()
    this.getLogsList()
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
