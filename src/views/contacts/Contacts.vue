<template>
  <div class="contacts">
    <a-table :columns="columns" :data-source="data" :pagination="pagination">
    <span slot="action" slot-scope="text, record">
      <a>编辑</a>
      <a-divider type="vertical"/>
      <a>删除</a>
    </span>
    </a-table>
  </div>

</template>

<script>

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '所属分组',
    key: 'group_name',
    dataIndex: 'group_name'
  },
  {
    title: '创建时间',
    key: 'created_at',
    dataIndex: 'created_at'
  },
  {
    title: '更新时间',
    key: 'updated_at',
    dataIndex: 'updated_at'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  }
];

const data = [];

export default {
  name: 'Contacts',
  components: {},
  beforeMount() {
    this.getList();
  },
  data() {
    return {
      data,
      columns,
      current: 1,
      pageSize: 1,
      pagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: 1,
        onShowSizeChange: (current, pageSize) => {
          this.pageSize = pageSize;
          this.pagination.defaultPageSize = pageSize
          this.pagination.defaultCurrent = current
          this.getList()
        },
        showTotal: total => {
          return `共 ${total} 条数据`
        },
        showSizeChanger: true,
        pageSizeOptions: ['1', '2', '30', '40', '50'],
      }
    };
  },
  methods: {
    getList: function () {
      this.request.get('/contactor/', {
        page: this.current,
        page_size: this.pageSize
      }, (data => {
        this.data = data.records
         this.pagination.total =  data.count
      }));
    }
  }
}
</script>
<style scoped>

</style>
