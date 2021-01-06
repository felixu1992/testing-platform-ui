<template>
  <div class="add-project" style="padding:30px">
    <a-card title="新增项目">
      <a-form
          id="add-project-form"
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
          <a-input class="project-headers" style="width: 10%"
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
          <a-button type="primary" html-type="submit" class="project-form-button">
            确 定
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
    this.form = this.$form.createForm(this, {name: 'add-project'});
  },
  beforeMount() {
    this.getGroups()
  },
  data() {
    return {
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
      ]
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.createProjector(values)
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
    createProjector: function (params) {
      debugger
      api.createProject(params, (data => {
        this.$router.push('/project');
      }));
    },
  }
}
</script>

<style scoped>
@import "add-project.css";
</style>
