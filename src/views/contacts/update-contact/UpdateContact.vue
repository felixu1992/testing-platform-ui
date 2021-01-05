<template>
  <div class="update-contact-div" style="padding:30px">
    <a-card title="更新联系人">
      <a-form
          id="update-contact-form"
          :form="form"
          class="contact-form"
          @submit="handleSubmit"
      >
        <a-form-item>
          名 称：
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
          邮 箱：
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
          手 机：
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
          分 组：
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
        <a-form-item>
          <a-button type="primary" html-type="submit" class="contact-form-button">
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
  name: "UpdateContact",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'update-contact'});
  },
  beforeMount() {
    this.getGroups()
    const {
      id
    } = this.$route.query
    this.id = id
    this.getContact(id)
  },
  data() {
    return {
      groups: [],
      id: '',
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.id
          debugger
          this.updateContact(this.id, values)
        }
      });
    },
    getGroups: function () {
      api.listContactorGroup({
        page: 1,
        page_size: 999
      }, (data => {
        this.groups = data.records;
      }))
    },
    getContact(id) {
      this.request.get('/contactor/' + id + '/', {}, (data => {
        this.form.setFieldsValue(data)
      }));
    },
    updateContact(id, params) {
      this.request.put('/contactor/' + id + '/', params, (data => {
        this.$router.push('/contact')
      }))
    }
  }
}
</script>

<style scoped>
@import "update-contact.css";
</style>
