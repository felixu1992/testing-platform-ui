<template>
  <div>
    <div class="file-search-div">
      <a-form class="file-search-form" :form="form" @submit="handleSearch">
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
                  placeholder="文件名称"
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
          <a-button class="add-button" type="primary" @click="() => $router.push('/file/add-file')">
            新增
          </a-button>
<!--          <a-button class="batch-delete-button" :style="{ marginLeft: '8px' }" @click="() => console.info('批量删除')">-->
<!--            批量删除-->
<!--          </a-button>-->
        </a-row>
      </a-form>
    </div>
    <div>
      <a-table :columns="columns"
               :data-source="data"
               :pagination="pagination"
      >
      <span slot="action" slot-scope="text, record">
        <a-button size='small' type="link" @click="updateFile(record.id)">
        编 辑
        </a-button>
        <a-divider type="vertical"/>
        <a-popconfirm title="确认删除?"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="deleteFile(record.id)"
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
import api from "@/plugins/api";
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '存储地址',
    key: 'path',
    dataIndex: 'path',
    customRender: (text, row, index) => {
      let len = text.length;
      return len > 25 ? text.substr(0, 10) + '...' + text.substr(len - 14, len) : text;
    },
    align: 'center'
  },
  {
    title: '所属分组',
    key: 'group_name',
    dataIndex: 'group_name',
    align: 'center'
  },
  {
    title: '文件描述',
    key: 'remark',
    dataIndex: 'remark',
    customRender: (text, row, index) => {
      if (text) {
        return text;
      } else {
        return '-';
      }
    },
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'created_at',
    dataIndex: 'created_at',
    align: 'center'
  },
  {
    title: '更新时间',
    key: 'updated_at',
    dataIndex: 'updated_at',
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
  },
  data() {
    return {
      data,
      columns,
      name: '',
      targetObj: {},
      sourceObj: {},
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
    getListPage: function (current, pageSize, name) {
      let params = {
        page: current,
        page_size: pageSize
      }
      if (name) {
        params.name = name
      }
      api.listFile(params, (data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      }));
    },
    showConfirmDelete(rowRecord) {

    },
    updateFile(id) {
      this.$router.push({
        path: '/file/update-file',
        query: {
          id: id
        }
      });
    },
    deleteFile(id) {
      this.request.delete('/file/' + id + "/", {
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
          this.name = values.name;
          this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.name);
        }
      });
    },

    handleReset() {
      this.form.resetFields();
      this.name = '';
      this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.name, this.phone, this.email)
    },
  }
}
</script>
<style scoped>
@import '../../../assets/css/common.css';
@import "file-list.css";
</style>
