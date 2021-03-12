<template>
  <div class="add-case" style="padding:30px">
    <a-card title="更新用例">
      <a-modal :visible="extendVisible" :title="extendTitle" @ok="extendHandleOk" @cancel="extendCancelModal">
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
              <a-select style="width: 50%"
                        show-search
                        placeholder="请输入用例名称"
                        option-filter-prop="children"
                        :filter-option="filterOption"
                        @change="value => extendSelectChange(value)"
                        v-model="extendModal.dep.depend">
                <a-select-option v-for="item in extendModal.cases" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-tree class="draggable-tree"
                      :tree-data="extendTreeData"
                      @select="extendSelect"/>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal :visible="expectedVisible" :title="expectedTitle" @ok="expectedHandleOk" @cancel="expectedCancelModal">
        <a-form id="expected-modal-form" class="expected-form">
          <a-form-item :label="`预期字段: `">
            <div v-for="(item, index) in this.expectedModal.ste">
              <a-input :key="`input`+index" v-model="item.value" class="step" placeholder="请输入预期字段" style="width: 70%"/>
            </div>
          </a-form-item>
          <a-form-item :label="`预期值: `">
            <div>
              <a-radio-group v-model:value="expectedModal.valueOrDepend">
                <a-radio :value="1">
                  固定值
                </a-radio>
                <a-radio :value="2">
                  依赖值
                </a-radio>
              </a-radio-group>
            </div>
            <div v-if="expectedModal.valueOrDepend === 1">
              <a-input v-model="expectedModal.dep.value" placeholder="请输入预期值" style="width: 70%"/>
            </div>
            <div v-if="expectedModal.valueOrDepend === 2">
              <a-select style="width: 50%"
                        show-search
                        placeholder="请输入用例名称"
                        option-filter-prop="children"
                        :filter-option="filterOption"
                        @change="value => expectedSelectChange(value)"
                        v-model="expectedModal.dep.depend" allowClear>
                <a-select-option v-for="item in expectedModal.cases" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-tree class="draggable-tree"
                      :tree-data="expectedTreeData"
                      @select="expectedSelect"/>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-form id="add-case-form" :form="form" class="case-form" @submit="handleSubmit">
        <a-form-item :label="`排 序: `" hidden>
          <a-input class="case-sort" style="width: 10%"
                   v-decorator="['sort']"
                   placeholder="请输入用例排序"
          />
        </a-form-item>
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
          <div class="case-headers">
            <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code"
                         v-decorator="[
                            'headers',
                            {
                              rules: [{
                                required: false
                              }],
                              initialValue: null,
                            }
                    ]"
            />
          </div>
        </a-form-item>
        <a-form-item :label="`请求参数: `">
          <div class="params-form">
            <span class="switch">
              JSON <a-switch checked-children="开" un-checked-children="关" default-checked @change="changeJsonSwitch" />
              <a-popover placement="topLeft">
                <template #content>
                  请尽量避免切换<br/>
                  因为从 JSON 组件回到树形组件时<br/>
                  所有数组类型的 key 将被重命名<br/>
                  从树形组件到 JSON 组件时<br/>
                  所有为空的字段将被忽略<br/>
                  虽然这无关紧要<br/>
                  但还是尽量不要花里胡哨
                </template>
                <a-icon type="question-circle" style="font-size: 15px; color: #52c41a; padding: 10px" />
              </a-popover>
            </span>
            <json-editor  v-if="jsonSwitch" class="json-editor" :show-btns="false" :expandedOnStart="true" mode="code" v-model="params" />
            <json-param-editor v-else class="json-param" :value="schemaParams" :files="fileTreeData" disabled-type/>
          </div>
        </a-form-item>
        <a-form-item :label="`参数注入: `">
          <a-table :columns="extendColumns" :data-source="extendData" :pagination="false"
                   style="width: 50%" size="small" bordered tableLayout="fixed">
            <span slot="extend_key" slot-scope="text, record">
              <span v-for="(item, index) in record.ste">
                {{ item.value }}
                <span :key="index" v-if="index + 1 < record.ste.length">
                   >
                </span>
              </span>
            </span>
            <span slot="extend_value" slot-scope="text, record">
              <span v-for="(item, index) in record.dep.steps">
                {{ item }}
                <span :key="index" v-if="index + 1 < record.dep.steps.length">
                   >
                </span>
              </span>
            </span>
            <span slot="extend_action" slot-scope="text, record">
              <a-button size='small' type="link" @click="extendEdit(record)">
                编 辑
              </a-button>
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除?"
                            ok-text="是"
                            cancel-text="否"
                            @confirm="extendDelete(record)"
                            @cancel="record => record"
              >
                <a-button v-if="record.extend_key !== 'button'" size='small' type="link"
                          @click="record => record">
                  删 除
                </a-button>
              </a-popconfirm>
            </span>
          </a-table>
          <a-button size='small' type="link" @click="extendAdd">
            <a-icon type="plus"/>
            新增注入
          </a-button>
        </a-form-item>
        <a-form-item :label="`预期结果: `">
          <a-table :columns="expectedColumns" :data-source="expectedData" :pagination="false"
                   style="width: 50%" size="small" bordered tableLayout="fixed">
            <span slot="expected_key" slot-scope="text, record">
              <span v-for="(item, index) in record.ste">
                {{ item.value }}
              </span>
            </span>
            <span slot="expected_value" slot-scope="text, record">
              <span v-if="record.valueOrDepend === 1">
                {{ record.dep.value }}
              </span>
              <span v-if="record.valueOrDepend === 2" v-for="(item, index) in record.dep.steps">
                {{ item }}
                <span :key="index" v-if="index + 1 < record.dep.steps.length">
                   >
                </span>
              </span>
            </span>
            <span slot="expected_action" slot-scope="text, record">
              <a-button size='small' type="link" @click="expectedEdit(record)">
                编 辑
              </a-button>
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除?"
                            ok-text="是"
                            cancel-text="否"
                            @confirm="expectedDelete(record)"
                            @cancel="record => record"
              >
                <a-button v-if="record.extend_key !== 'button'" size='small' type="link"
                          @click="record => record">
                  删 除
                </a-button>
              </a-popconfirm>
            </span>
          </a-table>
          <a-button size='small' type="link" @click="expectedAdd">
            <a-icon type="plus"/>
            新增预期
          </a-button>
        </a-form-item>
        <a-form-item :label="`结果示例: `">
          <div class="case-sample">
            <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code" v-model="sample" />
          </div>
        </a-form-item>
        <a-form-item :label="`运 行: `">
          <a-switch checked-children="是" un-checked-children="否"
                    v-decorator="[
                        'run',
                        {
                          rules: [{
                            required: true, message: '是否运行不可为空！'
                          }],
                          initialValue: true,
                          valuePropName: 'checked'
                        }
                    ]"
          />
        </a-form-item>
        <a-form-item :label="`校验 HTTP 状态: `">
          <a-switch checked-children="是" un-checked-children="否"
                    v-decorator="[
                        'check_status',
                        {
                          rules: [{
                            required: true, message: '是否校验 HTTP 状态不可为空！'
                          }],
                          initialValue: false,
                          valuePropName: 'checked'
                        }
                    ]"
          />
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
        </a-form-item>
        <a-form-item :label="`开发者: `">
          <a-tree-select
              v-decorator="['developer']"
              style="width: 10%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="developTreeData"
              placeholder="选择开发者"
              allowClear
              tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item :label="`延迟时长: `">
          <a-input-number id="inputNumber"
                          :min="0"
                          :max="300"
                          v-decorator="[
                            'delay',
                            { rules: [
                                  { required: false }
                                ]
                            },
                          ]"
                          placeholder="延迟时长" />
          <a-popover placement="topLeft">
            <template #content>
              单位为秒，最大 300 秒
            </template>
            <a-icon type="question-circle" style="font-size: 18px; color: #52c41a; padding: 10px" />
          </a-popover>
        </a-form-item>
        <a-form-item :label="`备 注: `">
          <a-textarea class="case-remark"
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
          <a-button type="primary" html-type="submit" class="case-form-button">
            确 定
          </a-button>
          <a-divider type="vertical"/>
          <a-button class="case-form-button" @click="cancelSubmit">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import api from '@/plugins/api'
