<template>
  <div class="add-file" style="padding:30px">
    <a-card title="新增文件">
      <a-form
          id="add-file-form"
          :form="form"
          class="file-form"
          @submit="handleSubmit"
      >
        <a-form-item :label="`名 称: `">
          <a-input class="file-name" style="width: 10%"
                   v-decorator="[
          'name',
          { rules: [{ required: true, message: '联系人名称不可为空！' }] },
        ]"
                   placeholder="请输入联系人名称"
          >
          </a-input>
        </a-form-item>

        <a-form-item :label="`分 组: `">
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'group_id',
                      { rules: [{
                          required: true, message: '联系人分组不可为空！' }
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
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                @change="handleChange"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
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
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import api from "@/plugins/api";

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'add-file'});
  },
  beforeMount() {
    this.getGroups()
  },
  data() {
    return {
      groups: [],
      fileName: '',
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          api.createFile()
        }
      });
    },
    getGroups: function () {
      api.listFileGroup({
        page: 1,
        page_size: 999
      }, (data => {
        this.groups = data.records;
      }));
    },
    createFile: function (params) {
      this.request.post('/contactor/', params, (data => {
        this.$router.push('/contact');
      }))
    },
    handleChange: function (info) {

    }
  }
}
</script>

<style scoped>
@import "add-file.css";
</style>
