<template>
  <div>
    <div class="record-search-div">
      <a-form class="record-search-form" :form="form" @submit="handleSearch">
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
                  placeholder="项目名称"
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
<!--&lt;!&ndash;          <a-button class="add-button" type="primary" @click="showModal(false)">&ndash;&gt;-->
<!--&lt;!&ndash;            新增&ndash;&gt;-->
<!--&lt;!&ndash;          </a-button>&ndash;&gt;-->
<!--&lt;!&ndash;          <a-button class="batch-delete-button" :style="{ marginLeft: '8px' }" @click="() => console.info('批量删除')">&ndash;&gt;-->
<!--&lt;!&ndash;            批量删除&ndash;&gt;-->
<!--&lt;!&ndash;          </a-button>&ndash;&gt;-->
<!--        </a-row>-->
      </a-form>
    </div>
    <div>
      <a-table :columns="columns" :data-source="data" :pagination="pagination">
      <span slot="action" slot-scope="text, record">
        <a-button size='small' type="link" @click="toReport(record.id)">
        查看报告
        </a-button>
        <a-divider type="vertical"/>
        <a-popconfirm title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="deleteRecord(record.id)"
                      @cancel="cancelDelete"
        >
        <a-button size='small' type="link">
          删 除
        </a-button>
      </a-popconfirm>
      </span>
      </a-table>
    </div>
  </div>
</template>

<script>

import api from "@/plugins/api";

const columns = [
  {
    title: '项目名称',
    dataIndex: 'project_name',
    key: 'project_name',
    align: 'center'
  },
  {
    title: '项目分组',
    dataIndex: 'group_name',
    key: 'group_name',
    align: 'center'
  },
  {
    title: '通过数',
    dataIndex: 'passed',
    key: 'passed',
    align: 'center'
  },
  {
    title: '失败数',
    dataIndex: 'failed',
    key: 'failed',
    align: 'center'
  },
  {
    title: '忽略数',
    dataIndex: 'ignored',
    key: 'ignored',
    align: 'center'
  },
  {
    title: '接口总数',
    dataIndex: 'total',
    key: 'total',
    align: 'center'
  },
  {
    title: '执行时间',
    key: 'created_at',
    dataIndex: 'created_at',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: 'center'
  }
];

const data = [];

export default {
  beforeMount() {
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize);
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'search-form'});
    this.editForm = this.$form.createForm(this, {name: 'edit-form'});
  },
  data() {
    return {
      data,
      columns,
      id: '',
      newName: '',
      name: '',
      title: '',
      visible: false,
      pagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: 10,
        current: 1,
        onShowSizeChange: (current, pageSize) => {
          this.pageSize = pageSize;
          this.getListPage(current, pageSize, this.name);
        },
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        onChange: (current, pageSize) => {
          this.getListPage(current, pageSize, this.name)
        }
      }
    };
  },
  methods: {
    toReport: function (id) {
      this.$router.push({
        path: '/record/report',
        query: {
          recordId: id
        }
      });
    },
    getListPage: function (current, pageSize, name) {
      let params = {
        page: current,
        page_size: pageSize
      }
      if (name) {
        params.name = name
      }
      api.listRecord(params, data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      })
    },
    deleteRecord(id) {
      api.deleteRecord(id, { id: id }, data => {
        api.notification(this.$notification, '操作提示', '删除成功', 'info')
        this.getListPage(this.pagination.current, this.pagination.pageSize, this.name);
      });
    },
    cancelDelete() {
      api.notification(this.$notification, '操作提示', '已取消操作', 'info')
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.name = values.name;
          this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.name);
        }
      });
    },
    handleReset() {
      this.form.resetFields();
      this.name = '';
      this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.name)
    },
  },
  computed: {}
}
</script>
<style scoped>
@import '../../../assets/css/common.css';
@import "record-list.css";
</style>