import JsonParamEditor from '@/views/common/json-params'
import {json2JsonSchema, jsonSchema2Json, json2TreeData} from '@/utils/utils'

const extendColumns = [
  {
    title: '注入键',
    key: 'extend_key',
    scopedSlots: {customRender: 'extend_key'},
    align: 'center'
  },
  {
    title: '注入值',
    key: 'extend_value',
    scopedSlots: {customRender: 'extend_value'},
    align: 'center'
  },
  {
    title: '操作',
    key: 'extend_action',
    scopedSlots: {customRender: 'extend_action'},
    align: 'center'
  }
];
const expectedColumns = [
  {
    title: '预期字段',
    key: 'expected_key',
    scopedSlots: {customRender: 'expected_key'},
    align: 'center'
  },
  {
    title: '预期值',
    key: 'expected_value',
    scopedSlots: {customRender: 'expected_value'},
    align: 'center'
  },
  {
    title: '操作',
    key: 'expected_action',
    scopedSlots: {customRender: 'expected_action'},
    align: 'center'
  }
];
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'add-case'});
  },
  beforeMount() {
    const { id, page, pageSize } = this.$route.query;
    this.id = id;
    this.page = page;
    this.pageSize = pageSize;
    api.treeContactor({}, data => this.developTreeData = data);
    api.treeFile({}, data => this.fileTreeData = data);
    this.getCase(id);
  },
  data() {
    return {
      cases: [],
      id: '',
      page: '',
      pageSize: '',
      jsonSwitch: true,
      params: {},
      schemaParams: {
        root: {
          'type': 'object',
        }
      },
      sample: {},
      projectId: '',
      developTreeData: [],
      fileTreeData: [],
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
      extendTitle: '',
      extendVisible: false,
      extendColumns,
      extendTreeData: [],
      extendModal: {
        index: -1,
        ste: [],
        dep: {
          depend: null,
          steps: []
        },
        cases: []
      },
      extendData: [],
      extendIndex: 0,
      expectedTitle: '',
      expectedVisible: false,
      expectedColumns,
      expectedTreeData: [],
      expectedModal: {
        index: -1,
        valueOrDepend: 1,
        ste: [
          {
            value: ''
          }
        ],
        dep: {
          depend: null,
          steps: [],
          value: ''
        },
        cases: []
      },
      expectedData: [],
      expectedIndex: 0
    }
  },
  methods: {
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    changeJsonSwitch(checked, event) {
      this.jsonSwitch = checked;
      if (checked) {
        try {
          this.params = jsonSchema2Json(this.schemaParams.root)
        } catch (e) {
          api.notification(this.$notification, '操作失败', e.message, 'error')
        }
      } else {
        try {
          let jsonSchema = {};
          json2JsonSchema(this.params, jsonSchema);
          this.schemaParams.root = jsonSchema;
        } catch (e) {
          debugger
          api.notification(this.$notification, '操作失败', '请检查 json 是否正确', 'error')
        }
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.buildExtend(values)
          this.buildExpected(values)
          this.updateCase(values)
        }
      });
    },
    cancelSubmit() {
      let query = {
        project: this.projectId
      };
      if (this.page) {
        query.page = this.page;
      }
      if (this.pageSize) {
        query.pageSize = this.pageSize;
      }
      this.$router.push({
        path: '/project/case',
        query: query
      });
    },
    buildExtend(value) {
      if (this.extendData.length > 0) {
        let extend_keys = [];
        let extend_values = [];
        for (let i = 0; i < this.extendData.length; i++) {
          let data = this.extendData[i];
          let steps = data.ste.map(t => t.value);
          extend_keys.push(steps);
          extend_values.push(data.dep);
        }
        value.extend_keys = extend_keys;
        value.extend_values = extend_values;
      }
    },
    parseExtend(keys, values) {
      for (let i = 0; i < keys.length; i++) {
        let ex =  {
          index: -1,
          ste: [],
          dep: {
            depend: null,
            steps: []
          }
        }
        ex.index = i + 1
        ex.ste = keys[i].map(t => {
          return { value: t }
        })
        ex.dep = values[i]
        this.extendData.push(ex)
      }
      this.extendIndex = this.extendData.length
      console.info(this.extendData)
    },
    buildExpected(value) {
      if (this.expectedData.length > 0) {
        let expected_keys = [];
        let expected_values = [];
        for (let i = 0; i < this.expectedData.length; i++) {
          let data = this.expectedData[i];
          expected_keys.push(data.ste.map(t => t.value));
          expected_values.push(data.dep);
        }
        value.expected_keys = expected_keys;
        value.expected_values = expected_values;
      }
    },
    parseExpected(keys, values) {
      for (let i = 0; i < keys.length; i++) {
        let ex =  {
          index: -1,
          valueOrDepend: 1,
          ste: [
            {
              value: ''
            }
          ],
          dep: {
            depend: null,
            steps: [],
            value: ''
          },
        }
        ex.index = i + 1
        ex.ste = keys[i].map(t => {
          return { value: t }
        })
        ex.dep = values[i]
        ex.valueOrDepend = (ex.dep.depend === undefined || ex.dep.depend === null) ? 1 : 2
        this.expectedData.push(ex)
      }
      this.expectedIndex = this.expectedData.length
    },
    updateCase: function (params) {
      if (!this.jsonSwitch) {
        try {
          this.params = jsonSchema2Json(this.schemaParams.root)
        } catch (e) {
          api.notification(this.$notification, '操作失败', e.message, 'error')
          return
        }
      }
      if (this.params) {
        params.params = this.params;
      }
      if (this.sample) {
        params.sample = this.sample;
      }
      params.project_id = this.projectId;
      params.id = this.id
      api.updateCase(this.id, params, (data => {
        let query = {
          project: this.projectId
        };
        if (this.page) {
          query.page = this.page;
        }
        if (this.pageSize) {
          query.pageSize = this.pageSize;
        }
        this.$router.push({
          path: '/project/case',
          query: query
        });
      }));
    },
    getCase: function (id) {
      api.getCase(id, { id: id }, data => {
        this.projectId = data.project_id
        this.form.setFieldsValue(data)
        this.params = data.params !== null ? data.params : {}
        this.sample = data.sample !== null ? data.sample : {}
        if (data.extend_keys !== null && data.extend_keys.length > 0) {
          this.parseExtend(data.extend_keys, data.extend_values)
        }
        if (data.expected_keys !== null && data.expected_keys.length > 0) {
          this.parseExpected(data.expected_keys, data.expected_values)
        }
        id = Number(id)
        api.listCase({ page: 1, page_size: 9999, project_id: this.projectId }, data => this.cases = data.records.filter(item => item.id !== id));
      });
    },
    // extend modal
    extendAdd() {
      this.extendTitle = '新增参数注入';
      this.extendFillCases();
      this.extendVisible = true;
    },
    extendSelectChange(caseId) {
      let item = {};
      for (let i = 0; i < this.extendModal.cases.length; i++) {
        if (this.extendModal.cases[i].id === caseId) {
          item = this.extendModal.cases[i]
          break
        }
      }
      if (item && item.sample) {
        this.verfiedData(item.sample, null, null, this.extendTreeData)
      } else {
        this.$notification.error({
          message: '错误提示',
          description: '当前选择不存在 sample 无法使用',
          duration: 3
        });
      }
    },
    extendHandleOk(e) {
      e.preventDefault();
      if (this.extendModal.ste.length === 0
          || this.extendModal.dep.depend === null
          || this.extendModal.dep.depend === undefined
          || this.extendModal.dep.steps.length === 0) {
        this.$notification.warn({
          message: '警告',
          description: '步骤和依赖不匹配，将被忽略',
          duration: 3
        });
        this.extendCancelModal();
        return;
      }
      if (this.extendModal.index !== -1) {
        for (let i = 0; i < this.extendData.length; i++) {
          if (this.extendData[i].index === this.extendModal.index) {
            this.extendData[i] = this.extendModal;
          }
        }
      } else {
        this.extendIndex += 1;
        this.extendModal.index = this.extendIndex;
        this.extendData.push(this.extendModal);
      }
      this.extendCancelModal();
    },
    extendCancelModal() {
      this.extendTitle = '';
      this.extendModal = {
        index: -1,
        ste: [],
        dep: {
          depend: null,
          steps: []
        },
        cases: []
      };
      this.extendTreeData = [];
      this.extendVisible = false;
    },
    extendAddInp() {
      this.extendModal.ste.push({value: ''})
    },
    extendDropInp(index) {
      this.extendModal.ste.splice(index, 1)
    },
    extendSelect: function (selectedKeys, e) {
      this.extendModal.dep.steps = [];
      this.backtracking(e.node, null, this.extendModal.dep.steps);
      this.extendModal.dep.steps.reverse();
    },
    extendEdit(record) {
      this.extendTitle = '编辑参数注入';
      this.extendModal = record
      this.extendFillCases();
      for (let i = 0; i < this.extendModal.cases.length; i++) {
        if (this.extendModal.cases[i].id === this.extendModal.dep.depend) {
          this.verfiedData(this.extendModal.cases[i].sample, null, null, this.extendTreeData)
          break
        }
      }
      this.extendVisible = true
    },
    extendDelete(record) {
      this.extendData.splice(record.index - 1, 1)
    },
    extendFillCases() {
      this.extendModal.cases = this.cases;
    },
    // expected modal
    expectedAdd() {
      this.expectedTitle = '新增预期结果';
      this.expectedFillCases();
      this.expectedVisible = true;
    },
    expectedSelectChange(caseId) {
      let item = {};
      for (let i = 0; i < this.expectedModal.cases.length; i++) {
        if (this.expectedModal.cases[i].id === caseId) {
          item = this.expectedModal.cases[i]
          break
        }
      }
      if (item && item.sample) {
        this.verfiedData(item.sample, null, null, this.expectedTreeData)
      } else {
        this.$notification.error({
          message: '错误提示',
          description: '当前选择不存在 sample 无法使用',
          duration: 3
        });
      }
    },
    expectedHandleOk(e) {
      e.preventDefault();
      if (this.expectedModal.valueOrDepend === 1) {
        this.expectedModal.dep.steps = this.expectedModal.ste;
        this.expectedModal.dep.depend = null;
      } else {
        this.expectedModal.dep.value = ''
      }
      if (this.expectedModal.ste.length === 0
          || (this.expectedModal.valueOrDepend === 1 && (this.expectedModal.dep.value === ''
              || this.expectedModal.dep.value === undefined))
          || (this.expectedModal.valueOrDepend === 2 && (this.expectedModal.dep.depend === null
              || this.expectedModal.dep.depend === undefined))
          || this.expectedModal.dep.steps.length === 0) {
        this.$notification.warn({
          message: '警告',
          description: '预期字段和预期值不匹配，将被忽略',
          duration: 3
        });
        this.expectedCancelModal();
        return;
      }
      if (this.expectedModal.index !== -1) {
        for (let i = 0; i < this.expectedData.length; i++) {
          if (this.expectedData[i].index === this.expectedModal.index) {
            this.expectedData[i] = this.expectedModal;
          }
        }
      } else {
        this.expectedIndex += 1;
        this.expectedModal.index = this.expectedIndex;
        this.expectedData.push(this.expectedModal);
      }
      this.expectedCancelModal();
    },
    expectedCancelModal() {
      this.expectedTitle = '';
      this.expectedModal = {
        index: -1,
        valueOrDepend: 1,
        ste: [
          {
            value: ''
          }
        ],
        dep: {
          depend: null,
          steps: [],
          value: ''
        },
        cases: []
      };
      this.expectedTreeData = [];
      this.expectedVisible = false;
    },
    expectedSelect: function (selectedKeys, e) {
      this.expectedModal.dep.steps = [];
      this.backtracking(e.node, null, this.expectedModal.dep.steps);
      this.expectedModal.dep.steps.reverse();
    },
    expectedEdit(record) {
      this.expectedTitle = '编辑预期结果';
      this.expectedModal = record
      this.expectedFillCases();
      for (let i = 0; i < this.expectedModal.cases.length; i++) {
        if (this.expectedModal.cases[i].id === this.expectedModal.dep.depend) {
          this.verfiedData(this.expectedModal.cases[i].sample, null, null, this.expectedTreeData)
          break
        }
      }
      this.expectedVisible = true
    },
    expectedDelete(record) {
      this.expectedData.splice(record.index - 1, 1)
    },
    expectedFillCases() {
      this.expectedModal.cases = this.cases;
    },
    // 计算链路
    backtracking(node, _track, sourceTrack) {
      const track = _track || sourceTrack;
      let key = node.eventKey;
      if (key !== undefined) {
        track.push(key)
        this.backtracking(node.$parent, track, null)
      }
    },
    // 从普通 json 转换为树需要的数据结构
    verfiedData(data, _prekey, _tns, _data) {
      const tns = _tns || _data;
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
              this.verfiedData(data[key], key, tns[index].children, null)
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
            this.verfiedData(data[index], index, tns[index].children, null)
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
  components: { JsonParamEditor },
}
</script>

<style scoped>
@import "update-case.css";
</style>
