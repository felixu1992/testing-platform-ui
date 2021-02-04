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
                <a-switch checked-children="是" un-checked-children="否" :checked="detail.check_status" disabled/>
              </a-form-item>
              <a-form-item :label="`预期 HTTP 状态码: `">
                {{ detail.expected_http_status }}
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
              <a-form-item :label="`参数注入: `">
                <a-table :columns="extendColumns" :data-source="extendData" :pagination="false" size="small" bordered tableLayout="fixed">
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
                    <a-button type="link" size="small" @click="dependDetail(record.dep.depend)"><a-icon type="eye" /></a-button>
                  </span>
                </a-table>
              </a-form-item>
              <a-form-item :label="`预期结果: `">
                <a-table :columns="expectedColumns" :data-source="expectedData" :pagination="false" size="small" bordered tableLayout="fixed">
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
                    <a-button v-if="record.valueOrDepend === 2" type="link" size="small" @click="dependDetail(record.dep.depend)"><a-icon type="eye" /></a-button>
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
                {{ `${detail.time_used}ms` }}
              </a-form-item>
              <a-form-item :label="`请求结果: `">
                <a-icon type="check-circle" style="font-size: 20px; color: #52c41a" v-if="detail.status === 'PASSED'"/>
                <a-icon type="close-circle" style="font-size: 20px; color: #ff0000" v-if="detail.status === 'FAILED'"/>
                <a-icon type="pause-circle" style="font-size: 20px; color: #7f7f7f" v-if="detail.status === 'IGNORED'"/>
              </a-form-item>
              <a-form-item :label="`接口返回: `">
                <div class="case-sample">
                  <json-editor :show-btns="false" :expandedOnStart="true" lang="zh" mode="code" v-model="detail.response_content" />
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
    title: '注入参数',
    key: 'extend_key',
    scopedSlots: {customRender: 'extend_key'},
    align: 'center'
  },
  {
    title: '依赖步骤',
    key: 'extend_value',
    scopedSlots: {customRender: 'extend_value'},
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
  }
];
export default {
  beforeMount() {
    const { id } = this.$route.query;
    this.initInfo(id);
  },
  data() {
    return {
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
        if (data.extend_keys !== null && data.extend_keys.length > 0) {
          this.parseExtend(data.extend_keys, data.extend_values)
        }
        if (data.expected_keys !== null && data.expected_keys.length > 0) {
          this.parseExpected(data.expected_keys, data.expected_values)
        }
      });
    },
    parseExtend(keys, values) {
      for (let i = 0; i < keys.length; i++) {
        let ex =  {
          index: -1,
          ste: [],
          dep: {
            depend: '--请选择--',
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
            depend: '--请选择--',
            steps: [],
            value: ''
          },
        };
        ex.index = i + 1
        ex.ste = keys[i].map(t => {
          return { value: t }
        })
        ex.dep = values[i]
        ex.valueOrDepend = (ex.dep.depend === undefined || ex.dep.depend === '--请选择--') ? 1 : 2
        this.expectedData.push(ex)
      }
    },
  }
}
</script>

<style scoped>
@import "report.css";
</style>
