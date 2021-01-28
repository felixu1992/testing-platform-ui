<template>
  <div>
    <div class="case-search-div">
      <a-form class="case-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span=4>
            <a-form-item :label="`名 称: `">
              <a-input
                  v-decorator="[
                  `name`,
                  {
                    rules: [
                      {
                        required: false
                      },
                    ],
                  },
                ]"
                  placeholder="用例名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12" :style="{ textAlign: 'right' }">
            <a-button class="search-button" type="primary" html-type="submit">
              搜索
            </a-button>
            <a-button class="reset-button" :style="{ marginLeft: '8px' }" @click="handleReset">
              重置
            </a-button>
          </a-col>
        </a-row>
<!--        <a-row>-->
<!--          <a-button class="add-button" type="primary" @click="createCase">-->
<!--            新增-->
<!--          </a-button>-->
<!--&lt;!&ndash;          <a-button class="batch-delete-button" :style="{ marginLeft: '8px' }" @click="() => console.info('批量删除')">&ndash;&gt;-->
<!--&lt;!&ndash;            批量删除&ndash;&gt;-->
<!--&lt;!&ndash;          </a-button>&ndash;&gt;-->
<!--          <a-divider type="vertical"/>-->
<!--          <a-button class="execute-project-button" @click="executeProject">-->
<!--            执行-->
<!--          </a-button>-->
<!--        </a-row>-->
      </a-form>
    </div>
    <div>
      <a-table :columns="columns" :data-source="data" :pagination="pagination" @change="changeTable">
        <span slot="run" slot-scope="text, record">
          <a-switch checked-children="是" un-checked-children="否" :checked="record.run" disabled/>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size='small' type="link" @click="updateCase(record.id)">
          查 看
          </a-button>
        </span>
        <span slot="name" slot-scope="text, record">
          <a-tooltip v-if="text.length > 10" placement="topLeft">
            <template #title>
              {{ text }}
            </template>
            {{
              text.substr(0, 10) + '...'
            }}
          </a-tooltip>
          <span v-else>
            {{ text }}
          </span>
        </span>
        <span slot="remark" slot-scope="text, record">
          <a-tooltip v-if="text && text.length > 15" placement="topLeft">
            <template #title>
              {{ text }}
            </template>
            {{
              text.substr(0, 15) + '...'
            }}
          </a-tooltip>
          <span v-else>
            {{ text ? text : '-' }}
          </span>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-icon type="check-circle" style="font-size: 20px; color: #52c41a" v-if="record.status === 'PASSED'"/>
          <a-icon type="close-circle" style="font-size: 20px; color: #ff0000" v-if="record.status === 'FAILED'"/>
          <a-icon type="pause-circle" style="font-size: 20px; color: #7f7f7f" v-if="record.status === 'IGNORED'"/>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/api'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: {customRender: 'name'},
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    scopedSlots: {customRender: 'remark'},
    align: 'center'
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    key: 'method',
    align: 'center'
  },
  {
    title: '请求地址',
    dataIndex: 'host',
    key: 'host',
    align: 'center'
  },
  {
    title: '请求头',
    dataIndex: 'headers',
    key: 'headers',
    align: 'center'
  },
  {
    title: '请求路径',
    dataIndex: 'path',
    key: 'path',
    align: 'center'
  },
  {
    title: '是否执行',
    key: 'run',
    scopedSlots: { customRender: 'run' },
    align: 'center'
  },
  {
    title: '所属项目',
    key: 'project_name',
    dataIndex: 'project_name',
    align: 'center'
  },
  {
    title: '执行结果',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    filterMultiple: false,
    filters: [
      { text: '成功', value: 'PASSED' },
      { text: '失败', value: 'FAILED' },
      { text: '忽略', value: 'IGNORED' },
    ],
    align: 'center',

  },
  {
    title: '请求耗时',
    key: 'time_used',
    dataIndex: 'time_used',
    align: 'center',
    customRender: (text, row, index) => `${text}ms`
  },
  {
    title: '创建时间',
    key: 'created_at',
    dataIndex: 'created_at',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action'},
    align: 'center'
  }
];

const data = [];

export default {
  components: {},
  beforeMount() {
    const {
      recordId
    } = this.$route.query
    this.recordId = recordId
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize, this.recordId);
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'search-form'});
  },
  data() {
    return {
      data,
      columns,
      name: '',
      recordId: '',
      projectId: '',
      targetSort: 0,
      sourceSort: 0,
      pagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: 10,
        current: 1,
        onShowSizeChange: (current, pageSize) => {
          this.pageSize = pageSize;
          this.getListPage(current, pageSize, this.recordId, this.name);
        },
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
      }
    };
  },
  methods: {
    changeTable(pagination, filters) {
      console.log(filters)
      this.getListPage(pagination.current, pagination.pageSize, this.recordId, this.name, filters.status ? filters.status[0]: undefined)
    },
    executeCase: function (id) {
      api.executeCase({ id: id }, data => {
        console.info(data)
      })
    },
    getListPage: function (current, pageSize, recordId, name, status) {
      let params = {
        page: current,
        page_size: pageSize,
        record_id: recordId,
      }
      if (name) {
        params.name = name
      }
      if (status) {
        params.status = status
      }
      api.listReport(params, (data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      }));
    },
    cancelDelete() {
      api.notification(this.$notification, '操作提示', '已取消操作', 'info')
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.name = values.name;
          this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.recordId, this.name);
        }
      });
    },
    handleReset() {
      this.form.resetFields();
      this.name = '';
      this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.recordId, this.name)
    },
  },
}
</script>
<style scoped>
@import '../../../../assets/css/common.css';
@import "report-list.css";
</style>
