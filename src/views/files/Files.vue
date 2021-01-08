<template>
  <div class="files test-platform-frame-margin" v-if="isRouteOfFile">
    <div>
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span=8>
            <a-form-item :label="`文件路径: `">
              <a-input
                  v-decorator="[
                `path`,
                {
                  rules: [{required: false},],
                },
              ]"
                  placeholder="路径"
              />
            </a-form-item>
          </a-col>
          <a-col :span=8>
            <a-form-item label="点击选择分组名">
              <a-select v-model:value="groupId"
                        placeholder="请选择分组"
                        style="width: 200px"
                        allowClear=true
              >
                <a-select-option v-for="item in group "
                                 :key="item.id"
                                 :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8" :style="{ textAlign: 'left'}">
            <a-button type="primary" html-type="submit">
              搜索
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              重置
            </a-button>
          </a-col>
        </a-row>
        <div>
          <a-button type="primary" @click="addFile">
            +添加新文件
          </a-button>
          <a-modal v-model:visible="addView" title="添加文件">
<!--            <a-form class="contact-group-edit-form" >-->
<!--              <a-row>-->
<!--                <a-col>-->
<!--                  <a-form-item :label="`名 称: `">-->
<!--                    <a-input-->
<!--                        placeholder="联系人分组名称"-->
<!--                        style="width: 50%"-->
<!--                        v-decorator="[-->
<!--                    `newName`,-->
<!--                    {-->
<!--                      rules: [-->
<!--                        {-->
<!--                          required: true, message: '分组名称不能为空'-->
<!--                        },-->
<!--                      ],-->
<!--                    },-->
<!--                ]"-->
<!--                    />-->
<!--                  </a-form-item>-->
<!--                </a-col>-->
<!--              </a-row>-->
<!--            </a-form>-->
          </a-modal>
        </div>
      </a-form>
    </div>

    <a-table :columns="columns" :data-source="data" :pagination='pagination'>
      <span slot="action" slot-scope="text, record">
        <a-button size='small' type="link">
          更新
        </a-button>
        <a-popconfirm title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="deleteFile(record.id)"
                      @cancel="cancelDeleteFile"
        >
          <a-button size='small' type="link" @click="showConfirmDelete(record)">
            删除
          </a-button>
        </a-popconfirm>
      </span>
    </a-table>

    <router-view/>
  </div>
  <div v-else>
    <router-view/>
  </div>
</template>

<script>
import api from "@/plugins/api";

export default {
  name: 'Files',
  components: {},
  methods: {
    getListPage(current, pageSize, filePath, groupId) {
      let params = {
        page: current,
        page_size: pageSize,

      }
      if (filePath) {
        params.file_path = filePath
      }
      if (groupId) {
        params.group_id = groupId
      }
      this.request.get('/file/', params, data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      });
    },
    showConfirmDelete(rowRecord) {

    },

    deleteFile(fileId) {
      this.request.delete('/file/' + fileId + '/', {}, data => {
        this.$notification.info({
          message: '操作提示',
          description: '删除成功',
          duration: 2
        });
        this.getListPage(this.current, this.pageSize);
      });
    },
    cancelDeleteFile() {
      this.$notification.open({
        message: '操作提示',
        description: '已取消操作',
        duration: 2
      });
    },

    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        this.path = values['path'];
        this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.path, this.groupId);
      });
    },

    handleReset() {
      this.form.resetFields();
    },
    addFile() {
      this.addView = true;
    },
    getAllGroups() {
      this.request.get('/file/group/', {}, data => {
        this.group = data.records;
      });
    }
  },
  computed: {
    isRouteOfFile() {
      return this.$store.state.currentRoute === '/files'
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
        title: '文件路径',
        dataIndex: 'path',
        key: 'path',
        customRender: (text, row, index) => {
          let len = text.length;
          // return len > 25 ? '...' + text.substr(len - 25, len) : text ;
          return len > 25 ? text.substr(0, 10) + '...' + text.substr(len - 14, len) : text;
        }
      },
      {
        title: '文件描述',
        dataIndex: 'remark',
        key: 'remark',
        customRender: (text, row, index) => {
          if (text) {
            return text;
          } else {
            return '-';
          }
        }
      },
      {
        title: '分组',
        dataIndex: 'group_name',
        key: 'group_id'
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
      //分组对象
      group: [],
      path: '',
      groupId: '',
      expand: false,
      form: this.$form.createForm(this, {name: 'advanced_search'}),
      addView: false,
      editView: false,
      editItem: [],
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
      },

    };
  },

  beforeMount() {
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize);
    this.request.get('/file/group/', {page_size: 999}, data => {
      this.group = data.records;
    });
  },
  // showModal(edit, record) {
  //   this.resetModal();
  //   if (edit) {
  //     this.title = '编辑文件';
  //     this.id = record.id;
  //     this.newName = record.name
  //     this.editForm.setFieldsValue({newName: this.newName})
  //   } else {
  //     this.title = '新增文件';
  //   }
  //   this.visible = true;
  // },
  // handleOk(e) {
  //   e.preventDefault();
  //   this.editForm.validateFields((err, values) => {
  //     if (!err) {
  //       this.newName = values.newName
  //       let params = {
  //         name: this.newName
  //       };
  //       let handler = data => this.getListPage(this.pagination.current, this.pagination.pageSize, this.name);
  //       if (this.id) {
  //         params.id = this.id
  //         api.updateContactGroup(this.id, params, handler)
  //       } else {
  //         api.createContactGroup(params, handler)
  //       }
  //       this.resetModal();
  //       this.visible = false;
  //     }
  //   });
  //
  // },
  // cancelModal() {
  //   this.resetModal();
  //   this.visible = false;
  // },
  // resetModal() {
  //   this.id = '';
  //   this.newName = '';
  //   this.title = '';
  //   this.editForm.setFieldsValue({newName: ''})
  // }

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
  float: right;
}

.add-file-btn {
  float: left;
}

</style>
