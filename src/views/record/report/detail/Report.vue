<template>
  <div>
    <a-card :tab-list="tabList" :active-tab-key="activeTab" @tabChange="key => activeTab = key">
      <div v-if="activeTab === 'case'">
        <a-form class="report-info-form">
          <a-row :gutter="24">
            <a-col :span="7">
              <a-form-item :label="`名 称: `">
                {{ detail.name }}
              </a-form-item>
              <a-form-item :label="`请求方式: `">
                {{ detail.method }}
              </a-form-item>
              <a-form-item :label="`请求地址: `">
                {{ detail.host }}
              </a-form-item>
              <a-form-item :label="`请求路径: `">
                {{ detail.path }}
              </a-form-item>
              <a-form-item :label="`运 行: `">
                <a-switch checked-children="是" un-checked-children="否" :checked="detail.run" disabled/>
              </a-form-item>
              <a-form-item :label="`校验 HTTP 状态: `">
                <a-switch checked-children="是" un-checked-children="否" :checked="detail.checkStatus" disabled/>
              </a-form-item>
              <a-form-item :label="`预期 HTTP 状态码: `">
                {{ detail.expectedHttpStatus }}
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
                    disabled
                >
                </a-tree-select>
              </a-form-item>
              <a-form-item :label="`延迟时长: `">
                {{ `${detail.delay}s` }}
              </a-form-item>
              <a-form-item :label="`备 注: `">
                {{ detail.remark }}
              </a-form-item>
              <a-form-item :label="`请求头: `">
                <div class="case-headers">
                  <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code" v-model="detail.headers"/>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="1" class="col-divider">
              <a-divider type="vertical" :dashed="true"/>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="`请求参数: `">
                <div class="params-form">
                  <json-editor class="json-editor" :show-btns="false" :expandedOnStart="true" mode="code" v-model="detail.params"/>
                </div>
              </a-form-item>
              <a-form-item :label="`动态参数: `">
                <a-table :columns="extendColumns" :data-source="extendData" :pagination="false" size="small" bordered tableLayout="fixed">
                  <span slot="extend_key" slot-scope="text, record">
                    <span v-for="(item, index) in record.ste">
                      {{ item.value }}
                      <span :key="index" v-if="index + 1 < record.ste.length">
                         >
                      </span>
                    </span>
                  </span>
                  <span slot="extend_depend" slot-scope="text, record">
                    <span>
                      {{ getCaseName(record.dep.depend) }}
                    </span>
                  </span>
                  <span slot="extend_value" slot-scope="text, record">
                    <span v-for="(item, index) in record.dep.steps">
                      {{ item }}
                      <span :key="index" v-if="index + 1 < record.dep.steps.length">
                        >
                      </span>
                    </span>
                    <a-button type="link" size="small" @click="dependDetail(record.dep.depend)"><a-icon type="eye" /></a-button>
                  </span>
                </a-table>
              </a-form-item>
              <a-form-item :label="`预期结果: `">
                <a-table :columns="expectedColumns" :data-source="expectedData" :pagination="false" size="small" bordered tableLayout="fixed">
                  <span slot="expected_key" slot-scope="text, record">
                    <span v-for="(item, index) in record.ste">
                      {{ item.value }}
                      <span :key="index" v-if="index + 1 < record.ste.length">
                         >
                      </span>
                    </span>
                  </span>
                  <span slot="expected_depend" slot-scope="text, record">
                    <span v-if="record.dep.fixed">
                      -
                    </span>
                    <span v-if="!record.dep.fixed">
                      {{ getCaseName(record.dep.depend) }}
                    </span>
                  </span>
                  <span slot="expected_value" slot-scope="text, record">
                    <span v-if="record.dep.fixed">
                      {{ record.dep.value }}
                    </span>
                    <span v-if="!record.dep.fixed" v-for="(item, index) in record.dep.steps">
                      {{ item }}
                      <span :key="index" v-if="index + 1 < record.dep.steps.length">
                        >
                      </span>
                    </span>
                    <a-button v-if="!record.dep.fixed" type="link" size="small" @click="dependDetail(record.dep.depend)"><a-icon type="eye" /></a-button>
                  </span>
                </a-table>
              </a-form-item>
              <a-form-item :label="`结果示例: `">
                <div class="case-sample">
                  <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code" v-model="detail.sample" />
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="1" class="col-divider">
              <a-divider type="vertical" :dashed="true"/>
            </a-col>
            <a-col :span="7">
              <a-form-item :label="`请求耗时: `">
                {{ `${detail.timeUsed}ms` }}
              </a-form-item>
              <a-form-item :label="`请求结果: `">
                <a-icon type="check-circle" style="font-size: 20px; color: #52c41a" v-if="detail.status === 'PASSED'"/>
                <a-icon type="close-circle" style="font-size: 20px; color: #ff0000" v-if="detail.status === 'FAILED'"/>
                <a-icon type="pause-circle" style="font-size: 20px; color: #7f7f7f" v-if="detail.status === 'IGNORED'"/>
              </a-form-item>
              <a-form-item :label="`接口返回: `">
                <div class="case-sample">
                  <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code" v-model="detail.responseContent" />
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div v-else>
        project
      </div>
    </a-card>
  </div>
