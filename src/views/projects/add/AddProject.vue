<template>
  <div class="add-project" style="padding:30px">
    <a-modal :visible="visible" title="编辑项目分组" @ok="dealModal" @cancel="dealModal" destroyOnClose>
      <a-table :rowKey="record => record.id + record.name" bordered :data-source="tabGroups" :columns="columns"
               :pagination="false" size="small" :scroll="{ y: 240 }">
        <template slot="name" slot-scope="text, record">
          <editable-cell :text="text" :edited="!record.id" @change="onCellChange(record, 'name', $event)" @edit="() => plusBtnDisable = true"/>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm v-if="groups.length" title="确认要删除该分组吗?" @confirm="() => onDelete(record)">
            <a-button size='small' type="link">删 除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-button class="editable-add-btn" type="link" @click="handleAdd" :disabled="plusBtnDisable"><a-icon type="plus" />新增分组</a-button>
    </a-modal>
    <a-card title="新增项目">
      <a-form id="add-project-form" :form="form" class="project-form" @submit="handleSubmit">
        <a-form-item :label="`名 称: `">
          <a-input class="project-name" style="width: 10%"
                   v-decorator="[
                    'name',
                    { rules: [
                          { required: true, message: '项目名称不可为空！' }
                        ]
                    },
                    ]"
                   placeholder="请输入联系人名称"
          />
        </a-form-item>
        <a-form-item :label="`请求地址: `">
          <a-input class="project-host" style="width: 10%"
                   v-decorator="[
                    'host',
                    { rules: [
                          { required: false }
                        ]
                    },
                   ]"
                   placeholder="请输入请求地址"
          />
        </a-form-item>
        <a-form-item :label="`请求头: `">
          <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code"
                       v-decorator="[
                            'headers',
                            {
                              rules: [{
                                required: false
                              }],
                              initialValue: null
                            },
                    ]"
          />
        </a-form-item>
        <a-form-item :label="`通 知: `">
          <a-switch checked-children="是" un-checked-children="否"
                    v-decorator="[
                        'notify',
                        {
                          rules: [{
                            required: true, message: '是否通知不可为空！'
                          }],
                          initialValue: false,
                          valuePropName: 'checked'
                        }
                    ]"
                     />
        </a-form-item>
        <a-form-item :label="`分 组: `">
          <a-select style="width: 200px" @change="value => value"
                    v-decorator="[
                      'groupId',
                      { rules: [{
                          required: true, message: '项目分组不可为空！' }
                        ],
                      initialValue: null
                      }
                    ]"
          >
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0;" />
              <div style="padding: 4px 4px; cursor: pointer; text-align:center" @mousedown="e => e.preventDefault()">
                <a-button type="link" size="small" @click="() => visible = true">编辑分组</a-button>
              </div>
            </div>
            <a-select-option v-for="group in groups" :value="group.id">
              {{ group.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`备 注: `">
          <a-textarea class="project-remark"
                      style="width: 30%"
                      :rows="4"
                      v-decorator="[
                        'remark',
                        { rules: [
                            { required: false }
                          ]
                        },
                      ]"
                      placeholder="请输入备注"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="project-form-button">
            确 定
          </a-button>
          <a-divider type="vertical"/>
          <a-button class="project-form-cancel-button" @click="$router.push('/project')">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import api from '@/plugins/api'

export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'add-project'});
  },
  beforeMount() {
    this.getGroups()
  },
  data() {
    return {
      groups: [],
      visible: false,
      tabGroups: [],
      count: 0,
      plusBtnDisable: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          customRender: (text, row, index) => index + 1,
          width: 60,
          align: 'center'
        },
        {
          title: '分组名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 60,
          align: 'center',
        },
      ],
    }
  },
  methods: {
    dealModal: function () {
      const tabGroups = [...this.tabGroups];
      const groups = tabGroups.filter(item => item.id);
      this.groups = groups;
      this.tabGroups = groups;
      this.count = groups.length;
      this.visible = false;
    },
    onCellChange(record, dataIndex, value) {
      const tabGroups = [...this.tabGroups];
      const handler = data => {
        const index = tabGroups.indexOf(record);
        tabGroups.splice(index, 1, data);
        this.tabGroups = tabGroups;
      };
      if (record.id) {
        const id = record.id
        api.updateProjectGroup(id, { id: id, name: value }, handler);
      } else {
        api.createProjectGroup({ name: value }, handler);
      }
      this.plusBtnDisable = false;
    },
    onDelete(record) {
      const tabGroups = [...this.tabGroups];
      const index = tabGroups.indexOf(record);
      tabGroups.splice(index, 1)
      this.tabGroups = tabGroups;
      if (record.id) {
        const id = record.id
        api.deleteProjectGroup(id, {
          id: id
        }, data => api.notification(this.$notification, '操作提示', '删除成功', 'info'));
      }
    },
    handleAdd() {
      const { count, tabGroups } = this;
      const newData = {
        name: `项目分组${count + 1}`,
      };
      this.tabGroups = [...tabGroups, newData];
      this.count = count + 1;
      this.plusBtnDisable = true;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.createProjector(values)
        }
      });
    },
    getGroups: function () {
      api.listProjectGroup({ current: 1, size: 9999 }, data => {
        this.groups = data.records;
        this.tabGroups = data.records;
        this.count = data.total;
      })
    },
    createProjector: function (params) {
      api.createProject(params, data =>  this.$router.push('/project'));
    },
  },
  watch: {
    tabGroups: {
      handler(newV, oldV) {
        const editing = newV.filter(group => !group.id)
        this.plusBtnDisable = editing.length !== 0
      }, immediate: true
    }
  }
}
</script>

<style scoped>
@import "add-project.css";
</style>
