<template>
  <div class="update-file" style="padding:30px">
    <a-card title="更新文件">
      <a-form
          id="update-file-form"
          :form="form"
          class="file-form"
          @submit="handleSubmit"
      >
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
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'group_id',
                      { rules: [{
                          required: true, message: '文件分组不可为空！' }
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
    }
  },
  methods: {
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
          formData.append('group_id', values.group_id);
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
      api.listFileGroup({
        page: 1,
        page_size: 999
      }, (data => {
        this.groups = data.records;
      }));
    },
    handleChange: function (info) {
      if (info.file.status !== 'removed'){
        let file = info.fileList[info.fileList.length - 1]
        this.fileList.splice(0, this.fileList.length)
        this.fileList.push(file)
      }
    }
  }
}
</script>

<style scoped>
@import "update-file.css";
</style>
