<template>
  <div>
    <div class="project-search-div">
      <a-form class="project-search-form" :form="form" @submit="handleSearch">
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
                  placeholder="联系人名称"
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
          <a-button class="add-button" type="primary" @click="() => this.$router.push('/project/add-project')">
            新增
          </a-button>
          <a-button class="batch-delete-button" :style="{ marginLeft: '8px' }" @click="() => console.info('批量删除')">
            批量删除
          </a-button>
        </a-row>
      </a-form>
    </div>
    <div>
      <a-table :columns="columns" :data-source="data" :pagination="pagination">
        <span slot="notify" slot-scope="text, record">
          {{record.notify ? '是' : '否'}}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size='small' type="link" @click="updateproject(record.id)">
          查 看
          </a-button>
          <a-divider type="vertical"/>
          <a-button size='small' type="link" @click="updateproject(record.id)">
          编 辑
          </a-button>
          <a-divider type="vertical"/>
          <a-popconfirm title="确认删除?"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="deleteproject(record.id)"
                        @cancel="cancelDelete"
          >
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

import api from '@/plugins/api'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '请求地址',
    dataIndex: 'host',
    key: 'host',
  },
  {
    title: '是否通知',
    key: 'notify',
    scopedSlots: { customRender: 'notify' }
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
    scopedSlots: { customRender: 'action'},
  }
];

const data = [];

export default {
  components: {},
  beforeMount() {
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize);
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'search-form'});
  },
  data() {
    return {
      data,
      columns,
      name: '',
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
        page: current,
        page_size: pageSize
      }
      if (name) {
        params.name = name
      }
      if (phone) {
        params.phone = phone
      }
      if (email) {
        params.email = email
      }
      api.listProject(params, (data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      }));
    },
    showConfirmDelete(rowRecord) {

    },
    updateproject(id) {
      this.$router.push({
        path: '/project/update-project',
        query: {
          id: id
        }
      });
    },
    deleteproject(id) {
      this.request.delete('/projector/' + projectorId + "/", {
        id: id
      }, data => {
        this.$notification.info({
          message: '操作提示',
          description: '删除成功',
          duration: 2
        });
        this.getListPage(this.pagination.current, this.pagination.pageSize, this.name, this.phone, this.email);
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
          this.name = values['name'];
          this.phone = values['phone'];
          this.email = values['email'];
          this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.name, this.phone, this.email);
        }
      });
    },

    handleReset() {
      this.form.resetFields();
      this.name = '';
      this.phone = '';
      this.email = '';
      this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.name, this.phone, this.email)
    },
  },
}
</script>
<style scoped>
@import '../../../assets/css/common.css';
@import "list.css";
</style>
