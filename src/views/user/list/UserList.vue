<template>
  <div>
    <div class="user-search-div">
      <a-form class="user-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span=4>
            <a-form-item :label="`名 称: `">
              <a-input
                  v-decorator="[
                  `username`,
                  {
                    rules: [
                      {
                        required: false
                      },
                    ],
                  },
                ]"
                  placeholder="用户名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span=4>
            <a-form-item :label="`邮 箱: `">
              <a-input
                  v-decorator="[
                  `email`,
                  {
                    rules: [
                      {
                        required: false
                      },
                    ],
                  },
                ]"
                  placeholder="用户邮箱"
              />
            </a-form-item>
          </a-col>
          <a-col :span=4>
            <a-form-item :label="`手 机: `">
              <a-input
                  v-decorator="[
                  `phone`,
                  {
                    rules: [
                      {
                        required: false
                      },
                    ],
                  },
                ]"
                  placeholder="用户手机号"
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
        <a-row>
          <a-button class="add-button" type="primary" @click="() => this.routeTo('/user/add-user')">
            新增
          </a-button>
        </a-row>
      </a-form>
    </div>
    <div>
      <a-table rowKey="id" :columns="columns" :data-source="data" :pagination="pagination">
      <span slot="action" slot-scope="text, record">
        <a-button size='small' type="link" @click="updateUser(record.id)">
        编 辑
        </a-button>
        <a-divider type="vertical"/>
        <a-popconfirm title="确认删除?" ok-text="是" cancel-text="否" @confirm="deleteUser(record.id)" @cancel="cancelDelete">
        <a-button size='small' type="link" @click="showConfirmDelete(record)">
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
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    align: 'center'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    align: 'center'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    align: 'center'
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    dataIndex: 'updatedAt',
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
  name: "UserList",
  components: {},
  beforeMount() {
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize);
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'user-search-form'});
  },
  data() {
    return {
      data,
      columns,
      username: '',
      email: '',
      phone: '',
      pagination: {
        total: 0,
        defaultCurrent: 1,
        defaultPageSize: 10,
        current: 1,
        onShowSizeChange: (current, pageSize) => {
          this.pageSize = pageSize;
          this.getListPage(current, pageSize, this.name, this.phone, this.email);
        },
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        onChange: (current, pageSize) => {
          this.getListPage(current, pageSize, this.name, this.phone, this.email)
        }
      }
    };
  },
  methods: {
    getListPage: function (current, pageSize, name, phone, email) {
      let params = {
        current: current,
        size: pageSize
      }
      if (name) {
        params.username = name
      }
      if (phone) {
        params.phone = phone
      }
      if (email) {
        params.email = email
      }
      api.listUser(params, data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      });
    },
    showConfirmDelete(rowRecord) {
    },
    updateUser(userId) {
      this.$router.push({
        path: '/user/update-user',
        query: {
          id: userId
        }
      });
    },
    deleteUser(userId) {
      api.deleteUser(userId, { id: userId }, data => {
        this.$notification.info({
          message: '操作提示',
          description: '删除成功',
          duration: 2
        });
        this.getListPage(this.pagination.current, this.pagination.pageSize, this.username, this.phone, this.email);
      });
    },
    cancelDelete() {
      this.$notification.open({
        message: '操作提示',
        description: '已取消操作',
        duration: 2
      });
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.username = values['username'];
          this.phone = values['phone'];
          this.email = values['email'];
          this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.username, this.phone, this.email);
        }
      });
    },
    handleReset() {
      this.form.resetFields();
      this.username = '';
      this.phone = '';
      this.email = '';
      this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.username, this.phone, this.email)
    },
  },
  computed: {}
}

</script>

<style scoped>
@import '../../../assets/css/common.css';
@import "user-list.css";
</style>
