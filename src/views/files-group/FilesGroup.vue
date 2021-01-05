<template>
  <div class="files test-platform-frame-margin" v-if="isRouteOfFileGroup">
    <div>
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span=8>
            <a-form-item :label="`分组名称: `">
              <a-input
                  v-decorator="[
                `fileGroup`,
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
        </a-row>
        <a-row :gutter="24">
          <a-col :span=12>
            <a-form-item :label="`创建时间: `">
              <a-range-picker
                  v-decorator="['create-time-picker']"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
          <a-col :span=10>
            <a-form-item :label="`更新时间: `">
              <a-range-picker
                  v-decorator="['update-time-picker']"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">
              搜索
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              重置
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination='false'>
      <span slot="action" slot-scope="text, record">
        <span><a-button size='small' type="link" @click="showEditModal">
          编辑
        </a-button>
        <a-modal v-model:visible="editView" title="Basic Modal" @ok="showEditModal">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
       </a-modal></span>

        <a-popconfirm title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="deleteFilesGroup(record.id)"
                      @cancel="cancelDeleteFilesGroup"
        >
          <a-button size='small' type="link">
            删除
          </a-button>
        </a-popconfirm>
      </span>
    </a-table>
    <!--    //分页组件-->
    <div class="pagination-bar">
      <a-pagination size="small" :total=total :show-total="total => `Total ${total} items`" show-size-changer
                    show-quick-jumper/>
    </div>
    <!--    //添加组件-->
    <div>
      <a-button type="primary" @click="showAddModal">
        +添加新分组名
      </a-button>
      <a-modal v-model:visible="visible" title="添加文件分组">
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
    //添加分组的页脚模态窗
    showAddModal() {
      this.visible = true;
    },
    addHandleOk() {
      this.request.post('/file/group/', {name: this.addGroupName}, data => {
        if (200 !== data.code) {
          this.$notification.info({
            message: '操作提示',
            description: '添加成功',
            duration: 2,
          });
          this.visible = false;
          this.addGroupName = '';
          this.listFilePage(this.current, this.pageSize)
        }
      });
    },
    //编辑模态窗
    showEditModal() {
      this.editView = true;
    },
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
    cancelDeleteFilesGroup() {
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
    handleReset() {
      this.form.resetFields();
    },
    //form test
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
      });
    },
  },
  computed: {
    isRouteOfFileGroup() {
      return this.$store.state.currentRoute == '/files-group'
    },

    // form test
    count() {
      return this.expand ? 11 : 7;
    },
  },
  showConfirmDelete(record) {
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
    return {
      data,
      columns,
      expand: false,
      form: this.$form.createForm(this, {name: 'advanced_search'}),
      visible: false,
      editView: false,
      total: 0,
      addGroupName: ''
    };
  },

  beforeMount(current, pageSize) {
    this.listFilePage(current, pageSize);
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

.pagination-bar {
  margin-bottom: 24px;
  float: right;
}

</style>

