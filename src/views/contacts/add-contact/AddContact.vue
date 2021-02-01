<template>
  <div class="add-contact" style="padding:30px">
    <a-modal :visible="visible" title="编辑联系人分组" @ok="dealModal" @cancel="dealModal">
      <a-table :rowKey="record => record.id + record.name" bordered :data-source="tabGroups" :columns="columns" :pagination="false" size="small">
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
    <a-card title="新增联系人">
      <a-form id="add-contact-form" :form="form" class="contact-form" @submit="handleSubmit">
        <a-form-item>
          名  称：
          <a-input class="contact-name" style="width: 10%"
                   v-decorator="[
          'name',
          { rules: [{ required: true, message: '联系人名称不可为空！' }] },
        ]"
                   placeholder="请输入联系人名称"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          邮  箱：
          <a-input class="contact-email" style="width: 10%"
                   v-decorator="[
          'email',
          { rules: [{ required: true, message: '联系人邮箱不可为空！' }] },
        ]"
                   placeholder="请输入联系人邮箱"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          手  机：
          <a-input class="contact-phone" style="width: 10%"
                   v-decorator="[
          'phone',
          { rules: [{ required: true, message: '联系人手机不可为空！' }] },
        ]"
                   placeholder="请输入联系人手机"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          分  组：
          <a-select style="width: 200px" @change="value => value"
                    v-decorator="[
                      'group_id',
                      { rules: [{
                          required: true, message: '联系人分组不可为空！' }
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
        <a-form-item>
          <a-button type="primary" html-type="submit" class="contact-form-button">
            确 定
          </a-button>
          <a-divider type="vertical"/>
          <a-button class="contact-form-cancel-button" @click="$router.push('/contact')">
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
    this.form = this.$form.createForm(this, {name: 'add-contact'});
  },
  beforeMount() {
    this.getGroups();
  },
  data() {
    return {
      visible: false,
      name: '',
      email: '',
      phone: '',
      groupId: '',
      groups: [],
      tabGroups: [],
      count: 0,
      plusBtnDisable: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          customRender: (text, row, index) => index + 1,
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
        api.updateContactGroup(id, { id: id, name: value }, handler);
      } else {
        api.createContactGroup({ name: value }, handler);
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
        api.deleteContactGroup(id, {
          id: id
        }, data => api.notification(this.$notification, '操作提示', '删除成功', 'info'));
      }
    },
    handleAdd() {
      const { count, tabGroups } = this;
      const newData = {
        name: `联系人分组${count + 1}`,
      };
      this.tabGroups = [...tabGroups, newData];
      this.count = count + 1;
      this.plusBtnDisable = true;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.createContactor(values)
        }
      });
    },
    getGroups: function () {
      this.request.get('/contactor/group/', {
        page: 1,
        page_size: 9999
      }, (data => {
        this.groups = data.records;
        this.tabGroups = data.records;
        this.count = data.total;
      }));
    },
    createContactor: function (params) {
      this.request.post('/contactor/', params, (data => {
        this.$router.push('/contact');
      }))
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
@import "add-contact.css";
</style>
