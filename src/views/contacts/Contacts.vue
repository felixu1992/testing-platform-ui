<template>
  <div class="contacts" v-if='isRoot'>
    <div>
      <a-button type="primary" @click="() => this.routeTo('/contacts/add')">
        新增
      </a-button>
      <a-input-search placeholder="联系人名称" style="width: 200px; float:right" @search="onSearch"/>
    </div>
    <div>
      <a-table :columns="columns" :data-source="data" :pagination="pagination">
        <span slot="action" slot-scope="text, record">
          <a-button size='small' type="link" @click="() => routeTo('/contacts/update')">
          更新
          </a-button>
          <a-divider type="vertical"/>
          <a-popconfirm title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="deleteContact(record.id)"
                      @cancel="cancelDelete"
          >
          <a-button size='small' type="link" @click="showConfirmDelete(record)">
            删除
          </a-button>
        </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
  <div class="contacts" v-else>
    <router-view/>
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
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize);
  },

  data() {
    return {
      data,
      columns,
      name: '',
      email: '',
      phone: '',
      groupId: '',
      pagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: 10,
        current: 1,
        onShowSizeChange: (current, pageSize) => {
          this.pageSize = pageSize;
          this.getListPage(current, pageSize);
        },
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        onChange: (current, pageSize) => {
          this.getListPage(current, pageSize)
        }
      }
    };
  },
  methods: {
    getListPage: function (current, pageSize, name) {
      let params = {
        page: current,
        page_size: pageSize
      }
      if (name) {
        params.name = name
      }
      this.request.get('/contactor/', params, (data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      }));
    },
    showConfirmDelete(rowRecord) {

    },
    deleteContact(contactorId) {
      this.request.delete('/contactor/' + contactorId + "/", {
        id: contactorId
      }, data => {
        this.$notification.info({
          message: '操作提示',
          description: '删除成功',
          duration: 2
        });
        this.getListPage(this.pagination.current, this.pagination.pageSize);
      });
    },
    cancelDelete() {
      this.$notification.open({
        message: '操作提示',
        description: '已取消操作',
        duration: 2
      });
    },
  },
  computed: {
    isRoot: function () {
      return this.$store.state.currentRoute === "/contacts"
    }
  }
}
</script>
<style scoped>

</style>
