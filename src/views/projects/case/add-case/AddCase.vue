<template>
  <div class="add-case" style="padding:30px">
    <a-card title="新增用例">
      <a-modal :visible="visible" :title="title" @ok="handleOk" @cancel="cancelModal">
        <a-form id="extend-modal-form" :form="extendModalForm" class="extend-form">
          <a-form-item :label="`注入键: `">
            <div v-for="(item, index) in this.extendModal.ste">
              <a-input :key="`input`+index" v-model="item.value" class="step" placeholder="请输入步骤" style="width: 70%"/>
              <a-button :key="`button`+index" size='small' type="link" @click="extendDropInp(index)">
                <a-icon type="minus"/>
                删除此步
              </a-button>
            </div>
            <a-button size='small' type="link" @click="extendAddInp">
              <a-icon type="plus"/>
              新增步骤
            </a-button>
          </a-form-item>
          <a-form-item :label="`注入值: `">
            <div>
              <a-tree class="draggable-tree" :tree-data="treeData" @select="extendSelect"/>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-form
          id="add-case-form"
          :form="form"
          class="case-form"
          @submit="handleSubmit"
      >
        <a-form-item :label="`名 称: `">
          <a-input class="case-name" style="width: 10%"
                   v-decorator="[
                    'name',
                    { rules: [
                          { required: true, message: '用例名称不可为空！' }
                        ]
                    },
                    ]"
                   placeholder="请输入用例名称"
          />
        </a-form-item>
        <a-form-item :label="`请求方式: `">
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'method',
                      { rules: [
                            { required: true, message: '请求方式不可为空！' }
                          ],
                        initialValue: 'get'
                      }
                    ]"
          >
            <a-select-option v-for="item in requestMethod" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`请求地址: `">
          <a-input class="case-host" style="width: 10%"
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
        <a-form-item :label="`请求路径: `">
          <a-input class="case-host" style="width: 10%"
                   v-decorator="[
                    'path',
                    { rules: [
                          { required: true , message: '请求路径不可为空！' }
                        ]
                    },
                   ]"
                   placeholder="请输入请求路径"
          />
        </a-form-item>
        <a-form-item :label="`请求头: `">
          <a-input class="case-headers" style="width: 10%"
                   v-decorator="[
                    'headers',
                    { rules: [
                          { required: false }
                        ]
                    },
                   ]"
                   placeholder="请输入请求头"
          />
        </a-form-item>
        <a-form-item :label="`请求参数: `">
          <vue-json-editor :show-btns="false"
                           :expandedOnStart="true"
                           @json-change="onJsonChange"
                           style="width: 30%; height: 200px"
                           lang="zh"
                           mode="code"
                           v-model="json"
          />
        </a-form-item>
        <a-form-item :label="`参数注入: `">
          <a-table :columns="columns" :data-source="extendData" :pagination="false"
                   style="width: 30%" size="small" bordered tableLayout="fixed">
            <span slot="extend_key" slot-scope="text, record">
              {{ record.extend_key }}
            </span>
            <span slot="action" slot-scope="text, record">
              <a-button size='small' type="link" @click="updateproject(record.id)">
                编 辑
              </a-button>
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除?"
                            ok-text="是"
                            cancel-text="否"
                            @confirm="deleteproject(record.id)"
                            @cancel="cancelDelete"
              >
                <a-button v-if="record.extend_key !== 'button'" size='small' type="link"
                          @click="showConfirmDelete(record)">
                  删 除
                </a-button>
              </a-popconfirm>
            </span>
          </a-table>
          <a-button size='small' type="link" @click="showModal(false)">
            <a-icon type="plus"/>
            新增注入
          </a-button>
        </a-form-item>
        <a-form-item :label="`结果示例: `">
          <vue-json-editor :show-btns="false"
                           :expandedOnStart="true"
                           @json-change="onJsonChange"
                           style="width: 30%; height: 200px"
                           lang="zh"
                           mode="code"
                           v-model="json"
          />
        </a-form-item>
        <a-form-item :label="`通 知: `">
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'notify',
                      { rules: [
                            { required: true, message: '是否通知不可为空！' }
                          ],
                        initialValue: false
                      }
                    ]"
          >
            <a-select-option v-for="item in notifyData" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`运 行: `">
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'run',
                      { rules: [
                            { required: true, message: '是否运行不可为空！' }
                          ],
                        initialValue: true
                      }
                    ]"
          >
            <a-select-option v-for="item in notifyData" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`校验 HTTP 状态: `">
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'check_status',
                      { rules: [
                            { required: true, message: '是否校验 HTTP 状态不可为空！' }
                          ],
                        initialValue: false
                      }
                    ]"
          >
            <a-select-option v-for="item in notifyData" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`预期 HTTP 状态码: `">
          <a-input class="case-host" style="width: 10%"
                   v-decorator="[
                    'expected_http_status',
                    { rules: [
                          { required: false }
                        ]
                    },
                   ]"
                   placeholder="请输入预期状态码"
          />
          这是个提示气泡
        </a-form-item>
        <a-form-item :label="`开发者: `">
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'developer',
                      { rules: [
                            { required: true, message: '是否运行不可为空！' }
                          ],
                        initialValue: true
                      }
                    ]"
          >
            <a-select-option v-for="item in notifyData" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`延迟时长: `">
          <a-input class="case-host" style="width: 10%"
                   v-decorator="[
                    'delay',
                    { rules: [
                          { required: false }
                        ]
                    },
                   ]"
                   placeholder="请输入延迟时长"
          />
          这是个提示气泡
        </a-form-item>
        <a-form-item :label="`备 注: `">
          <a-textarea class="case-remark"
                      style="width: 30%"
                      autosize
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
          <a-button type="primary" html-type="submit" class="case-form-button">
            确 定
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import api from '@/plugins/api'
import vueJsonEditor from 'vue-json-editor'
const columns = [
  {
    title: '注入键',
    key: 'extend_key',
    scopedSlots: {customRender: 'extend_key'},
    align: 'center'
  },
  {
    title: '注入值',
    dataIndex: 'extend_value',
    key: 'extend_value',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: 'center'
  }
];
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'add-case'});
    this.extendModalForm=this.$form.createForm(this, {name: 'extend-modal'})
  },
  beforeMount() {
    const {projectId} = this.$route.query;
    this.projectId = projectId;
    this.getGroups();
  },
  data() {
    return {
      json: {
        msg: 'demo of jsoneditor'
      },
      title: '',
      visible: false,
      columns,
      expectedData: [],
      extendData: [
        // {
        //   extend_key: ['a', 'b', 'c'],
        //   extend_value: 'wocao'
        //   // extend_value: {
        //   //   depend: 1,
        //   //   steps: ['d', 'e', 'f']
        //   // }
        // }
      ],
      treeData: [],
      mockJson: {
        code: 0,
        data: {
          total: 10,
          records: [
            {
              name: 'felixu',
              age: 18
            }
          ]
        }
      },
      projectId: '',
      groups: [],
      notifyData: [
        {
          value: true,
          text: '是'
        },
        {
          value: false,
          text: '否'
        }
      ],
      requestMethod: [
        {
          value: 'get',
          text: 'GET'
        },
        {
          value: 'put',
          text: 'PUT'
        },
        {
          value: 'post',
          text: 'POST'
        },
        {
          value: 'delete',
          text: 'DELETE'
        }
      ],
      extendModal: {
        ste: [],
        dep: {
          depend: 0,
          steps: []
        }
      }
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.createCase(values)
        }
      });
    },
    getGroups: function () {
      api.listcaseGroup({
        page: 1,
        page_size: 999
      }, (data => {
        this.groups = data.records;
      }))
    },
    createCase: function (params) {
      if (this.json) {
        params.params = this.json;
        params.sample = this.json;
      }
      debugger
      api.createCase(params, (data => {
        this.$router.push('/project/case');
      }));
    },
    onJsonChange(value) {
      console.log('value:', value)
    },
    showModal(edit) {
      this.resetModal();
      if (edit) {
        this.title = '编辑参数注入';
      } else {
        this.title = '新增参数注入';
      }
      this.treeData = [];
      this.verfiedData(this.mockJson)
      this.visible = true;
    },
    handleOk(e) {
      e.preventDefault();
      // this.editForm.validateFields((err, values) => {
      //   if (!err) {
      //     this.newName = values.newName
      //     let params = {
      //       name: this.newName
      //     };
      //     let handler = data => this.getListPage(this.pagination.current, this.pagination.pageSize, this.name);
      //     debugger
      //     if (this.id) {
      //       params.id = this.id
      //       api.updateContactGroup(this.id, params, handler)
      //     } else {
      //       api.createContactGroup(params, handler)
      //     }
      //     this.resetModal();
      //     this.visible = false;
      //   }
      // });
    },
    cancelModal() {
      this.visible = false;
    },
    resetModal() {
      this.title = '';
    },
    extendAddInp() {
      this.extendModal.ste.push({value: ''})
    },
    extendDropInp(index) {
      debugger
      this.extendModal.ste.splice(index, 1)
    },
    extendSelect: function(selectedKeys, e) {
      this.backtracking(e.node)
      console.info(this.extendModal.dep.steps);
    },
    backtracking(node, _track) {
      const track = _track || this.extendModal.dep.steps;
      let key = node.eventKey;
      if (key !== undefined) {
        track.push(key)
        this.backtracking(node.$parent, track)
      }
    },
    // 从普通 json 转换为树需要的数据结构
    verfiedData(data, _prekey, _tns) {
      const tns = _tns || this.treeData
      // 判断子元素的数据类型
      let dataType = this.checkDataType(data)
      switch (dataType) {
        case 'object':
          const children = []
          // 记录key值，目的为了寻找对应的插入位置
          for (let i in data) {
            const key = i
            if (this.checkDataType(data[i]) === 'common' || this.checkDataType(data[i]) === 'null') {
              tns.push({
                title: `${key}`,
                key: key
              })
              // 如果没有子元素了，一定要插入一个占位符，不然会错位
              children.push('noChild')
            } else {
              tns.push({
                title: key,
                key
              })
              children.push(key)
            }
          }
          children.forEach((key, index) => {
            //寻找对应的插入位置，若没有子元素了，直接返回，如果有，插入key值为children的数组，再次调用函数
            if (key === 'noChild') {
              return tns
            } else {
              tns[index].children = []
              this.verfiedData(data[key], key, tns[index].children)
            }
          })
          break;
        case 'array':
          // 数组以下标作为key
          data.forEach((value, index) => {
            tns.push({
              title: '' + index,
              key: index
            })
            tns[index].children = []
            this.verfiedData(data[index], index, tns[index].children)
          });
          break;
        default:
          tns.push({
            title: data,
            key: _prekey
          })
      }
    },

    // 判断数据类型
    checkDataType(data) {
      let type = null
      if (typeof data === 'object') {
        // 对象
        if (Object.prototype.toString.call(data) === "[object Null]") {
          // null
          type = 'null'
        } else if (Object.prototype.toString.call(data) === "[object Array]") {
          // []
          type = 'array'
        } else if (Object.prototype.toString.call(data) === "[object Object]") {
          // {}
          type = 'object'
        }
      } else {
        // 除 null 的基本数据类型
        type = 'common'
      }
      return type
    }
  },
  components: {
    vueJsonEditor
  },
}
</script>

<style scoped>
@import "add-case.css";
</style>
