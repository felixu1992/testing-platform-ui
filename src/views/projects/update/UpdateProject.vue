<template>
  <div class="update-project" style="padding:30px">
    <a-card title="编辑项目">
      <a-form
          id="update-project-form"
          :form="form"
          class="project-form"
          @submit="handleSubmit"
      >
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
          <vue-json-editor :show-btns="false" :expandedOnStart="true" style="width: 50%; height: 200px" lang="zh" mode="code"
                           v-decorator="[
                            'headers',
                            {
                              rules: [{
                                required: false
                              }]
                            }
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
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'group_id',
                      { rules: [
                            { required: true, message: '项目分组不可为空！' }
                          ],
                        initialValue: '--请选择--'
                      }
                    ]"
          >
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
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'update-project'});
  },
  beforeMount() {
    this.getGroups()
    const {
      id
    } = this.$route.query
    this.id = id
    this.getProject(id)
  },
  data() {
    return {
      groups: [],
      id: '',
      notifyData: [
        {
          value: true,
          text: '是'
        },
        {
          value: false,
          text: '否'
        }
      ]
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.id
          this.updateProject(this.id, values)
        }
      });
    },
    getGroups: function () {
      api.listProjectGroup({
        page: 1,
        page_size: 999
      }, (data => {
        this.groups = data.records;
      }))
    },
    getProject(id) {
      api.getProject(id, {}, (data => {
        this.form.setFieldsValue(data)
      }));
    },
    updateProject(id, params) {
      api.updateProject(id, params, (data => {
        this.$router.push('/project')
      }));
    }
  }
}
</script>

<style scoped>
@import "update-project.css";
</style>
