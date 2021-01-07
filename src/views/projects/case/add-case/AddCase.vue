<template>
  <div class="add-case" style="padding:30px">
    <a-card title="新增用例">
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
                           v-model="json"
          />
        </a-form-item>
        <a-form-item :label="`结果示例: `">
          <vue-json-editor :show-btns="false"
                           :expandedOnStart="true"
                           @json-change="onJsonChange"
                           style="width: 30%; height: 200px"
                           lang="zh"
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

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'add-case'});
  },
  beforeMount() {
    const {
      projectId
    } = this.$route.query
    this.projectId = projectId
    this.getGroups()
  },
  data() {
    return {
      json: {
        msg: 'demo of jsoneditor'
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
      ]
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
    onJsonChange (value) {
      console.log('value:', value)
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
