<template>
  <div>
    <a-modal :visible="confirmModal" title="请确认要删除项目的名称" @ok="confirmDel" @cancel="confirmCancel">
      <a-input placeholder="请输入项目名称" v-model="confirmName"/>
    </a-modal>
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
<!--          <a-button class="batch-delete-button" :style="{ marginLeft: '8px' }" @click="() => console.info('批量删除')">-->
<!--            批量删除-->
<!--          </a-button>-->
        </a-row>
      </a-form>
    </div>
    <div class="project-list-tab">
      <a-table rowKey="id" :columns="columns" :data-source="data" :pagination="pagination">
        <span slot="host" slot-scope="text, record">
          <a-tooltip v-if="text && text.length > 25" placement="topLeft" :title="text">
            {{ text.substr(0, 10) + '...' + text.substr(text.length - 10, text.length) }}
          </a-tooltip>
          <span v-else>
            {{ text ? text : '-' }}
          </span>
        </span>
        <span slot="headers" slot-scope="text, record">
          <a-popover class="project-list-headers-popover" v-if="text" placement="topLeft">
            <template slot="content">
              <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code" :value="text" />
            </template>
            <a-button size="small" type="link">查看</a-button>
          </a-popover>
          <span v-else>
            -
          </span>
        </span>
        <span slot="notify" slot-scope="text, record">
          <a-switch checked-children="是" un-checked-children="否" :checked="record.notify"  @change="(checked, event) => changeNotify(checked, event, record)" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size='small' type="link" @click="getCases(record.id)">
          用 例
          </a-button>
<!--          <a-divider type="vertical"/>-->
<!--          <a-button size='small' type="link" @click="getProject(record.id)">-->
<!--          查 看-->
<!--          </a-button>-->
          <a-divider type="vertical"/>
          <a-button size='small' type="link" @click="updateProject(record.id)">
          编 辑
          </a-button>
          <a-divider type="vertical"/>
          <a-dropdown placement="bottomCenter">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a-popconfirm title="确认删除?"
                                ok-text="是"
                                cancel-text="否"
                                @confirm="showConfirmDelete(record)"
                                @cancel="cancelDelete"
                  >
                    <a-button size='small' type="link">
                    删 除
                    </a-button>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item>
                  <a-button size="small" type="link" @click="executeCase(record.id)">执行</a-button>
                </a-menu-item>
                <a-menu-item>
                  <a-button size="small" type="link">复制</a-button>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
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
    align: 'center'
  },
  {
    title: '请求地址',
    dataIndex: 'host',
    key: 'host',
    scopedSlots: { customRender: 'host'},
    align: 'center'
  },
  {
    title: '请求头',
    dataIndex: 'headers',
    key: 'headers',
    scopedSlots: { customRender: 'headers'},
    align: 'center'
  },
  {
    title: '通知',
    key: 'notify',
    scopedSlots: { customRender: 'notify' },
    align: 'center'
  },
  {
    title: '分组',
    key: 'groupName',
    dataIndex: 'groupName',
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
    scopedSlots: { customRender: 'action'},
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
  },
  data() {
    return {
      data,
      columns,
      name: '',
      email: '',
      phone: '',
      confirmName: '',
      confirmModal: false,
      waitingDel: {},
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
    changeNotify: function (checked, event, record) {
      record.notify = checked;
      api.updateProject(record.id, record, data => data);
    },
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
      this.confirmModal = true;
      this.waitingDel = rowRecord;
    },
    confirmDel() {
      if (this.confirmName === this.waitingDel.name) {
        this.deleteProject(this.waitingDel.id)
        this.confirmCancel()
      } else {
        api.notification(this.$notification, '操作提示', '名称校验失败已放弃删除', 'info')
      }
    },
    confirmCancel() {
      this.waitingDel = {};
      this.confirmName = '';
      this.confirmModal = false;
    },
    getCases(id) {
      this.$router.push({
        path: '/project/case',
        query: {
          project: id
        }
      });
    },
    getProject(id) {
      this.$router.push({
        path: '/project/detail',
        query: {
          id: id
        }
      });
    },
    updateProject(id) {
      this.$router.push({
        path: '/project/update-project',
        query: {
          id: id
        }
      });
    },
    deleteProject(id) {
      api.deleteProject(id, { id: id }, data => {
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
@import "project-list.css";
</style>
