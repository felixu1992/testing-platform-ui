<template>
  <div class="files test-platform-frame-margin" v-if="isRouteOfFileGroup">
    <div>
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span=12>
            <a-form-item :label="`分组名称: `">
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
                  placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12" :style="{ textAlign: 'left' }">
            <a-button type="primary" html-type="submit">
              搜索
            </a-button>
          </a-col>
        </a-row>

        <div>
          <a-button type="primary" @click="showAddModal">
            +添加新分组名
          </a-button>
          <a-modal v-model:visible="addView" title="添加文件分组">
            <template #footer>
              <a-button key="submit" type="primary" @click="addHandleOk()">
                提交
              </a-button>
            </template>
            <a-input style="width: 60%" v-model:value="addGroupName"
                     v-decorator="[
          'groupName',
          { rules: [{ required: true, message: '分组名称不可为空！' }] },
        ]"
                     placeholder="请输入分组名称"
            >
            </a-input>
          </a-modal>
        </div>
      </a-form>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination='pagination'>
      <span slot="action" slot-scope="text, record">
        <span>
          <a-button size='small' type="link" @click="showEditModal(record)">
          编辑
          </a-button>
          <a-modal v-model:visible="editView" title="文件分组名称修改" @ok="editViewSubmit(editItem.id)">
            <p>id:      {{ editItem.id }}<p>
            <b>修改当前分组名: </b>
            <a-input style="width: 60%" v-model:value="editGroupName"
            ></a-input>
            <p>创建时间：{{ editItem.created_at }}<p>
            <p>修改时间：{{ editItem.updated_at }}</p>
          </a-modal>
        </span>
        <a-popconfirm title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="deleteFilesGroup(record.id)"
        >
          <a-button size='small' type="link">
            删除
          </a-button>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
  <div v-else>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'FilesGroup',
  components: {},
  methods: {
    getListPage: function (current, pageSize, name) {
      let params = {
        page: current,
        page_size: pageSize
      }
      if (name) {
        params.name = name
      }
      this.request.get('/file/group/', params, (data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      }));
    },
    //添加分组的页脚模态窗
    showAddModal() {
      this.addView = true;
    },
    //添加成功
    addHandleOk() {
      this.request.post('/file/group/', {name: this.addGroupName}, data => {
        if (200 !== data.code) {
          this.$notification.info({
            message: '操作提示',
            description: '添加成功',
            duration: 2,
          });
          this.addView = false;
          this.addGroupName = '';
          this.listFilePage(this.current, this.pageSize)
        }
      });
    },
    // 编辑模态窗
    showEditModal(record) {
      this.editItem = record;
      this.editGroupName = record.name
      this.editView = true;
    },
    editViewSubmit(id) {
      this.request.put('/file/group/' + id + '/', {name: this.editGroupName, id: id}, data => {
        if (200 !== data.code) {
          this.$notification.info({
            message: '操作提示',
            description: '修改成功',
            duration: 2,
          });
          this.editView = false;
          this.listFilePage(this.current, this.pageSize)
        }
      })
    },
    //删除功能
    deleteFilesGroup(id) {
      this.request.delete('/file/group/' + id + '/', {}, data => {
            this.$notification.info({
              message: '操作提示',
              description: '删除成功',
              duration: 2
            });
            this.listFilePage(this.current, this.pageSize);
          }
      )
    },
    listFilePage(current, pageSize) {
      this.request.get('/file/group/', {current: current, pageSize: pageSize}, data => {
        let records = data.records;
        this.total = data.total;
        for (let i = 0; i < records.length; i++) {
          this.data = records;
        }
      });
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        this.name = values['name'];
        this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.name);
      });
    },
  },
  computed: {
    isRouteOfFileGroup() {
      return this.$store.state.currentRoute == '/files-group'
    },
  },
  data() {
    const data = [];
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '文件分组',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at'
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        key: 'update_at'
      },
      {
        title: '操作',
        key: 'action',
        scopedSlots: {customRender: 'action'},
      }
    ];
    const editItem = [];
    return {
      data,
      columns,
      name: '',
      expand: false,
      form: this.$form.createForm(this, {name: 'advanced_search'}),
      addView: false,
      editView: false,
      editItem,
      total: 0,
      addGroupName: '',
      editGroupName: '',
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

  beforeMount() {
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize);
  }

}
</script>
<style scoped>
@import '../../assets/css/common.css';

.ant-advanced-search-form {
  padding: 18px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
</style>

