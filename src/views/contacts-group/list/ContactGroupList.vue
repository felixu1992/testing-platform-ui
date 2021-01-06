<template>
  <div>
    <div class="contact-group-search-div">
      <a-modal :visible="visible" :title="title" @ok="handleOk" @cancel="cancelModal">
        <a-form class="contact-group-edit-form" :form="editForm">
          <a-row>
            <a-col>
              <a-form-item :label="`名 称: `">
                <a-input
                    placeholder="联系人分组名称"
                    style="width: 50%"
                    v-decorator="[
                    `newName`,
                    {
                      rules: [
                        {
                          required: true, message: '分组名称不能为空'
                        },
                      ],
                    },
                ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
      <a-form class="contact-group-search-form" :form="form" @submit="handleSearch">
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
                  placeholder="联系人分组名称"
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
          <a-button class="add-button" type="primary" @click="showModal(false)">
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
      <span slot="action" slot-scope="text, record">
        <a-button size='small' type="link" @click="showModal(true, record)">
        编 辑
        </a-button>
        <a-divider type="vertical"/>
        <a-popconfirm title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="deleteContact(record.id)"
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
    title: '名称',
    dataIndex: 'name',
    key: 'name',
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
    getListPage: function (current, pageSize, name) {
      let params = {
        page: current,
        page_size: pageSize
      }
      if (name) {
        params.name = name
      }
      api.listContactorGroup(params, data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      })
    },
    deleteContact(contactorId) {
      api.deleteContactGroup(contactorId, {
        id: contactorId
      }, data => {
        this.$notification.info({
          message: '操作提示',
          description: '删除成功',
          duration: 2
        });
        this.getListPage(this.pagination.current, this.pagination.pageSize, this.name);
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
    showModal(edit, record) {
      this.resetModal();
      if (edit) {
        this.title = '编辑联系人分组';
        this.id = record.id;
        this.newName = record.name
        this.editForm.setFieldsValue({ newName: this.newName })
      } else {
        this.title = '新增联系人分组';
      }
      this.visible = true;
    },
    handleOk(e) {
      e.preventDefault();
      this.editForm.validateFields((err, values) => {
        if (!err) {
          this.newName = values.newName
          let params = {
            name: this.newName
          };
          let handler = data => this.getListPage(this.pagination.current, this.pagination.pageSize, this.name);
          debugger
          if (this.id) {
            params.id = this.id
            api.updateContactGroup(this.id, params, handler)
          } else {
            api.createContactGroup(params, handler)
          }
          this.resetModal();
          this.visible = false;
        }
      });

    },
    cancelModal() {
      this.resetModal();
      this.visible = false;
    },
    resetModal() {
      this.id = '';
      this.newName = '';
      this.title = '';
      this.editForm.setFieldsValue({ newName: ''})
    }
  },
  computed: {}
}
</script>
<style scoped>
@import '../../../assets/css/common.css';
@import "list.css";
</style>