</template>

<script>
import api from "@/plugins/api";
const extendColumns = [
  {
    title: '插入位置',
    key: 'extend_key',
    scopedSlots: {customRender: 'extend_key'},
    align: 'center'
  },
  {
    title: '取值依赖',
    key: 'extend_depend',
    scopedSlots: {customRender: 'extend_depend'},
    align: 'center'
  },
  {
    title: '取值过程',
    key: 'extend_value',
    scopedSlots: {customRender: 'extend_value'},
    align: 'center'
  }
];
const expectedColumns = [
  {
    title: '校验字段',
    key: 'expected_key',
    scopedSlots: {customRender: 'expected_key'},
    align: 'center'
  },
  {
    title: '预期依赖',
    key: 'expected_depend',
    scopedSlots: {customRender: 'expected_depend'},
    align: 'center'
  },
  {
    title: '预期值',
    key: 'expected_value',
    scopedSlots: {customRender: 'expected_value'},
    align: 'center'
  }
];
export default {
  beforeMount() {
    const { id } = this.$route.query;
    this.initInfo(id);
  },
  data() {
    return {
      cases: [],
      detail: {},
      extendData: [],
      expectedData: [],
      extendColumns,
      expectedColumns,
      tabList: [
        {
          key: 'case',
          tab: '执行结果'
        },
        {
          key: 'project',
          tab: '项目信息'
        }
      ],
      activeTab: 'case'
    }
  },
  methods: {
    getCaseName(id) {
      console.log(id)
      console.log(this.cases)
      console.log(this.extendData)
      return this.cases.filter(item => item.id === id)[0].name;
    },
    dependDetail: function (caseId) {
      this.$router.push({
        path: '/project/case/update-case',
        query: {
          id: caseId
        }
      });
    },
    initInfo: function (id) {
      api.getReport(id, { id: id }, data => {
        this.detail = data;
        this.detail.params = data.params !== null ? data.params : {}
        this.detail.sample = data.sample !== null ? data.sample : {}
        if (data.dependencies && data.dependencies.length > 0) {
          this.parseExtend(data.dependencies)
        }
        if (data.expects && data.expects.length > 0) {
          this.parseExpected(data.expects)
        }
        api.listCase({ current: 1, size: 9999, projectId: data.projectId }, data => this.cases = data.records.filter(item => item.id !== id));
      });
    },
    parseExtend(dependencies) {
      for (let i = 0; i < dependencies.length; i++) {
        let ex =  {
          index: -1,
          ste: [],
          dep: {
            depend: null,
            steps: []
          }
        };
        ex.index = i + 1;
        let dependency = dependencies[i];
        ex.ste = dependency.dependKey.map(t => {
          return { value: t }
        });
        ex.dep = dependency.dependValue;
        this.extendData.push(ex);
      }
      this.extendIndex = this.extendData.length
    },
    parseExpected(expects) {
      for (let i = 0; i < expects.length; i++) {
        let ex =  {
          index: -1,
          ste: [],
          dep: {
            fixed: true,
            depend: null,
            steps: [],
            value: ''
          },
        }
        ex.index = i + 1
        let expect = expects[i];
        ex.ste = expect.expectKey.map(t => {
          return { value: t }
        })
        ex.dep = expect.expectValue
        this.expectedData.push(ex)
      }
      this.expectedIndex = this.expectedData.length
    },
  }
}
</script>

<style scoped>
@import "report.css";
</style>
