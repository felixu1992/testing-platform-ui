<template>
  <div class="update-file" style="padding:30px">
    <a-modal :visible="visible" title="编辑文件分组" @ok="dealModal" @cancel="dealModal" destroyOnClose>
      <a-table :rowKey="record => record.id + record.name" bordered :data-source="tabGroups" :columns="columns" :pagination="false" size="small" :scroll="{ y: 240 }">
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
    <a-card title="更新文件">
      <a-form id="update-file-form" :form="form" class="file-form" @submit="handleSubmit">
        <a-form-item :label="`名 称: `">
          <a-input class="file-name" style="width: 10%"
                   v-decorator="[
          'name',
          { rules: [{ required: true, message: '文件名称不可为空！' }] },
        ]"
                   placeholder="请输入文件名称"
          >
          </a-input>
        </a-form-item>

        <a-form-item :label="`分 组: `">
          <a-select style="width: 200px" @change="value => value"
                    v-decorator="[
                      'groupId',
                      { rules: [{
                          required: true, message: '文件分组不可为空！' }
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
        <a-form-item :label="`文 件: `">
          <div style="width: 12%">
            <a-upload-dragger
                name="file"
                @change="handleChange"
                :before-upload="file => false"
                :file-list="fileList"
                v-decorator="[
                      'files',
                      { rules: [
                          {
                            required: false
                          }
                        ]
                      }
                    ]"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox"/>
              </p>
              点击或者将文件拖入框内上传
            </a-upload-dragger>
          </div>
        </a-form-item>
        <a-form-item :label="`备 注: `">
          <a-textarea class="file-remark"
                      style="width: 20%"
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
          <a-button type="primary" html-type="submit" class="file-form-button">
            确 定
          </a-button>
          <a-divider type="vertical"/>
          <a-button class="file-form-cancel-button" @click="$router.push('/file')">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import api from "@/plugins/api";

export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'update-file'});
  },
  beforeMount() {
    this.getGroups()
    const {
      id
    } = this.$route.query
    this.id = id
    this.getFileInfo(id)
  },
  data() {
    return {
      id: '',
      groups: [],
      fileName: '',
      fileList: [],
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
        api.updateFileGroup(id, { id: id, name: value }, handler);
      } else {
        api.createFileGroup({ name: value }, handler);
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
        api.deleteFileGroup(id, {
          id: id
        }, data => api.notification(this.$notification, '操作提示', '删除成功', 'info'));
      }
    },
    handleAdd() {
      const { count, tabGroups } = this;
      const newData = {
        name: `文件分组${count + 1}`,
      };
      this.tabGroups = [...tabGroups, newData];
      this.count = count + 1;
      this.plusBtnDisable = true;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = new FormData();
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };
          formData.append('id', this.id)
          formData.append('name', values.name);
          formData.append('groupId', values.groupId);
          formData.append('remark', values.remark);
          if (values.files !== undefined) {
            formData.append('files', values.files.fileList[0].originFileObj);
          }
          api.updateFile(this.id, formData, data => {
            this.$router.push('/file')
          }, config)
        }
      });
    },
    getFileInfo: function (id) {
      api.getFile(id, { id: this.id }, (data => {
        this.form.setFieldsValue(data)
      }));
    },
    getGroups: function () {
      api.listFileGroup({ current: 1, size: 9999 }, data => {
        this.groups = data.records;
        this.tabGroups = data.records;
        this.count = data.total;
      });
    },
    handleChange: function (info) {
      if (info.file.status !== 'removed'){
        let file = info.fileList[info.fileList.length - 1]
        this.fileList.splice(0, this.fileList.length)
        this.fileList.push(file)
      }
    }
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
@import "update-file.css";
</style>
