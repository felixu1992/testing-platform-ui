<template>
  <div>
    <a-modal :visible="visible" title="复制用例" @ok="handleOk" @cancel="cancelModal">
      <a-form class="copy-form" :form="copyForm">
        <a-row>
          <a-col>
            <a-form-item :label="`名 称: `">
              <a-input
                  placeholder="请输入新用例名称"
                  style="width: 50%"
                  v-decorator="[
                    `name`,
                    {
                      rules: [
                        {
                          required: true, message: '用例名称不能为空'
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
    <a-modal :visible="importVisible" title="导入旧版用例" @ok="handleImport" @cancel="cancelImport">
      <a-form id="add-file-form" :form="importForm" class="import-form">
        <a-form-item>
          <div>
            <a-upload-dragger
                name="file"
                accept=".xls,.xlsx"
                @change="importFilesChange"
                :before-upload="file => false"
                :file-list="importFiles"
                v-decorator="[
                    'files',
                    { rules: [
                        {
                          required: true, message: '文件不可为空！'
                        }
                      ]
                    }
                  ]"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox"/>
              </p>
              点击选择或者将文件拖入框内
            </a-upload-dragger>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :breadcrumb="{ props: { routes } }"
    >

      <template #title>
        <span>用例管理</span>
      </template>
      <template #subTitle>
        <span>用例列表</span>
      </template>
      <template #extra>
        <a-input-search placeholder="用例名称" v-model="name" @search="handleSearch"/>
      </template>
      <div class="options" style="padding-top: 20px">
        <a-button class="add-button" type="primary" @click="createCase">
          新增
        </a-button>
        <!--          <a-button class="batch-delete-button" :style="{ marginLeft: '8px' }" @click="() => console.info('批量删除')">-->
        <!--            批量删除-->
        <!--          </a-button>-->
        <a-divider type="vertical"/>
        <a-button class="execute-project-button" @click="executeProject" :loading="executing"
                  :style="{marginRight: '8px'}">
          {{ executing ? '执行中...' : '执行' }}
        </a-button>
        <a-divider type="vertical"/>
        <a-button icon="upload" class="import" @click="importCase">
          导入旧版
        </a-button>
        <a-divider type="vertical"/>
        <a-button icon="download" class="export" @click="exportCase">
          导出旧版
        </a-button>
      </div>
    </a-page-header>
    <div>
      <a-table rowKey="id" :columns="columns" :data-source="data" :pagination="pagination" :customRow="customRow">
        <span slot="customHost">
          请求地址
          <a-popover placement="topLeft">
            <template #content>
              自身设置的优先于项目设置的生效
            </template>
            <a-icon type="exclamation-circle" style="font-size: 12px; color: #ff0000; padding-left: 3px"/>
          </a-popover>
        </span>
        <span slot="customHeaders">
          请求头
          <a-popover placement="topLeft">
            <template #content>
              合并显示项目与自身设置的请求头
            </template>
            <a-icon type="exclamation-circle" style="font-size: 12px; color: #ff0000; padding-left: 3px"/>
          </a-popover>
        </span>
        <span slot="name" slot-scope="text, record">
          <a-tooltip v-if="text.length > 10" placement="topLeft">
            <template #title>
              {{ text }}
            </template>
            {{
              text.substr(0, 10) + '...'
            }}
          </a-tooltip>
          <span v-else>
            {{ text }}
          </span>
        </span>
        <span slot="remark" slot-scope="text, record">
          <a-tooltip v-if="text && text.length > 15" placement="topLeft">
            <template #title>
              {{ text }}
            </template>
            {{
              text.substr(0, 15) + '...'
            }}
          </a-tooltip>
          <span v-else>
            {{ text ? text : '-' }}
          </span>
        </span>
        <span slot="headers" slot-scope="text, record">
          <a-popover v-if="text || project.headers" placement="topLeft" @visibleChange="mergeHeaders(text)">
            <template slot="content">
              <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code" :value="header"/>
            </template>
            <a-button size="small" type="link">查看</a-button>
          </a-popover>
          <span v-else>
            -
          </span>
        </span>
        <span slot="run" slot-scope="text, record">
          <a-switch checked-children="是" un-checked-children="否" :checked="record.run"
                    @change="(checked, event) => changeRun(checked, event, record)"/>
        </span>
        <span slot="host" slot-scope="text, record">
          <a-tooltip v-if="(text && text.length > 25) || (project.host && project.host.length > 25)"
                     placement="topLeft">
            <template #title>
              {{ text ? text : project.host }}
            </template>
            {{
              text ? text.substr(0, 10) + '...' + text.substr(text.length - 10, text.length) : project.host.substr(0, 10) + '...' + project.host.substr(project.host.length - 10, project.host.length)
            }}
          </a-tooltip>
          <span v-else>
            {{ text ? text : project.host }}
          </span>
        </span>
        <span slot="path" slot-scope="text, record">
          <a-tooltip v-if="text.length > 40" placement="topLeft">
            <template #title>
              {{ text }}
            </template>
            {{
              text.substr(0, 40) + '...'
            }}
          </a-tooltip>
          <span v-else>
            {{ text }}
          </span>
        </span>
        <span slot="action" slot-scope="text, record">
<!--          <a-button size='small' type="link" @click="updateCase(record.id)">-->
<!--          查 看-->
<!--          </a-button>-->
<!--          <a-divider type="vertical"/>-->
          <a-button size='small' type="link" @click="updateCase(record.id)">
          编 辑
          </a-button>
          <a-divider type="vertical"/>
          <a-popconfirm title="确认删除?"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="deleteCase(record.id)"
                        @cancel="cancelDelete"
          >
            <a-button size='small' type="link" @click="record => record">
              删 除
            </a-button>
          </a-popconfirm>
          <a-divider type="vertical"/>
          <a-dropdown placement="bottomCenter">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多 <a-icon type="down"/>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a-button size="small" type="link" @click="executeCase(record.id)">执行</a-button>
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
                <a-menu-item>
                  <a-button size="small" type="link" @click="copyCase(record.id, record.name)">复制</a-button>
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
import Consts from "@/consts/consts";

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    customRender: (text, row, index) => index + 1,
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: {customRender: 'name'},
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    scopedSlots: {customRender: 'remark'},
    align: 'center'
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    key: 'method',
    align: 'center'
  },
  {
    dataIndex: 'host',
    key: 'host',
    slots: {title: "customHost"},
    scopedSlots: {customRender: 'host'},
    align: 'center'
  },
  {
    dataIndex: 'headers',
    key: 'headers',
    slots: {title: "customHeaders"},
    scopedSlots: {customRender: 'headers'},
    align: 'center'
  },
  {
    title: '请求路径',
    dataIndex: 'path',
    key: 'path',
    scopedSlots: {customRender: 'path'},
    align: 'center'
  },
  {
    title: '是否执行',
    key: 'run',
    scopedSlots: {customRender: 'run'},
    align: 'center'
  },
  {
    title: '所属项目',
    key: 'projectName',
    dataIndex: 'projectName',
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

const project = {};

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'search-form'});
    this.copyForm = this.$form.createForm(this, {name: 'copy-form'});
    this.importForm = this.$form.createForm(this, {name: 'import-form'})
  },
  created() {
    const {
      project, page, pageSize
    } = this.$route.query
    this.projectId = project
    if (page) {
      this.pagination.defaultCurrent = page;
    }
    if (pageSize) {
      this.pagination.defaultPageSize = pageSize;
    }
    api.getProject(project, {id: project}, data => {
      this.project = data;
    });
    this.getListPage(this.pagination.defaultCurrent, this.pagination.defaultPageSize, this.projectId);
  },
  data() {
    return {
      importVisible: false,
      importFiles: [],
      routes: [],
      executing: false,
      header: {},
      project,
      visible: false,
      data,
      columns,
      name: '',
      copy: 0,
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
          this.getListPage(current, pageSize, this.projectId, this.name);
        },
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        onChange: (current, pageSize) => {
          this.getListPage(current, pageSize, this.projectId, this.name)
        }
      }
    };
  },
  methods: {
    changeRun: function (checked, event, record) {
      record.run = checked;
      api.updateCase(record.id, record, data => data);
    },
    mergeHeaders(headers) {
      const parent = Object.assign({}, this.project.headers);
      if (headers && parent) {
        for (let key in headers) {
          parent[key] = headers[key];
        }
        this.header = parent;
        return;
      }
      this.header = headers ? headers : parent;
    },
    executeCase: function (id) {
      api.executeCase({id: id}, data => {
        console.info(data)
      })
    },
    executeProject: function () {
      this.executing = true;
      api.executeProject({id: this.projectId}, data => {
        this.executing = false;
        const key = `open${Date.now()}`;
        this.$notification.info({
          message: '操作提示',
          description: `共计执行 ${data.total} 条用例，成功 ${data.passed} 条，失败 ${data.failed} 条，忽略 ${data.ignored} 条`,
          btn: h => {
            return h(
                'a-button',
                {
                  props: {
                    type: 'link',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.$notification.close(key)
                      this.$router.push({
                        path: '/record/report',
                        query: {
                          recordId: data.id
                        }
                      })
                    },
                  },
                },
                '查看结果',
            );
          },
          key,
          onClose: close
        })
      }, err => this.executing = false)
    },
    customRow(record) {
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
            this.targetSort = record.sort;
            let source = null;
            let target = null;
            this.data.forEach((item, index) => {
              if (item.sort === this.targetSort)
                target = item;
              if (item.sort === this.sourceSort)
                source = item
            })
            this.data.splice(this.data.indexOf(source), 1);
            this.data.splice(this.data.indexOf(target), 0, source);
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
    getListPage: function (current, pageSize, projectId, name) {
      let params = {
        current: current,
        size: pageSize,
        projectId: projectId,
      }
      if (name) {
        params.name = name
      }
      api.listCase(params, (data => {
        this.data = data.records;
        this.pagination.pageSize = pageSize;
        this.pagination.current = current;
        this.pagination.total = data.total;
      }));
    },
    createCase() {
      this.$router.push({
        path: '/project/case/add-case',
        query: {
          projectId: this.projectId,
          page: this.pagination.current,
          pageSize: this.pagination.pageSize
        }
      })
    },
    updateCase(id) {
      this.$router.push({
        path: '/project/case/update-case',
        query: {
          id: id,
          page: this.pagination.current,
          pageSize: this.pagination.pageSize
        }
      });
    },
    deleteCase(id) {
      api.deleteCase(id, {}, data => {
        api.notification(this.$notification, '操作提示', '删除成功', 'info')
        this.getListPage(this.pagination.current, this.pagination.pageSize, this.projectId, this.name);
      })
    },
    cancelDelete() {
      api.notification(this.$notification, '操作提示', '已取消操作', 'info')
    },
    handleSearch(value, event) {
      this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.projectId, this.name);
    },
    handleReset() {
      this.form.resetFields();
      this.name = '';
      this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.projectId, this.name)
    },
    copyCase: function (id, name) {
      this.copy = id
      this.visible = true;
      setTimeout(() => {
        if (name) {
          this.copyForm.setFieldsValue({name: name + '_copy'})
        }
      }, 100);
    },
    handleOk(e) {
      e.preventDefault();
      this.copyForm.validateFields((err, values) => {
        if (!err) {
          values.id = this.copy;
          api.copyCase(values, data => {
            this.getListPage(this.pagination.current, this.pagination.pageSize, this.projectId, this.name)
          })
          this.cancelModal();
        }
      });
    },
    cancelModal() {
      this.visible = false;
      this.copyForm.setFieldsValue({name: ''})
    },
    importCase() {
      this.importVisible = true;
    },
    handleImport(e) {
      e.preventDefault();
      this.importForm.validateFields((err, values) => {
        if (!err) {
          let formData = new FormData();
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };
          formData.append('project_id', this.projectId);
          formData.append('files', values.files.fileList[0].originFileObj);
          api.tempImportProject(formData, (data => {
            this.getListPage(this.pagination.defaultCurrent, this.pagination.pageSize, this.projectId, this.name)
          }), config)
        }
      });
      this.cancelImport();
    },
    cancelImport() {
      this.importVisible = false;
    },
    importFilesChange: function (info) {
      if (info.file.status !== 'removed'){
        let file = info.fileList[info.fileList.length - 1]
        this.importFiles.splice(0, this.importFiles.length)
        this.importFiles.push(file)
      }
    },
    exportCase() {
      const eleLink = document.createElement('a');
      // eleLink.download = this.projectId;
      eleLink.style.display = 'none';
      const userInfo = JSON.parse(localStorage.getItem(Consts.USER_INFO_LOCAL_STORAGE_KEY))
      eleLink.href = `/project/temp-export/?project_id=${this.projectId}&auth=token ${userInfo.token}`;
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
    }
  },
}
</script>
<style scoped>
@import '../../../../assets/css/common.css';
@import "case-list.css";
</style>
