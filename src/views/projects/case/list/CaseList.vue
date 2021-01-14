<template>
  <div>
    <div class="case-search-div">
      <a-form class="case-search-form" :form="form" @submit="handleSearch">
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
          <a-button class="add-button" type="primary" @click="createCase">
            新增
          </a-button>
<!--          <a-button class="batch-delete-button" :style="{ marginLeft: '8px' }" @click="() => console.info('批量删除')">-->
<!--            批量删除-->
<!--          </a-button>-->
        </a-row>
      </a-form>
    </div>
    <div>
      <a-table :columns="columns" :data-source="data" :pagination="pagination" :customRow="customRow">
        <span slot="notify" slot-scope="text, record">
          {{record.notify ? '是' : '否'}}
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size='small' type="link" @click="updateCase(record.id)">
          查 看
          </a-button>
          <a-divider type="vertical"/>
          <a-button size='small' type="link" @click="updateCase(record.id)">
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
          <a-divider type="vertical"/>
          <a-dropdown placement="bottomCenter">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a-button size="small" type="link">执行</a-button>
                </a-menu-item>
                <a-menu-item>
                  <a-button size="small" type="link">上移</a-button>
                </a-menu-item>
                <a-menu-item>
                  <a-button size="small" type="link">下移</a-button>
                </a-menu-item>
                <a-menu-item>
                  <a-button size="small" type="link">置顶</a-button>
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
    title: '请求方法',
    dataIndex: 'method',
    key: 'method',
    align: 'center'
  },
  {
    title: '请求地址',
    dataIndex: 'host',
    key: 'host',
    align: 'center'
  },
  {
    title: '请求头',
    dataIndex: 'headers',
    key: 'headers',
    align: 'center'
  },
  {
    title: '请求路径',
    dataIndex: 'path',
    key: 'path',
    align: 'center'
  },
  {
    title: '是否执行',
    key: 'run',
    scopedSlots: { customRender: 'run' },
    align: 'center'
  },
  {
    title: '所属项目',
    key: 'project_name',
    dataIndex: 'project_name',
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
    scopedSlots: { customRender: 'action'},
    align: 'center'
  }
];

const data = [];

export default {
  components: {},
  beforeMount() {
    const {
      project
    } = this.$route.query
    this.projectId = project
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize, this.projectId);
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
      projectId: '',
      targetSort: 0,
      sourceSort: 0,
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
    customRow (record) {
      return {
        attrs: {
          draggable: true // 设置拖拽属性
        },
        on: {
          // 鼠标移入，不需要做什么
          mouseenter: (event) => {
            // 兼容IE
            var ev = event || window.event
          },
          // 开始拖拽，记录原始坐标
          dragstart: (event) => {
            // 兼容IE
            var ev = event || window.event
            // 阻止冒泡
            ev.stopPropagation()
            // 得到源目标数据
            this.sourceSort = record.sort
          },
          // 拖动元素经过的元素，往经过的数组中 push 坐标
          dragover: (event) => {
            // 兼容 IE
            var ev = event || window.event
            // 阻止默认行为
            ev.preventDefault()
          },
          // 鼠标松开，根据原坐标和终坐标计算上移还是下移，经过的坐标该加一还是减一，然后重新刷新列表
          drop: (event) => {
            // 兼容IE
            var ev = event || window.event
            // 阻止冒泡
            ev.stopPropagation()
            // 得到目标数据
            this.targetSort = record.sort
            this.sort(this.sourceSort, this.targetSort, 'drag')
          }
        }
      };
    },
    sort: function (source, target, type) {
      api.sortCase({
        source: source,
        target: target,
        transfer: type
      }, (data => this.getListPage(this.pagination.current, this.pagination.pageSize, this.projectId)))
    },
    getListPage: function (current, pageSize, projectId) {
      let params = {
        page: current,
        page_size: pageSize,
        project_id: projectId
      }
      api.listCase(params, (data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      }));
    },
    showConfirmDelete(rowRecord) {

    },
    createCase() {
      this.$router.push({
        path: '/project/case/add-case',
        query: {
          projectId: this.projectId
        }
      })
    },
    updateCase(id) {
      this.$router.push({
        path: '/project/case/update-case',
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
@import '../../../../assets/css/common.css';
@import "case-list.css";
</style>
